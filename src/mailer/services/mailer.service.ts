import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MAILER_ERRORS } from '../constants/mailer-errors';
import { ConfigService } from '@nestjs/config';
import { SendMailDto } from '../dto/send-mail.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import { SendMailWithTemplateDto } from '../dto/send-mail-with-template.dto';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly config: ConfigService) {
    const mailHost = config.get('MAIL_HOST');
    if (!mailHost) throw MAILER_ERRORS.MAIL_HOST;

    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  public sendEmailWithTemplate(
    dto: SendMailWithTemplateDto,
    context: object,
    template: string,
  ): Promise<SMTPTransport.SentMessageInfo> {
    const filename = path.join(
      process.cwd(),
      'src/mailer/templates',
      `${template}.ejs`,
    );

    if (!fs.existsSync(filename)) throw MAILER_ERRORS.NOT_FOUND_TEMPLATE;

    const templateString = fs.readFileSync(filename, { encoding: 'utf-8' });

    const body = ejs.render(templateString, { context });

    return this.mailSender({
      emailAddress: dto.emailAddress,
      title: dto.title,
      message: body,
    });
  }

  private mailSender(dto: SendMailDto) {
    if (!this.transporter) throw MAILER_ERRORS.TRANSPORTER;

    return this.transporter.sendMail({
      to: dto.emailAddress,
      from: this.config.get('MAIL_FROM'),
      subject: dto.title,
      html: dto.message,
    });
  }
}

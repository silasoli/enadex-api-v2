import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MAILER_ERRORS } from '../constants/mailer-errors';
import { ConfigService } from '@nestjs/config';
import { SendMailDto } from '../dto/send-mail.dto';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly config:ConfigService){
    const mailHost = config.get("MAIL_HOST")
    if(!mailHost)throw MAILER_ERRORS.MAIL_HOST;

    this.transporter=nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
      ignoreTLS: true,
    })
  }

  mailSender(dto: SendMailDto) {
    if(!this.transporter)throw MAILER_ERRORS.TRANSPORTER;

    return this.transporter.sendMail({
      to: dto.emailAddress,
      from: this.config.get('MAIL_FROM'),
      subject: dto.title,
      html: dto.message,
    })
  }

 
}

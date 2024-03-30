import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CreateMailerDto } from '../dto/create-mailer.dto';
import { UpdateMailerDto } from '../dto/update-mailer.dto';
import { MAILER_ERRORS } from '../constants/mailer-errors';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  mailSender(dto: any) {
    if(!this.transporter)throw MAILER_ERRORS.TRANSPORTER;
  }

 
}

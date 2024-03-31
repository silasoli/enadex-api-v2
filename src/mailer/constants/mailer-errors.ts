import { ServiceUnavailableException } from '@nestjs/common';

export const MAILER_ERRORS = {
  TRANSPORTER: new ServiceUnavailableException({
    id: 'MAILER-001',
    message: 'Transportador não configurado.',
  }),
  MAIL_HOST: new ServiceUnavailableException({
    id: 'MAILER-002',
    message: 'Host de email não configurado.',
  }),
};
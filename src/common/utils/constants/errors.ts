import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

export const ERRORS = {
  USERS: {
    NOT_FOUND: new NotFoundException({
      id: 'USERS-001',
      message: 'Usuário não encontrado.',
    }),
  },
  AUTH: {
    INVALID_CREDENTIALS: new ForbiddenException({
      id: 'AUTH-001',
      message: 'Credenciais inválidas.',
    }),
    LACK_PERMISSION: new UnauthorizedException({
      id: 'AUTH-002',
      message: 'Usuário não tem permissão.',
    }),
  },
  RENTALS: {
    NOT_FOUND: new NotFoundException({
      id: 'RENTALS-001',
      message: 'Agendamento não encontrado.',
    }),
    PREVIOUS_CHECKIN: new BadRequestException({
      id: 'RENTALS-002',
      message: 'A data de check-out não pode ser anterior à data de check-in.',
    }),
    ADVANCE_CHECKIN: new BadRequestException({
      id: 'RENTALS-003',
      message:
        'Só é possível realizar uma reserva com no mínimo 1 dia de antecedência.',
    }),
    RENTAL_LIMIT: new BadRequestException({
      id: 'RENTALS-004',
      message: 'Só é possível realizar uma reserva de no máximo 3 dias.',
    }),
    RENTAL_CONFLICT: new ConflictException({
      id: 'RENTALS-005',
      message: 'Data não disponível.',
    }),
  },
  MAILER: {
    WEEKLY_TEST: new BadRequestException({
      id: 'MAILER-001',
      message: 'Error ao enviar email de teste semanal.',
    }),
    MAIL_HOST: new ServiceUnavailableException({
      id: 'MAILER-002',
      message: 'Host de email não configurado.',
    }),
    NOT_FOUND_TEMPLATE: new NotFoundException({
      id: 'MAILER-003',
      message: 'Template de email não encontrado.',
    }),
    TRANSPORTER: new ServiceUnavailableException({
      id: 'MAILER-004',
      message: 'Transportador não configurado.',
    }),
  },
  UTILS: {
    INVALID_DOCUMENT: new BadRequestException({
      id: 'UTILS-001',
      message: 'Documento inválido.',
    }),
  },
};

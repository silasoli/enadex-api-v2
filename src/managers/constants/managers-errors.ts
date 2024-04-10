import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

export const MANAGERS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'MANAGERS-001',
    message: 'Usuário não encontrado.',
  }),
  DUPLICATE_EMAIL: new ConflictException({
    id: 'MANAGERS-002',
    message: 'Este endereço de e-mail já está em uso.',
  }),
  LACK_PERMISSION: new ForbiddenException({
    id: 'MANAGERS-003',
    message: 'Usuário não tem permissão.',
  }),
};

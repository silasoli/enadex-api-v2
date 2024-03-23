import { NotFoundException } from '@nestjs/common';

export const MANAGERS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'MANAGERS-001',
    message: 'Usuário não encontrado.',
  }),
};

import { NotFoundException, ConflictException } from '@nestjs/common';

export const STUDENTS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'STUDENTS-001',
    message: 'Usuário não encontrado.',
  }),
  DUPLICATE_EMAIL: new ConflictException({
    id: 'STUDENTS-002',
    message: 'Este endereço de e-mail já está em uso.',
  }),
  NOT_FOUND_REQUEST: new NotFoundException({
    id: 'STUDENTS-003',
    message: 'Solicitação não encontrado.',
  }),
};

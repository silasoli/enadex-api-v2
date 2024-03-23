import { NotFoundException } from '@nestjs/common';

export const STUDENTS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'STUDENTS-001',
    message: 'Usuário não encontrado.',
  }),
};

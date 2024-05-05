import { NotFoundException } from '@nestjs/common';

export const COURSES_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'COURSES-001',
    message: 'Curso não encontrado.',
  }),
};

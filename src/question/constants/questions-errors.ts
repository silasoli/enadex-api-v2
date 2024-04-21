import { NotFoundException } from '@nestjs/common';

export const QUESTIONS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'QUESTIONS-001',
    message: 'Questão não encontrada.',
  })
};

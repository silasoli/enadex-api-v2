import { ConflictException, NotFoundException } from '@nestjs/common';

export const ANSWERS_QUESTIONS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'ANSWER-QUESTIONS-001',
    message: 'Resposta não encontrada.',
  }),
  ANSWER_ALREADY_EXISTS: new ConflictException({
    id: 'ANSWER-QUESTIONS-002',
    message: 'Questão já respondida já existe',
  }),
};

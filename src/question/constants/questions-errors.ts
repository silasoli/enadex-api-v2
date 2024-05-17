import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const QUESTIONS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'QUESTIONS-001',
    message: 'Questão não encontrada.',
  }),
  HAVE_CORRECT_OPTION: new UnprocessableEntityException({
    id: 'QUESTIONS-002',
    message: 'Não é permitido salvar uma questão sem alternativa correta.',
  }),
  MULTIPLE_CORRECT_OPTION: new UnprocessableEntityException({
    id: 'QUESTIONS-003',
    message:
      'Não é permitido salvar uma questão com varias alternativas corretas.',
  }),
};

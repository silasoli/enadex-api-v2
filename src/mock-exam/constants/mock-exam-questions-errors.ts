import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const MOCK_EXAM_QUESTIONS_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'MOCK-EXAM-QUESTIONS-001',
    message: 'Questão não encontrada.',
  }),
  HAVE_CORRECT_OPTION: new UnprocessableEntityException({
    id: 'MOCK-EXAM-QUESTIONS-002',
    message: 'Não é permitido salvar uma questão sem alternativa correta.',
  }),
  MULTIPLE_CORRECT_OPTION: new UnprocessableEntityException({
    id: 'MOCK-EXAM-QUESTIONS-003',
    message:
      'Não é permitido salvar uma questão com varias alternativas corretas.',
  }),
};

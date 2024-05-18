import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const MOCK_EXAM_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'SIMULADOS-001',
    message: 'Simulado não encontrada.',
  }),
  // HAVE_CORRECT_OPTION: new UnprocessableEntityException({
  //   id: 'QUESTIONS-002',
  //   message: 'Não é permitido salvar uma questão sem alternativa correta.',
  // }),
  // MULTIPLE_CORRECT_OPTION: new UnprocessableEntityException({
  //   id: 'QUESTIONS-003',
  //   message:
  //     'Não é permitido salvar uma questão com varias alternativas corretas.',
  // }),
};

import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const STUDENTS_MOCK_EXAM_ANSWER_ERRORS = {
  // NOT_FOUND: new NotFoundException({
  //   id: 'STUDENTS-MOCK-EXAM-ANSWER-001',
  //   message: 'Resposta não encontrada.',
  // }),
  OPTION_NOT_FOUND: new NotFoundException({
    id: 'STUDENTS-MOCK-EXAM-ANSWER-001',
    message: 'Opção selecionada não encontrada.',
  }),
  FINISHED_EXAM: new UnprocessableEntityException({
    id: 'STUDENTS-MOCK-EXAM-ANSWER-002',
    message: 'Simulado já finalizado.',
  }),
};

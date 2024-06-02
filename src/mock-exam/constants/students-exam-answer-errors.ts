import { NotFoundException } from '@nestjs/common';

export const STUDENTS_MOCK_EXAM_ANSWER_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'STUDENTS-MOCK-EXAM-ANSWER-001',
    message: 'Resposta não encontrada.',
  }),
};

import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const STUDENTS_MOCK_EXAM_ERRORS = {
  CLOSED_MOCK_EXAM: new UnprocessableEntityException({
    id: 'STUDENTS-MOCK-EXAM-001',
    message: 'Simulado não disponivel.',
  }),
  NOT_FOUND: new NotFoundException({
    id: 'STUDENTS-MOCK-EXAM-002',
    message: 'Simulado não encontrado.',
  }),
  EXIST_MOCK_EXAM: new ConflictException({
    id: 'STUDENTS-MOCK-EXAM-003',
    message: 'Simulado já respondido.',
  }),
  YEAR_MOCK_EXAM: new ConflictException({
    id: 'STUDENTS-MOCK-EXAM-004',
    message: 'Simulado já respondido neste ano.',
  }),
};

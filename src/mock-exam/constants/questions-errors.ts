import { NotFoundException } from '@nestjs/common';

export const MOCK_EXAM_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'SIMULADOS-001',
    message: 'Simulado não encontrada.',
  }),
};

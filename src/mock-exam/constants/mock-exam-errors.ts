import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const MOCK_EXAM_ERRORS = {
  NOT_FOUND: new NotFoundException({
    id: 'SIMULADOS-001',
    message: 'Simulado não encontrada.',
  }),
  AVAILABLE_MOCK_EXAM: new UnprocessableEntityException({
    id: 'SIMULADOS-002',
    message: 'Não é permitido modificar um simulado em andamento.',
  }),
  FINISHED_MOCK_EXAM: new UnprocessableEntityException({
    id: 'SIMULADOS-003',
    message: 'Não é permitido modificar um simulado finalizado.',
  }),
  IS_AVAILABLE: new ConflictException({
    id: 'SIMULADOS-004',
    message: 'Este simulado já está disponível.',
  }),
  IS_FINISHED: new ConflictException({
    id: 'SIMULADOS-005',
    message: 'Este simulado já está finalizado.',
  }),
};

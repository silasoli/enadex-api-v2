import { UnprocessableEntityException } from '@nestjs/common';

export const FORGOT_PASSWORD_ERRORS = {
  INVALID_CODE: new UnprocessableEntityException({
    id: 'FP-001',
    message: 'Código inválido.',
  }),
  INVALID_CODE_TIME: new UnprocessableEntityException({
    id: 'FP-002',
    message: 'Código invalidado por tempo.',
  }),
};

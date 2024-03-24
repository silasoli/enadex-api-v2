import { UnauthorizedException } from '@nestjs/common';

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: new UnauthorizedException({
    id: 'AUTH-001',
    message: 'Dados invalidos.',
  }),
};

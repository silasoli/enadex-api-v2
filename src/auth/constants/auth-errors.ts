import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: new UnauthorizedException({
    id: 'AUTH-001',
    message: 'Dados invalidos.',
  }),
  LACK_PERMISSION: new ForbiddenException({
    id: 'AUTH-002',
    message: 'Usuário não tem permissão.',
  }),
  USER_DISABLED: new UnauthorizedException({
    message: 'Unauthorized',
  }),
};

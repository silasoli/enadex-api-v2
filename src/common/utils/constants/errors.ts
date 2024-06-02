import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

export const ERRORS = {
  AUTH: {
    INVALID_CREDENTIALS: new UnauthorizedException({
      id: 'AUTH-001',
      message: 'Credenciais inválidas.',
    }),
    LACK_PERMISSION: new ForbiddenException({
      id: 'AUTH-002',
      message: 'Usuário não tem permissão.',
    }),
  },
  UTILS: {
    INVALID_DOCUMENT: new BadRequestException({
      id: 'UTILS-001',
      message: 'Documento inválido.',
    }),
  },
};

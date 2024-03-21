import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorInfo: MongoException = MongoErrors[exception.code] || {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Bad Request',
      messageByField: 'Internal server error',
    };

    const field = this.extractFieldFromErrorMessage(exception.errmsg);
    const message = errorInfo.messageByField(field);

    response.status(errorInfo.status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        message: [message],
        error: errorInfo.error,
        statusCode: errorInfo.status,
      },
    });
  }

  private extractFieldFromErrorMessage(errmsg: string): string | undefined {
    const match = errmsg.match(/\{([^}]+)\}/);
    const fieldData = match[1].split(':')[0].trim();
    if (fieldData) return fieldData;
    return undefined;
  }
}

export type MongoException = {
  status: HttpStatus;
  error: string;
  messageByField: string | any;
};

export const MongoErrors = {
  11000: {
    status: HttpStatus.CONFLICT,
    error: 'Conflict',
    messageByField: (field: string): string => {
      const messages = MongoExceptionErrors[11000].messages;
      return messages[field] || messages.default;
    },
  },
};

export const MongoExceptionErrors = {
  11000: {
    messages: {
      username: 'O nome de usuário já está em uso.',
      name: 'Este nome já está em uso.',
      email: 'Este endereço de e-mail já está em uso.',
      default: 'Erro de chave duplicada.',
    },
  },
};

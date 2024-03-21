import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorObj: any =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(
      `Http Status: ${status} Error Message: ${JSON.stringify(errorObj)}`,
    );

    if (typeof errorObj.message === 'string') {
      const messageValue = errorObj.message;
      errorObj.message = [messageValue];
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorObj,
    });
  }
}

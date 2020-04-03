import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception['status'] || HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      status: status,
      message: exception.message,
      method: request.method,
      // todo: send stack if node-env is not production
      stack:
        process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

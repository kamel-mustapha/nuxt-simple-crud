import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class DuplicateEntryException implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    if (exception.errno && exception.errno === 1062) {
      httpAdapter.reply(
        ctx.getResponse(),
        { status: 409, message: 'Entrée existe déjà' },
        409,
      );
    } else {
      console.error(exception);

      const { httpAdapter } = this.httpAdapterHost;

      const ctx = host.switchToHttp();

      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const responseBody = {
        status: httpStatus,
        message: exception.response?.message
          ? exception.response?.message
          : 'unknown error',
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }
}

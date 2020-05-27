import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger } from '@nestjs/common';
import {Request, Response} from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

        const errorResponse ={
            code: 404,
            timpstamp : new Date().toLocaleDateString(),
            path : request.url,
            method : request.method,
            message : exception.message,
            
        };
        Logger.error(
            '${request.method} ${request.url',
            JSON.stringify(errorResponse),
            'ExceptionFilter',
        );
        return response
        .status(status)
        .json(errorResponse);
    }
}
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger, LogContext } from '../logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, ip, headers, body, query, params } = request;
    const userAgent = headers['user-agent'] || '';
    const requestId = uuidv4();
    const userId = request.user?.id || request.user?.userId || 'anonymous';
    
    // Set request ID untuk tracking
    request.requestId = requestId;
    response.setHeader('X-Request-ID', requestId);

    const now = Date.now();

    // Log incoming request (hanya untuk POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      this.logger.log(`${method} ${url}`, 'HTTP', {
        requestId,
        userId,
        method,
        url,
        ip,
        operation: 'REQUEST_START',
        bodySize: body ? JSON.stringify(body).length : 0,
      });
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          const responseSize = data ? JSON.stringify(data).length : 0;

          this.logger.httpLog(
            method,
            url,
            response.statusCode,
            responseTime,
            userAgent,
            ip,
            userId,
            requestId,
          );

          // Log response details untuk debugging (hanya untuk error atau slow response)
          if (response.statusCode >= 400 || responseTime > 1000) {
            this.logger.debug(`${method} ${url} - ${response.statusCode}`, 'HTTP', {
              requestId,
              userId,
              method,
              url,
              statusCode: response.statusCode,
              responseTime: `${responseTime}ms`,
              responseSize,
              operation: 'RESPONSE_SENT',
            });
          }
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          const errorCode = this.getErrorCode(error);
          const errorContext: LogContext = {
            requestId,
            userId,
            method,
            url,
            statusCode: error.status || 500,
            responseTime: `${responseTime}ms`,
            errorCode,
            operation: 'REQUEST_ERROR',
            ip,
            userAgent,
            query: Object.keys(query).length > 0 ? query : undefined,
            params: Object.keys(params).length > 0 ? params : undefined,
            bodySize: body ? JSON.stringify(body).length : 0,
          };

          this.logger.error(
            `HTTP ERROR: ${method} ${url} - ${error.message}`,
            error.stack,
            'HTTP',
            errorContext,
          );

          // Log additional error details untuk debugging
          this.logger.debug(`ERROR DETAILS: ${method} ${url}`, 'HTTP', {
            requestId,
            userId,
            errorName: error.name,
            errorMessage: error.message,
            errorCode,
            stackTrace: error.stack,
            operation: 'ERROR_DETAILS',
          });
        },
      }),
    );
  }

  private getErrorCode(error: any): string {
    if (error.status) {
      return `HTTP_${error.status}`;
    }
    if (error.code) {
      return error.code;
    }
    if (error.name) {
      return error.name.toUpperCase().replace(/\s+/g, '_');
    }
    return 'UNKNOWN_ERROR';
  }
}

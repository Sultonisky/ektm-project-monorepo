import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger, LogContext } from '../logger/logger.service';

@Injectable()
export class SuccessLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const requestId = request.requestId || 'unknown';
    const userId = request.user?.id || request.user?.userId || 'anonymous';

    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        const { method, url, ip, headers } = request;
        const userAgent = headers['user-agent'] || '';

        // Determine operation type based on method and URL
        const operationInfo = this.analyzeOperation(method, url);
        
        const successContext: LogContext = {
          requestId,
          userId,
          method,
          url,
          ip,
          userAgent,
          operation: operationInfo.type,
          module: operationInfo.module,
          statusCode: response.statusCode,
          duration: responseTime,
          responseSize: data ? JSON.stringify(data).length : 0,
        };

        // Log success based on operation type (hanya untuk operasi penting)
        if (operationInfo.type !== 'READ' || responseTime > 500) {
          switch (operationInfo.type) {
            case 'CREATE':
              this.logger.success(
                `✅ CREATED: ${operationInfo.module}`,
                operationInfo.module,
                successContext,
              );
              break;
            case 'UPDATE':
              this.logger.success(
                `✏️ UPDATED: ${operationInfo.module}`,
                operationInfo.module,
                successContext,
              );
              break;
            case 'DELETE':
              this.logger.success(
                `🗑️ DELETED: ${operationInfo.module}`,
                operationInfo.module,
                successContext,
              );
              break;
            case 'AUTH':
              this.logger.authLog(
                'SUCCESS',
                `${method} ${url}`,
                userId,
                operationInfo.module,
                successContext,
              );
              break;
            case 'PAYMENT':
              this.logger.businessLog(
                'PAYMENT_SUCCESS',
                `${method} ${url}`,
                operationInfo.module,
                successContext,
              );
              break;
            default:
              if (responseTime > 1000) {
                this.logger.log(
                  `✅ ${method} ${url}`,
                  operationInfo.module,
                  successContext,
                );
              }
          }
        }

        // Log performance metrics
        if (responseTime > 2000) {
          this.logger.warn(
            `🐌 SLOW RESPONSE: ${method} ${url} took ${responseTime}ms`,
            operationInfo.module,
            {
              ...successContext,
              operation: 'PERFORMANCE_WARNING',
            },
          );
        }
      }),
    );
  }

  private analyzeOperation(method: string, url: string): {
    type: string;
    module: string;
  } {
    const urlParts = url.split('/').filter(part => part);
    const module = urlParts[0] || 'UNKNOWN';
    
    let type = 'UNKNOWN';
    
    // Determine operation type based on HTTP method
    switch (method.toUpperCase()) {
      case 'POST':
        type = 'CREATE';
        break;
      case 'GET':
        type = 'READ';
        break;
      case 'PUT':
      case 'PATCH':
        type = 'UPDATE';
        break;
      case 'DELETE':
        type = 'DELETE';
        break;
    }

    // Special cases based on URL patterns
    if (url.includes('/auth/') || url.includes('/login') || url.includes('/register')) {
      type = 'AUTH';
    } else if (url.includes('/payment/') || url.includes('/midtrans')) {
      type = 'PAYMENT';
    } else if (url.includes('/upload') || url.includes('/file')) {
      type = 'FILE_UPLOAD';
    }

    return { type, module: module.toUpperCase() };
  }
}

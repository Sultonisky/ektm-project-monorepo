import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppLogger, LogContext } from '../logger/logger.service';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId || 'unknown';
    const userId = request.user?.id || request.user?.userId || 'anonymous';

    return next.handle().pipe(
      catchError((error) => {
        const { method, url, ip, headers, body, query, params } = request;
        const userAgent = headers['user-agent'] || '';

        // Determine error type and severity
        const errorInfo = this.analyzeError(error);
        
        const errorContext: LogContext = {
          requestId,
          userId,
          method,
          url,
          ip,
          userAgent,
          operation: 'ERROR_HANDLING',
          errorCode: errorInfo.code,
          statusCode: errorInfo.statusCode,
          errorType: errorInfo.type,
          severity: errorInfo.severity,
          query: Object.keys(query).length > 0 ? query : undefined,
          params: Object.keys(params).length > 0 ? params : undefined,
          bodySize: body ? JSON.stringify(body).length : 0,
        };

        // Log based on severity
        switch (errorInfo.severity) {
          case 'critical':
            this.logger.error(
              `🚨 CRITICAL ERROR: ${method} ${url} - ${error.message}`,
              error.stack,
              'ERROR_HANDLER',
              errorContext,
            );
            break;
          case 'high':
            this.logger.error(
              `❌ HIGH SEVERITY ERROR: ${method} ${url} - ${error.message}`,
              error.stack,
              'ERROR_HANDLER',
              errorContext,
            );
            break;
          case 'medium':
            this.logger.warn(
              `⚠️ MEDIUM SEVERITY ERROR: ${method} ${url} - ${error.message}`,
              'ERROR_HANDLER',
              errorContext,
            );
            break;
          case 'low':
            this.logger.log(
              `ℹ️ LOW SEVERITY ERROR: ${method} ${url} - ${error.message}`,
              'ERROR_HANDLER',
              errorContext,
            );
            break;
        }

        // Log additional debugging information
        this.logger.debug(`🔍 ERROR ANALYSIS: ${method} ${url}`, 'ERROR_HANDLER', {
          requestId,
          userId,
          errorName: error.name,
          errorMessage: error.message,
          errorCode: errorInfo.code,
          errorType: errorInfo.type,
          severity: errorInfo.severity,
          stackTrace: error.stack,
          operation: 'ERROR_ANALYSIS',
        });

        return throwError(() => error);
      }),
    );
  }

  private analyzeError(error: any): {
    code: string;
    statusCode: number;
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  } {
    let code = 'UNKNOWN_ERROR';
    let statusCode = 500;
    let type = 'UNKNOWN';
    let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';

    if (error instanceof HttpException) {
      statusCode = error.getStatus();
      code = `HTTP_${statusCode}`;
      type = 'HTTP_EXCEPTION';
      
      if (statusCode >= 500) {
        severity = 'high';
      } else if (statusCode >= 400) {
        severity = 'medium';
      } else {
        severity = 'low';
      }
    } else if (error.code) {
      code = error.code;
      type = 'SYSTEM_ERROR';
      
      // Database errors
      if (error.code.startsWith('P')) {
        type = 'DATABASE_ERROR';
        severity = 'high';
      }
      // Network errors
      else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        type = 'NETWORK_ERROR';
        severity = 'high';
      }
      // Validation errors
      else if (error.code === 'VALIDATION_ERROR') {
        type = 'VALIDATION_ERROR';
        severity = 'low';
      }
    } else if (error.name) {
      code = error.name.toUpperCase().replace(/\s+/g, '_');
      type = error.name;
      
      // Critical errors
      if (error.name.includes('TypeError') || error.name.includes('ReferenceError')) {
        severity = 'critical';
      }
      // High severity errors
      else if (error.name.includes('Error')) {
        severity = 'high';
      }
    }

    return { code, statusCode, type, severity };
  }
}

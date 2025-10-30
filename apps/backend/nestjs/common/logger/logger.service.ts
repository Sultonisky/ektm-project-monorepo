import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export interface LogContext {
  userId?: string;
  requestId?: string;
  operation?: string;
  module?: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
  statusCode?: number;
  errorCode?: string;
  stackTrace?: string;
  [key: string]: any;
}

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.initializeLogger();
  }

  private initializeLogger() {
    // Format untuk console (lebih rapi dan mudah dibaca)
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.printf(
        ({ timestamp, level, message, context, stack, ...meta }) => {
          // Color coding untuk level
          const levelColors = {
            error: '\x1b[31m', // Red
            warn: '\x1b[33m',  // Yellow
            info: '\x1b[36m',  // Cyan
            debug: '\x1b[35m', // Magenta
            verbose: '\x1b[90m', // Gray
          };
          const resetColor = '\x1b[0m';
          const color = levelColors[level] || '';
          
          let log = `${color}${timestamp} [${level.toUpperCase()}]${resetColor}`;
          
          // Context dengan warna hijau
          if (context) {
            log += ` \x1b[32m[${context}]\x1b[0m`;
          }
          
          // Message dengan emoji
          log += `: ${message}`;
          
          // Format metadata untuk readability yang lebih baik
          if (Object.keys(meta).length > 0) {
            const formattedMeta = this.formatMetadata(meta);
            if (formattedMeta) {
              log += ` \x1b[90m| ${formattedMeta}\x1b[0m`;
            }
          }
          
          if (stack) {
            log += `\n\x1b[31m${stack}\x1b[0m`;
          }
          
          return log;
        },
      ),
    );

    // Format untuk file (JSON format)
    const fileFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      defaultMeta: { service: 'mahasiswa-api' },
      transports: [
        // Console transport dengan format yang rapi
        new winston.transports.Console({
          format: consoleFormat,
        }),

        // Daily rotate file for all logs dengan JSON format
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: fileFormat,
        }),

        // Daily rotate file for error logs dengan JSON format
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
          format: fileFormat,
        }),
      ],
    });
  }

  // Helper method untuk format metadata
  private formatMetadata(meta: any): string {
    const importantFields = ['userId', 'requestId', 'operation', 'module', 'method', 'url', 'ip', 'statusCode', 'duration', 'errorCode'];
    const formatted: string[] = [];
    
    // Format important fields first dengan batas maksimal
    importantFields.forEach(field => {
      if (meta[field] !== undefined) {
        let value = meta[field];
        // Truncate long values
        if (typeof value === 'string' && value.length > 50) {
          value = value.substring(0, 47) + '...';
        }
        formatted.push(`${field}=${value}`);
      }
    });
    
    // Add other fields (maksimal 3 field tambahan untuk console)
    const otherFields = Object.keys(meta).filter(key => !importantFields.includes(key));
    otherFields.slice(0, 3).forEach(key => {
      if (meta[key] !== undefined) {
        let value = meta[key];
        if (typeof value === 'object') {
          value = JSON.stringify(value).substring(0, 30) + '...';
        } else if (typeof value === 'string' && value.length > 30) {
          value = value.substring(0, 27) + '...';
        }
        formatted.push(`${key}=${value}`);
      }
    });
    
    return formatted.join(', ');
  }

  // Enhanced logging methods dengan context yang lebih detail
  log(message: string, context?: string, meta?: LogContext) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: LogContext) {
    this.logger.error(message, { 
      context, 
      stack: trace, 
      errorCode: meta?.errorCode || 'UNKNOWN_ERROR',
      ...meta 
    });
  }

  warn(message: string, context?: string, meta?: LogContext) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: LogContext) {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: LogContext) {
    this.logger.verbose(message, { context, ...meta });
  }

  // Method khusus untuk success operations
  success(message: string, context?: string, meta?: LogContext) {
    this.logger.info(`SUCCESS: ${message}`, { 
      context, 
      operation: 'SUCCESS',
      ...meta 
    });
  }

  // Method khusus untuk business logic operations
  businessLog(operation: string, message: string, context?: string, meta?: LogContext) {
    this.logger.info(`BUSINESS: ${operation} - ${message}`, { 
      context, 
      operation,
      ...meta 
    });
  }

  // Method khusus untuk security events
  securityLog(event: string, message: string, context?: string, meta?: LogContext) {
    this.logger.warn(`SECURITY: ${event} - ${message}`, { 
      context, 
      operation: 'SECURITY',
      securityEvent: event,
      ...meta 
    });
  }

  // Method khusus untuk logging request dengan detail yang lebih lengkap
  httpLog(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userAgent?: string,
    ip?: string,
    userId?: string,
    requestId?: string,
  ) {
    const logLevel = statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'info';
    
    this.logger[logLevel](`HTTP ${method} ${url}`, {
      context: 'HTTP',
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      userAgent,
      ip,
      userId,
      requestId,
      operation: 'HTTP_REQUEST',
    });
  }

  // Method khusus untuk logging database operations dengan detail yang lebih lengkap
  dbLog(operation: string, model: string, duration: number, data?: any, userId?: string, requestId?: string) {
    const logLevel = duration > 1000 ? 'warn' : 'debug';
    
    this.logger[logLevel](`DB ${operation} on ${model}`, {
      context: 'DATABASE',
      model,
      duration: `${duration}ms`,
      data,
      userId,
      requestId,
      operation: 'DATABASE_OPERATION',
    });
  }

  // Method untuk logging validation errors
  validationError(message: string, errors: any[], context?: string, meta?: LogContext) {
    this.logger.warn(`VALIDATION ERROR: ${message}`, {
      context,
      operation: 'VALIDATION',
      errorCode: 'VALIDATION_ERROR',
      validationErrors: errors,
      ...meta,
    });
  }

  // Method untuk logging authentication events
  authLog(event: string, message: string, userId?: string, context?: string, meta?: LogContext) {
    const logLevel = event.includes('FAILED') || event.includes('ERROR') ? 'warn' : 'info';
    
    this.logger[logLevel](`AUTH ${event}: ${message}`, {
      context,
      operation: 'AUTHENTICATION',
      authEvent: event,
      userId,
      ...meta,
    });
  }

  // Method untuk logging external API calls
  externalApiLog(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    service: string,
    context?: string,
    meta?: LogContext,
  ) {
    const logLevel = statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'info';
    
    this.logger[logLevel](`EXTERNAL API ${method} ${url}`, {
      context,
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      service,
      operation: 'EXTERNAL_API',
      ...meta,
    });
  }
}

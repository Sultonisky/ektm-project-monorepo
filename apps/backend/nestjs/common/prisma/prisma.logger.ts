import { AppLogger, LogContext } from '../logger/logger.service';

export class PrismaLogger {
  constructor(private readonly logger: AppLogger) {}

  query(event: any) {
    const startTime = Date.now();

    return (result: any) => {
      const duration = Date.now() - startTime;
      const operation = event.action || 'query';
      const model = event.model || 'unknown';

      // Determine log level based on duration and operation type
      const logLevel = duration > 1000 ? 'warn' : 'debug';

      const logContext: LogContext = {
        operation: 'DATABASE_OPERATION',
        module: 'PRISMA',
        duration,
        query: event.params,
        result: this.sanitizeResult(result),
      };

      this.logger[logLevel](`DB ${operation} on ${model}`, 'DATABASE', logContext);

      // Log slow queries as warnings
      if (duration > 1000) {
        this.logger.warn(`SLOW QUERY DETECTED: ${operation} on ${model} took ${duration}ms`, 'DATABASE', {
          operation: 'SLOW_QUERY',
          module: 'PRISMA',
          duration,
          model,
          query: event.params,
        });
      }
    };
  }

  info(event: any) {
    this.logger.log(`PRISMA INFO: ${event.message}`, 'PRISMA', {
      operation: 'PRISMA_INFO',
      module: 'PRISMA',
      prismaEvent: event,
    });
  }

  warn(event: any) {
    this.logger.warn(`PRISMA WARNING: ${event.message}`, 'PRISMA', {
      operation: 'PRISMA_WARNING',
      module: 'PRISMA',
      prismaEvent: event,
    });
  }

  error(event: any) {
    this.logger.error(
      `PRISMA ERROR: ${event.message}`,
      event.target,
      'PRISMA',
      {
        operation: 'PRISMA_ERROR',
        module: 'PRISMA',
        errorCode: 'PRISMA_ERROR',
        prismaEvent: event,
        timestamp: event.timestamp,
      },
    );
  }

  private sanitizeResult(result: any): any {
    if (Array.isArray(result)) {
      return `Array(${result.length} items)`;
    }

    if (typeof result === 'object' && result !== null) {
      if (result.id) {
        return `Object with id: ${result.id}`;
      }
      const keys = Object.keys(result);
      return `Object(${keys.length} fields)`;
    }

    return typeof result;
  }
}

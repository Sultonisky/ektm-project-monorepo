import { Global, Module } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';
import { PrismaService } from './prisma/prisma.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ErrorLoggingInterceptor } from './interceptors/error-logging.interceptor';
import { SuccessLoggingInterceptor } from './interceptors/success-logging.interceptor';

@Global() // ✅ Module ini akan available secara global
@Module({
  providers: [
    AppLogger, 
    PrismaService,
    LoggingInterceptor,
    ErrorLoggingInterceptor,
    SuccessLoggingInterceptor,
  ],
  exports: [
    AppLogger, 
    PrismaService,
    LoggingInterceptor,
    ErrorLoggingInterceptor,
    SuccessLoggingInterceptor,
  ], // ✅ Export semua service dan interceptor
})
export class CommonModule {}

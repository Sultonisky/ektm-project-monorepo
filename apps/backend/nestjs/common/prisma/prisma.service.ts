import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppLogger } from '../logger/logger.service';
import { PrismaLogger } from './prisma.logger';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private prismaLogger: PrismaLogger;

  constructor(private readonly logger: AppLogger) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    this.prismaLogger = new PrismaLogger(logger);
    this.setupLogging();
  }

  private setupLogging() {
    // Type-safe event handlers
    (this as any).$on('query', (e: any) => {
      this.prismaLogger.query(e);
    });

    (this as any).$on('error', (e: any) => {
      this.prismaLogger.error(e);
    });

    (this as any).$on('info', (e: any) => {
      this.prismaLogger.info(e);
    });

    (this as any).$on('warn', (e: any) => {
      this.prismaLogger.warn(e);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to database', 'PRISMA');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from database', 'PRISMA');
  }
}

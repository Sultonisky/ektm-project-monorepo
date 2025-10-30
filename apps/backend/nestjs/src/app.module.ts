import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { CampusModule } from './campus/campus.module';
import { FakultasModule } from './fakultas/fakultas.module';
import { JurusanModule } from './jurusan/jurusan.module';
import { CommonModule } from '../common/common.module'; // ✅ IMPORT CommonModule
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { ErrorLoggingInterceptor } from '../common/interceptors/error-logging.interceptor';
import { SuccessLoggingInterceptor } from '../common/interceptors/success-logging.interceptor';
import { PaymentModule } from './payment/payment.module';
import { BiayaModule } from './biaya/biaya.module';
import { NotifikasiModule } from './notifikasi/notifikasi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule, // ✅ IMPORT CommonModule (global)
    UsersModule,
    AuthModule,
    CampusModule,
    FakultasModule,
    JurusanModule,
    MahasiswaModule,
    PaymentModule,
    BiayaModule,
    NotifikasiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessLoggingInterceptor,
    },
  ],
})
export class AppModule {}

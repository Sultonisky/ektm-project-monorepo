import { Module } from '@nestjs/common';
import { MahasiswaService } from './core/mahasiswa.service';
import { MahasiswaController } from './http/mahasiswa.controller';
// Notification module not required for mahasiswa now

@Module({
  imports: [],
  providers: [MahasiswaService],
  controllers: [MahasiswaController],
})
export class MahasiswaModule {}

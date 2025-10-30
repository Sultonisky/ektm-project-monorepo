import { Module } from '@nestjs/common';
import { NotifikasiService } from './core/notifikasi.service';
import { NotifikasiController } from './http/notifikasi.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [NotifikasiController],
  providers: [NotifikasiService],
  exports: [NotifikasiService],
})
export class NotifikasiModule {}
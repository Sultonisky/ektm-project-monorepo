import { Module } from '@nestjs/common';
import { BiayaService } from './core/biaya.service';
import { BiayaController } from './http/biaya.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [BiayaService],
  controllers: [BiayaController],
  exports: [BiayaService],
})
export class BiayaModule {}

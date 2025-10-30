import { Module } from '@nestjs/common';
import { FakultasService } from './core/fakultas.service';
import { FakultasController } from './http/fakultas.controller';

@Module({
  imports: [],
  providers: [FakultasService],
  controllers: [FakultasController],
  exports: [FakultasService],
})
export class FakultasModule {}

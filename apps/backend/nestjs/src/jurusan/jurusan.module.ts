import { Module } from '@nestjs/common';
import { JurusanService } from './core/jurusan.service';
import { JurusanController } from './http/jurusan.controller';

@Module({
  imports: [],
  providers: [JurusanService],
  controllers: [JurusanController],
  exports: [JurusanService],
})
export class JurusanModule {}

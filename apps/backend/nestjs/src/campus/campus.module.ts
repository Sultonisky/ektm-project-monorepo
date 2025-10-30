import { Module } from '@nestjs/common';
import { CampusService } from './core/campus.service';
import { CampusController } from './http/campus.controller';

@Module({
  imports: [],
  providers: [CampusService],
  controllers: [CampusController],
  exports: [CampusService],
})
export class CampusModule {}

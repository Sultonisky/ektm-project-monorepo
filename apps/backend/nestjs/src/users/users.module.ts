import { Module } from '@nestjs/common';
import { UsersService } from './core/users.service';
import { UsersController } from './http/users.controller';
// import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

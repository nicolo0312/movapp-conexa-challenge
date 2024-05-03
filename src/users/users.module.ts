import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ErrorHandler } from '../utils/error-handler';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ErrorHandler],
  imports: [
    TypeOrmModule.forFeature([User])
  ]
})
export class UsersModule {}


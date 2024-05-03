import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ErrorHandler } from 'src/utils/error-handler';

@Module({
  controllers: [SeedController],
  providers: [
    SeedService,
    ErrorHandler
  ],
  imports:[
    UsersModule,
    TypeOrmModule.forFeature([User])
  ]
})
export class SeedModule {}

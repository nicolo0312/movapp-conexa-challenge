import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { ErrorHandler } from '../utils/error-handler';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, ErrorHandler],
  imports:[AuthModule, HttpModule, TypeOrmModule.forFeature([Movie])],
  exports:[HttpModule]
})
export class MoviesModule {}

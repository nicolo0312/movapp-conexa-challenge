import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports:[AuthModule, HttpModule, TypeOrmModule.forFeature([Movie])],
  exports:[HttpModule]
})
export class MoviesModule {}

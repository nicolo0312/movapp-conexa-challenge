import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Auth } from 'src/auth/decorators/auth.decorated';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { PaginationAndSearchDto } from 'src/common/dtos/pagination-and-search.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Auth(ValidRoles.administrator)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Post('starWars')
  @Auth(ValidRoles.administrator)
  insertStarWarsMovies() {
    return this.moviesService.insertStarWarsMovies()
  }

  @Get()
  @Auth()
  findAll(@Query() paginationAndSearchDto: PaginationAndSearchDto) {
    return this.moviesService.findAll(paginationAndSearchDto);
  }

  @Get('starWars')
  @Auth(ValidRoles.regular)
  getStarWarsMovies(@Query() paginationAndSearchDto: PaginationAndSearchDto) {
    return this.moviesService.starWarsMovies(paginationAndSearchDto);
  }

  @Get(':id')
  @Auth(ValidRoles.regular)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.administrator)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.administrator)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.remove(id);
  }
}

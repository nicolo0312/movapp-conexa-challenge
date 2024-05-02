import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Auth } from 'src/auth/decorators/auth.decorated';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { PaginationAndSearchDto } from 'src/common/dtos/pagination-and-search.dto';
import { CreateMovieFromApiDto } from './dto/create-movie-from-api.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  
  @Post('starWars')
  @Auth(ValidRoles.administrator)
  insertStarWarsMovies() {
    return this.moviesService.insertStarWarsMovies()
  }
  
  @Post('addMovieFromApi')
  @Auth(ValidRoles.regular)
  addMovieFromApi(@Body() createMovieFromApi: CreateMovieFromApiDto) {
    return this.moviesService.addMovieFromApi(createMovieFromApi)
  }
  @Post()
  @Auth(ValidRoles.administrator)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
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
  
  @Get('apiMoviesByTitle')
  @Auth(ValidRoles.regular)
  getApiMoviesByTitle(@Query() paginationAndSearchDto: PaginationAndSearchDto){
    return this.moviesService.getApiMoviesByTitle(paginationAndSearchDto)
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

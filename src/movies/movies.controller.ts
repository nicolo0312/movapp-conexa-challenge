import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Auth } from '../auth/decorators/auth.decorated';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { PaginationAndSearchDto } from '../common/dtos/pagination-and-search.dto';
import { CreateMovieFromApiDto } from './dto/create-movie-from-api.dto';
import { Movie } from './entities/movie.entity';
import { SwapiResponse } from './responseExamples/swapi-response';
import { MovieDBResponse } from './responseExamples/movieDb-response';


@ApiBearerAuth()
@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  
  
  
  @Post()
  @Auth(ValidRoles.administrator)
  @ApiResponse({status:201, description:'Movie was created', type: Movie})
  @ApiResponse({status:400, description:'Bad request'})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }
  @Post('starWars')
  @Auth(ValidRoles.administrator)
  @ApiResponse({status:201, description:'Movie was created', type: Movie})
  @ApiResponse({status:400, description:'Bad request'})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  insertStarWarsMovies() {
    return this.moviesService.insertStarWarsMovies()
  }
  
  @Post('addMovieFromApi')
  @Auth(ValidRoles.administrator)
  @ApiResponse({status:201, description:'Movie was created', type: Movie})
  @ApiResponse({status:400, description:'Bad request'})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  addMovieFromApi(@Body() createMovieFromApi: CreateMovieFromApiDto) {
    return this.moviesService.addMovieFromApi(createMovieFromApi)
  }
  
  @Get()
  @Auth()
  @ApiResponse({status:200, description:'List of movies create in our database', type: Movie, isArray:true})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  findAll(@Query() paginationAndSearchDto: PaginationAndSearchDto) {
    return this.moviesService.findAll(paginationAndSearchDto);
  }
  
  @Get('starWars')
  @Auth(ValidRoles.administrator)
  @ApiResponse({
    status:200,
    description:'List of movies from Swapi',
    isArray:true,
    schema:{
      type:'array',
      example:SwapiResponse
    }})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:403, description:'Forbidden. Invalid token'})
    getStarWarsMovies() {
      return this.moviesService.starWarsMovies();
    }
  
  @Get('apiMoviesByTitle')
  @Auth(ValidRoles.administrator)
  @ApiResponse({
    status:200,
    description:'List of movies from MovieDB API, we must search by title of the movie that we wanted',
    isArray:true,
    schema:{
      type:'array',
      example:MovieDBResponse
    }
  })
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  getApiMoviesByTitle(@Query() paginationAndSearchDto: PaginationAndSearchDto){
    return this.moviesService.getApiMoviesByTitle(paginationAndSearchDto)
  }
  
  @Get(':id')
  @Auth(ValidRoles.regular)
  @ApiResponse({status:200, description:'Movie created on our database, we must provide id movie ', type:Movie})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  @ApiResponse({status:404, description:'Resource not found'})
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }
  
  
  @Patch(':id')
  @Auth(ValidRoles.administrator)
  @ApiResponse({status:200, description:'Movie was updated, we must provide id movie ', type:Movie})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  @ApiResponse({status:404, description:'Resource not found'})
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }
  
  @Delete(':id')
  @Auth(ValidRoles.administrator)
  @ApiResponse({status:200, description:'Movie was eliminated, we must provide id movie '})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  @ApiResponse({status:404, description:'Resource not found'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.remove(id);
  }
}

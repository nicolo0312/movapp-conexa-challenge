import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Movie } from './entities/movie.entity';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationAndSearchDto } from 'src/common/dtos/pagination-and-search.dto';
import { CreateMovieFromApiDto } from './dto/create-movie-from-api.dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger('MoviesService');
  private readonly movieDBApiBaseUrl = process.env.MOVIE_DB_API_BASE_URL;
  private readonly movieDBApiKey = process.env.MOVIE_DB_API_KEY;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>
  ) {}


  async create(createMovieDto: CreateMovieDto) {
    try {
      const movie = this.movieRepository.create(createMovieDto)
      const movieCreated = await this.movieRepository.save(movie)
      return {
        data:movieCreated,
        message:'Movie was created'
      };
      
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(paginationAndSearchDto: PaginationAndSearchDto) {
    try {    
      const {limit = 10, offset = 0, search} = paginationAndSearchDto

      const whereParamMovie = {
        where:{
          isActive:true,
        take:limit,
        skip:offset
      }
    }
      if(search)
        whereParamMovie.where['flatten'] = ILike(`%${search}%`)

      const response:Movie[]= await this.movieRepository.find(whereParamMovie)
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
    try {
      const movie = await this.movieRepository.findOne({where:{id, isActive:true}});

      if(!movie)
        throw new NotFoundException(`Movie with id ${id} not found`)

      return movie;
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    try {
      const movieToUpdate = await this.movieRepository.preload({
        id:id,
        ...updateMovieDto
      });
      if (!movieToUpdate) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }
  
      const movieUpdated = await this.movieRepository.save(movieToUpdate)
  
      return {
        data:movieUpdated,
        message:'Movie was updated'
      };
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      const bodyUpdate = {
        isActive: false,
        deletedAt: new Date()
      }
      const movieToDelete = await this.movieRepository.preload({
        id,
        ...bodyUpdate
      });
      if (!movieToDelete) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }


      const movieDeleted = await this.movieRepository.save(movieToDelete)
      return {
        data:movieDeleted,
        message:`This movie was deleted`
      };
    } catch (error) {
      this.logger.error(error)
    }
  }
  
  async insertStarWarsMovies() {
    try {
      const {data} = await firstValueFrom(
        this.httpService.get('https://swapi.dev/api/films/')
      )
      const insertPromises = []
      data.results.forEach(async ({title, opening_crawl}) => {
        let completeTitle = `Star Wars - ${title}`
        insertPromises.push(this.movieRepository.insert({title:completeTitle, description:opening_crawl}))
      });
      const results = await Promise.all(insertPromises)
      return results;
    
  } catch (error) {
    throw new InternalServerErrorException(error)
  }
  }

  async starWarsMovies(paginationAndSearchDto: PaginationAndSearchDto) {
    try {
      const {data} = await firstValueFrom(
        this.httpService.get('https://swapi.dev/api/films/')
      )
      return data.results;
    
  } catch (error) {
    throw new InternalServerErrorException(error)
  }
  }

  async getApiMoviesByTitle(paginationAndSearchDto: PaginationAndSearchDto){
    try {
      const {search} = paginationAndSearchDto;
      const {data} = await firstValueFrom(
        this.httpService.get(`${this.movieDBApiBaseUrl}/search/movie?query=${search}&api_key=${this.movieDBApiKey}`)
      )
      if(!data)
        throw new BadRequestException('Movie DB API has Server Error')

      return data.results
    } catch (error) {
      throw new InternalServerErrorException(error)
    }

  }

  async addMovieFromApi(createMovieFromApi: CreateMovieFromApiDto){
    try {
      const {idMovie} = createMovieFromApi
      const {data} = await firstValueFrom(
        this.httpService.get(`${this.movieDBApiBaseUrl}/movie/${idMovie}?api_key=${this.movieDBApiKey}&language=es-ES`)
      )
      let genresMovie: string = ''
      data.genres.forEach(async ({name}) => {
        genresMovie += ` ${name},`;
      });

      const createMovie:CreateMovieDto={
        title:data.title,
        description:data.overview,
        releaseDate:data.release_date,
        runtime:data.runtime,
        genre:genresMovie,
      }

      const movieCreated = await this.create(createMovie)

      return movieCreated
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

}

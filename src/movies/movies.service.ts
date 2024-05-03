import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Movie } from './entities/movie.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationAndSearchDto } from 'src/common/dtos/pagination-and-search.dto';
import { CreateMovieFromApiDto } from './dto/create-movie-from-api.dto';
import { ErrorHandler } from '../utils/error-handler';
import { AxiosError } from 'axios';

@Injectable()
export class MoviesService {
  private readonly movieDBApiBaseUrl = process.env.MOVIE_DB_API_BASE_URL;
  private readonly movieDBApiKey = process.env.MOVIE_DB_API_KEY;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly errorHandler: ErrorHandler
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
      this.errorHandler.handleDBErrors(error)
    }
  }

  async findAll(paginationAndSearchDto: PaginationAndSearchDto) {
    try {    
      const {limit = 10, offset = 0, search} = paginationAndSearchDto

      const whereParamMovie = {
        where:{
          isActive:true,
        },
        take:limit,
        skip:offset
    }
      if(search)
        whereParamMovie.where['flatten'] = ILike(`%${search}%`)

      const response:Movie[]= await this.movieRepository.find(whereParamMovie)
      return {
        data:response,
        message:''
      };
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string) {
      const movie = await this.movieRepository.findOne({ where: { id, isActive: true } });
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }
      return {
        data:movie,
        message:''
      };
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    try {
      
      const movieExists:Movie= await this.movieRepository.findOne({where:{id, isActive:true}});
      if(!movieExists){
        throw new NotFoundException(`Movie with id ${id} not found`);
      }
        
        const movieToUpdate = await this.movieRepository.preload({
          id:id,
          ...updateMovieDto
        });
        

      const movieUpdated = await this.movieRepository.save(movieToUpdate)
  
      return {
        data:movieUpdated,
        message:'Movie was updated'
      };
    } catch (error) {
      if(error.status===404) throw new NotFoundException(error.response.message)

      this.errorHandler.handleDBErrors(error)
    }
  }

  async remove(id: string) {
    try {
      const bodyUpdate = {
        isActive: false,
        deletedAt: new Date()
      }
      const movieExists = await this.movieRepository.findOne({where:{id, isActive:true}})
      if(!movieExists)
        throw new NotFoundException(`Movie with id ${id} not found`);
    
      const movieToDelete = await this.movieRepository.preload({
        id,
        ...bodyUpdate
      });
    
      const movieDeleted = await this.movieRepository.save(movieToDelete)
      return {
        data:movieDeleted,
        message:`This movie was deleted`
      };
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
  
  async insertStarWarsMovies() {
    try {
      const {data} = await firstValueFrom(
        this.httpService.get(process.env.STAR_WARS_API_URL)
      )
      const insertPromises = []
      data.results.forEach(async ({title, opening_crawl}) => {
        let completeTitle = `Star Wars - ${title}`
        let genreCreate = 'Ciencia ficción'
        let flattenCreate = completeTitle + ' ' + genreCreate
        insertPromises.push(this.movieRepository.insert({title:completeTitle, description:opening_crawl, genre:genreCreate, flatten: flattenCreate}))
      });
      const results = await Promise.all(insertPromises)
      return {
        data:results,
        message:''};
    
  } catch (error) {
    this.errorHandler.handleDBErrors(error)
  }
  }

  async starWarsMovies() {
    try {
      const {data} = await firstValueFrom(
        this.httpService.get(process.env.STAR_WARS_API_URL)
      )
      return {
        data:data.results,
        message:''
      };
    
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
        this.httpService.get(`${this.movieDBApiBaseUrl}/movie/${idMovie}?api_key=${this.movieDBApiKey}&language=es-ES`).pipe(
          catchError((error: AxiosError) => {
            throw (error.response.data);
          }),
        ),
      );
      let genresMovie: string = ''
      data.genres.forEach(async ({name}) => {
        genresMovie += ` ${name},`;
      });

      const createMovie:CreateMovieDto = {
        title:data.title,
        description:data.overview,
        releaseDate:data.release_date,
        runtime:data.runtime,
        genre:genresMovie,
      }

      let movieCreated = await this.movieRepository.create(createMovie)
      movieCreated = await this.movieRepository.save(movieCreated)

      return {
        data:movieCreated,
        message:'Movie was created'
      };
    } catch (error) {
      if(!error.success)
        return {
          message:'External API failed',
          error:'Bad request error',
          statusCode:400
        }
      throw this.errorHandler.handleDBErrors(error)
    }
  }

}

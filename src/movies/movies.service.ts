import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Movie } from './entities/movie.entity';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationAndSearchDto } from 'src/common/dtos/pagination-and-search.dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger('MoviesService')
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>
  ) {}
  async create(createMovieDto: CreateMovieDto) {

    const movie = this.movieRepository.create(createMovieDto)
    await this.movieRepository.save(movie)
    return 'Movie was created';
  }

  async findAll(paginationAndSearchDto: PaginationAndSearchDto) {
    try {    
      const {limit = 10, offset = 0, search} = paginationAndSearchDto
      let response:Movie[];
      if(search){
        response = await this.movieRepository.find({
          where:{
            isActive:true,
            flatten:ILike(`%${search}%`)},
          take:limit,
          skip:offset
        })
      }else{
        response = await this.movieRepository.find({
          where:{isActive:true},
          take:limit,
          skip:offset
        })

      }
      return response;
    } catch (error) {
      throw new BadRequestException('Movie not found')
    }
  }

  async findOne(id: string) {
    try {
      const movie = await this.movieRepository.findOne({where:{id, isActive:true}});

      if(!movie)
        throw new NotFoundException(`Movie with id ${id} not found`)

      return movie;
    } catch (error) {
      throw new BadRequestException('Movie not found')
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
  
      return {data:movieUpdated};
    } catch (error) {
      
    }
  }

  async remove(id: string) {
    try {
      
      const movieToDelete = await this.movieRepository.findOne({where:{id}});
      if (!movieToDelete) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }
      movieToDelete.deletedAt = new Date()
      movieToDelete.isActive  = false 
      return `This movie was deleted`;
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

}

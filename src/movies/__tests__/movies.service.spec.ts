import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { PaginationAndSearchDto } from 'src/common/dtos/pagination-and-search.dto';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { CreateMovieFromApiDto } from 'src/movies/dto/create-movie-from-api.dto';
import { AxiosResponse } from 'axios';
import { ErrorHandler } from '../../utils/error-handler';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        ErrorHandler,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = { title: 'Test Movie', description: 'Test Description', runtime:123, genre:'Acción', releaseDate:new Date()};
      const movie = new Movie();
      jest.spyOn(movieRepository, 'create').mockReturnValue(movie);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(movie);

      const result = await service.create(createMovieDto);

      expect(result).toEqual({ data: movie, message: 'Movie was created' });
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const createMovieDto: CreateMovieDto = { title: 'Test Movie', description: 'Test Description', runtime:123, genre:'Acción', releaseDate:new Date()};
      jest.spyOn(movieRepository, 'create').mockImplementation(() => { throw new Error(); });

      await expect(service.create(createMovieDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should find all movies', async () => {
      const paginationAndSearchDto: PaginationAndSearchDto = { limit: 10, offset: 0, search: 'Test' };
      const movie = new Movie();
      jest.spyOn(movieRepository, 'find').mockResolvedValue([movie]);

      const result = await service.findAll(paginationAndSearchDto);

      expect(result).toEqual({"data": [{}], "message": ""});
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const paginationAndSearchDto: PaginationAndSearchDto = { limit: 10, offset: 0, search: 'Test' };
      jest.spyOn(movieRepository, 'find').mockImplementation(() => { throw new Error(); });

      await expect(service.findAll(paginationAndSearchDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should find one movie by id', async () => {
      const movieId = '03c71a92-4b5f-4d4a-b2c7-dcb314dfbeab';
      const movie = new Movie();
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(movie);

      const result = await service.findOne(movieId);

      expect(result).toEqual({data:movie, message:''});
    });

    it('should throw a NotFoundException if movie not found', async () => {

      const movieId = '03c71a92-4b5f-4d4a-b2c7-dcb314dfbeab';
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(null);
      
      await expect(service.findOne(movieId)).rejects.toThrow(NotFoundException);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const movieId = '1';
      jest.spyOn(movieRepository, 'findOne').mockImplementation(() => { throw new InternalServerErrorException; });

      await expect(service.findOne(movieId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const movieId = '03c71a92-4b5f-4d4a-b2c7-dcb314dfbeab';
      const updateMovieDto: UpdateMovieDto = { title: 'Test Movie', description: 'Test Description', runtime:123, genre:'Acción', releaseDate:new Date()};
      const findOneMovie = new Movie();
      const movieToUpdate = new Movie();
      const updatedMovie = new Movie();
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(movieToUpdate);
      jest.spyOn(movieRepository, 'preload').mockResolvedValue(movieToUpdate);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(updatedMovie);

      const result = await service.update(movieId, updateMovieDto);

      expect(result).toEqual({ data: updatedMovie, message: 'Movie was updated' });
    });

    it('should throw a NotFoundException if movie not found', async () => {
      const movieId = '03c71a92-4b5f-4d4a-b2c7-dcb314dfbeab';
      const updateMovieDto: UpdateMovieDto = { title: 'Test Movie', description: 'Test Description', runtime:123, genre:'Acción', releaseDate:new Date()};
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(movieRepository, 'preload').mockResolvedValue(undefined);

      await expect(service.update(movieId, updateMovieDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const movieId = '03c71a92-4b5f-4d4a-b2c7-dcb314dfbeab';
      const updateMovieDto: UpdateMovieDto = { title: 'Test Movie', description: 'Test Description', runtime:123, genre:'Acción', releaseDate:new Date()};
      jest.spyOn(movieRepository, 'findOne').mockImplementation(() => { throw new InternalServerErrorException; });
      jest.spyOn(movieRepository, 'preload').mockImplementation(() => { throw new InternalServerErrorException; });

      await expect(service.update(movieId, updateMovieDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should soft delete a movie', async () => {
      const movieId = '03c71a92-4b5f-4d4a-b2c7-dcb314dfbeab';
      const findMovie = new Movie();
      const movieToDelete = new Movie();
      const deletedMovie = new Movie();
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(findMovie);
      jest.spyOn(movieRepository, 'preload').mockResolvedValue(movieToDelete);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(deletedMovie);

      const result = await service.remove(movieId);

      expect(result).toEqual({ data: deletedMovie, message: 'This movie was deleted' });
    });

  });

  describe('insertStarWarsMovies', () => {
    it('should throw an InternalServerErrorException if an error occurs', async () => {
      await expect(service.insertStarWarsMovies()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('starWarsMovies', () => {
    it('should get Star Wars movies', async () => {
      const results = [{ title: 'A New Hope', opening_crawl: 'A long time ago in a galaxy far, far away...' }];
      const data = { results };
      const axiosResponse: AxiosResponse = {
        data,
        status: 0,
        statusText: '',
        headers: undefined,
        config: undefined
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      const result = await service.starWarsMovies();

      expect(result).toEqual({data:results, message:''});
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {

      await expect(service.starWarsMovies()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getApiMoviesByTitle', () => {
    it('should get movies by title from the Movie DB API', async () => {
      const search = 'The Matrix';
      const results = [{ title: 'The Matrix', overview: 'Welcome to the Matrix' }];
      const data = { results };
      const axiosResponse: AxiosResponse = {
        data,
        status: 0,
        statusText: '',
        headers: undefined,
        config: undefined
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      const result = await service.getApiMoviesByTitle({ search });

      expect(result).toEqual(results);
    });


    it('should throw an InternalServerErrorException if an error occurs', async () => {

      await expect(service.getApiMoviesByTitle({ search: 'The Matrix' })).rejects.toThrow(InternalServerErrorException);
    });
  });


});


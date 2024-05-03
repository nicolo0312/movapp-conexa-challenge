import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../../utils/error-handler';
;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ErrorHandler,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { firstname: 'firstname',lastname:'lastname', email: 'test@example.com', password: 'password', };
      const hashedPassword = 'hashedpassword';
      const user = new User();
      user.firstname = createUserDto.firstname;
      user.email = createUserDto.email;
      user.password = hashedPassword;

      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const result = await service.create(createUserDto);

      expect(result).toEqual({ firstname: createUserDto.firstname, email: createUserDto.email });
    });

    it('should throw a BadRequestException if a duplicate entry error occurs', async () => {
      const createUserDto ={ firstname: 'firstname',lastname:'lastname', email: 'test@example.com', password: 'password', };
      const error = { code: 'ER_DUP_ENTRY', detail: 'Username already exists' };

      jest.spyOn(userRepository, 'create').mockImplementation(() => { throw error; });

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an InternalServerErrorException if an unknown error occurs', async () => {
      const createUserDto = { firstname: 'firstname',lastname:'lastname', email: 'test@example.com', password: 'password', };
      const error = new Error('Database connection error');

      jest.spyOn(userRepository, 'create').mockImplementation(() => { throw error; });

      await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});


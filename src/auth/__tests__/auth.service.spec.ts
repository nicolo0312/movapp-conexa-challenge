import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('testToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return user data and token if credentials are valid', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password' };
      const user = new User();
      user.id = '1';
      user.email = loginUserDto.email;
      user.password = bcrypt.hashSync(loginUserDto.password, 10);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.login(loginUserDto);

      expect(result).toEqual({ ...user, token: 'testToken' });
    });

    it('should throw an UnauthorizedException if user does not exist', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow("Credentials are not valid (email)");
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password' };
      const user = new User();
      user.id = '1';
      user.email = loginUserDto.email;
      user.password = bcrypt.hashSync('otherpassword', 10);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      await expect(service.login(loginUserDto)).rejects.toThrow("Credentials are not valid (password)");
    });

    it('should throw a BadRequestException if an error occurs', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

      await expect(service.login(loginUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkAuthStatus', () => {
    it('should return user data and token', async () => {
      const user = new User();
      user.id = '1';
      user.email = 'test@example.com';

      const result = await service.checkAuthStatus(user);

      expect(result).toEqual({ ...user, token: 'testToken' });
    });
  });
});

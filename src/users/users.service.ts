import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ErrorHandler } from '../utils/error-handler';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly errorHandler: ErrorHandler
  ){}


  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto
      const user =  this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save( user )
      delete user.password
      return user;
    } catch (error) {
      this.errorHandler.handleDBErrors(error);
    }
  }

}

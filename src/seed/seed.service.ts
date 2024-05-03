import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt'
import { ErrorHandler } from 'src/utils/error-handler';
@Injectable()
export class SeedService {
  constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly errorHandler: ErrorHandler){}

  async executeSeed() {
    try {
      const user = {
        email:process.env.USER_EMAIL_ADMINISTRATOR,
        password:bcrypt.hashSync(process.env.USER_PASS_ADMINISTRATOR,10),
        firstname:process.env.USER_NAME,
        lastname:process.env.USER_LASTNAME,
        role:process.env.USER_ROLE
      }
  
      const userCreated = await this.userRepository.create(user)
      await this.userRepository.save(userCreated)
  
      return 'Seed Execute';
    } catch (error) {
      this.errorHandler.handleDBErrors(error)
    }
  }

}

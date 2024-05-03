import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository <User>,
    private readonly jwtService: JwtService
  ){}

  async login(loginUserDto: LoginUserDto) {
    try {
      const {password, email} = loginUserDto
      const user = await this.userRepository.findOne({
        where:{email},
        select:{id:true, email:true, password:true}});

      if(!user)
        throw new UnauthorizedException('Credentials are not valid (email)');

      if(!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials are not valid (password)');

      return {
        ...user,
      token: this.getJwt({id:user.id})} 
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

    getJwt(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token
  }

  async checkAuthStatus(user: User){
    return {
      ...user,
      token: this.getJwt({id:user.id})
    }
  }

}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user-decorator';
import { User } from 'src/users/entities/user.entity';
import { Auth } from './decorators/auth.decorated';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }





}

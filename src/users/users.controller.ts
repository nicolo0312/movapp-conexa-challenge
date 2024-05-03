import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({status:201, description:'Movie was created', type: User})
  @ApiResponse({status:400, description:'Bad request: Resource already exists'})
  @ApiResponse({status:401, description:'Unauthorized'})
  @ApiResponse({status:403, description:'Forbidden. Invalid token'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

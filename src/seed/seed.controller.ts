import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Get()
  @ApiResponse({status:200,description:'Seed to generate an admnistrator user'})
  @ApiResponse({status:400,description:'Resource already exists'})
  findAll() {
    return this.seedService.executeSeed();
  }

}

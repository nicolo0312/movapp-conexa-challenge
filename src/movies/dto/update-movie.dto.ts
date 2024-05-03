import { CreateMovieDto } from './create-movie.dto';
import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    
    @IsOptional()
    title:string;
    
    @IsOptional()
    description:string;

    @IsOptional()
    runtime:number;

    @IsOptional()
    genre:string;

    @IsOptional()
    releaseDate:Date;
}

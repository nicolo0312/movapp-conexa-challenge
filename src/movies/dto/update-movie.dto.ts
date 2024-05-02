import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsOptional } from 'class-validator';

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

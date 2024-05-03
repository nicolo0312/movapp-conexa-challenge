import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMovieDto {
    @ApiProperty({
        description: 'Title Movie (unique)',
        nullable: false,
        minLength:1
    })
    @IsString()
    title:string;

    @ApiProperty({
        description:'Description of the movie'
    })
    @IsString()
    description:string;

    @ApiProperty({
        description: 'Runtime of movie'
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    runtime:number;

    @ApiProperty({
        description: 'Genres of movie'
    })
    @IsString()
    genre:string;

    @ApiProperty({
        description: 'Release date of movie'
    })
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    releaseDate:Date;

}

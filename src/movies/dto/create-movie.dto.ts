import { ApiProperty } from "@nestjs/swagger";
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
    releaseDate:Date;

}

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsPositive } from "class-validator";

export class CreateMovieFromApiDto {
    @ApiProperty({
        description:'Id from movie of MovieDB api (Unique), this id is obtained from the apiMoviesByTitle endpoint'
    })
    @IsPositive()
    @Type( () => Number)
    idMovie?:number;
}
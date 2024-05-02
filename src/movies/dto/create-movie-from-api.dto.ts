import { Type } from "class-transformer";
import { IsPositive } from "class-validator";

export class CreateMovieFromApiDto {
    @IsPositive()
    @Type( () => Number)
    idMovie?:number;
}
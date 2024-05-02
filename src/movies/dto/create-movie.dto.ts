import { IsOptional } from "class-validator";

export class CreateMovieDto {

    title:string;

    description:string;

    @IsOptional()
    runtime:number;

    genre:string;

    @IsOptional()
    releaseDate:Date;

}

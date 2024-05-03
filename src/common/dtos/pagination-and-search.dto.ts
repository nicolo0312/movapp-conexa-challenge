import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationAndSearchDto{
    @ApiProperty({
        default:10,
        description: 'How many rows do you need',
        required:false
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number)
    limit?:number;

    @ApiProperty({
        default:0,
        description:'How many rows do you want to skip',
        required:false
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number)
    offset?:number;

    @ApiProperty({
        description: "The search value is used to search by title both in the database and in the MovieDB API",
        required:false
    })
    @IsOptional()
    search?:string;
}
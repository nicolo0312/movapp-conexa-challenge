import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, MaxLength, MinLength, Matches} from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description:'Email User (Unique)'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description:'Password of email'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'First name of user'
    })
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    firstname: string;

    @ApiProperty({
        description: 'Last name of user'
    })
    @IsString()
    @MinLength(2)
    @MaxLength(25)
    lastname: string; 
}

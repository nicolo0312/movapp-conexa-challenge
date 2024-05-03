import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, MaxLength, MinLength, Matches} from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        description: 'Email user to login'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password user to login'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}
import {IsEmail, IsString, MaxLength, MinLength, Matches} from "class-validator";

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    firstname: string;

    @IsString()
    @MinLength(2)
    @MaxLength(25)
    lastname: string; 
}
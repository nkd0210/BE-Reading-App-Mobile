import { IsEmail, IsNotEmpty } from "class-validator";

export class ValidateAuthDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
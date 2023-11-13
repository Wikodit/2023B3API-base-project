import { IsNotEmpty, IsEmail, Length, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateAuthDto {

    @IsNotEmpty()
    @MinLength(8)
    password!: string;
  
    @IsNotEmpty()
    @IsEmail()
    email!: string;

}

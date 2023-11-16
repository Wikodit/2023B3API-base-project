import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @IsNotEmpty()
  @IsString()
  public password: string
}

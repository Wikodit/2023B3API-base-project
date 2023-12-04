import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email!: string

  @IsNotEmpty()
  @IsString()
  readonly password!: string
}

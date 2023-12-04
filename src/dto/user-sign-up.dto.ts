import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  IsNotEmpty
} from 'class-validator'
import { UserRole } from '../entity/user.entity'

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly username!: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string

  /** Plain password **/
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password!: string

  @IsOptional()
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role?: UserRole
}

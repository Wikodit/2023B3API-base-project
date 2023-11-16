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
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  readonly username!: string

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email!: string

  /** Plain password **/
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  readonly password!: string

  @IsOptional()
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role?: UserRole
}

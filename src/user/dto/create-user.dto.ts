import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(8, { message: 'user name must have at least 3 characters' })
  public username!: string

  @IsNotEmpty()
  @IsEmail({}, { message: 'you must provide a valid email' })
  public email!: string

  /** Clear password **/
  @IsNotEmpty()
  @MinLength(8, { message: 'user password must have at least 8 characters' })
  public passwd!: string

  public role?: UserRole = UserRole.EMPLOYEE
}

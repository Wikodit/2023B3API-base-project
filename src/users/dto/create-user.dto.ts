import { Entity } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRoleEnum } from '../entities/user.role.enum';

@Entity()
export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  public username!: string;
  @IsEmail()
  @IsNotEmpty()
  public email!: string;
  @MinLength(8)
  @IsNotEmpty()
  public password!: string;
  public role: UserRoleEnum;
}

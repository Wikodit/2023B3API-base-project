import { Entity } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRoleEnum } from '../entities/user.role.enum';

@Entity()
export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  public username!: string;
  @IsEmail()
  @IsNotEmpty({ message: 'Email obligatoire' })
  public email!: string;
  @MinLength(8)
  @IsNotEmpty({ message: 'Mot de passe obligatoire' })
  public password!: string;
  public role: UserRoleEnum;
}

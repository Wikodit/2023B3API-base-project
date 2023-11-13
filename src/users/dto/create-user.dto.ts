import { Entity } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRoleEnum } from '../entities/types/user.role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: 'Jean Moulin', description: 'Username' })
  public username!: string;
  @IsEmail()
  @ApiProperty({
    example: 'exemple.email@example.com',
    description: 'Email address',
  })
  @IsNotEmpty({ message: "Email can't be empty" })
  public email!: string;
  @MinLength(8)
  @IsNotEmpty({ message: "Password can't be empty" })
  public password!: string;
  @ApiProperty({
    enum: UserRoleEnum,
    enumName: 'UserRoleEnum',
    example: 'Employee',
    description: 'User role',
  })
  public role: UserRoleEnum;
}

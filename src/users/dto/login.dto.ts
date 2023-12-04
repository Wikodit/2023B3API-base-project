import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'exemple.email@example.com',
    description: 'Email address',
  })
  public email: string;
  @IsNotEmpty()
  @Exclude()
  public password: string;
}

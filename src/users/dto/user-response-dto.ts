import { UserRoleEnum } from '../entities/types/user.role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  username: string;
  @ApiProperty({ type: String })
  email: string;
  @ApiProperty({ type: String, enum: UserRoleEnum })
  role?: UserRoleEnum;

  constructor(
    id: string,
    username: string,
    email: string,
    role?: UserRoleEnum,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
  }
}

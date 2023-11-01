import { UserRoleEnum } from '../entities/user.role.enum';

export class UserResponseDto {
  id: string;
  username: string;
  role: UserRoleEnum;
  email: string;

  constructor(id: string, username: string, role: UserRoleEnum, email: string) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.email = email;
  }
}

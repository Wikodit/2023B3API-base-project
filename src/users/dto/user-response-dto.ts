import { UserRoleEnum } from '../entities/types/user.role.enum';
import { Project } from '../../projects/entities/project.entity';

export class UserResponseDto {
  id: string;
  username: string;
  role?: UserRoleEnum;
  email: string;
  employeeReferring?: Project[];
  constructor(
    id: string,
    username: string,
    role: UserRoleEnum,
    email: string,
    employeeReferring: Project[],
  ) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.email = email;
    this.employeeReferring = employeeReferring;
  }
}

import { UserResponseDto } from '../../users/dto/user-response-dto';
import { ProjectUser } from '../../project-user/entities/project-user.entity';

export class ProjectResponseDto {
  id: string;
  name: string;
  description?: string | null;
  referringEmployeeId: string;
  referringEmployee: UserResponseDto;
  projectUser?: ProjectUser[];
  constructor(
    id: string,
    name: string,
    description: string,
    referringEmployeeId: string,
    referringEmployee: UserResponseDto,
    projectUser: ProjectUser[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.referringEmployeeId = referringEmployeeId;
    this.referringEmployee = referringEmployee;
    this.projectUser = projectUser;
  }
}

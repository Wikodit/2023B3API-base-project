import { Project } from '../../projects/entities/project.entity';
import { UserResponseDto } from '../../users/dto/user-response-dto';
import { ProjectResponseDto } from '../../projects/dto/project-response-dto';

export class ProjectUsersResponseAdminDto {
  id: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  projectId: string;
  user: UserResponseDto;
  project: ProjectResponseDto;
  constructor(
    id: string,
    startDate: Date,
    endDate: Date,
    userId: string,
    projectId: string,
    user: UserResponseDto,
    project: ProjectResponseDto,
  ) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.userId = userId;
    this.projectId = projectId;
    this.user = user;
    this.project = project;
  }
}

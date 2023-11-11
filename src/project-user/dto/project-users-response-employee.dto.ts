import { UserResponseDto } from '../../users/dto/user-response-dto';
import { ProjectResponseDto } from '../../projects/dto/project-response-dto';

export class ProjectUsersResponseEmployeeDto {
  id: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  projectId: string;
  project: ProjectResponseDto;
  constructor(
    id: string,
    startDate: Date,
    endDate: Date,
    userId: string,
    projectId: string,
    project: ProjectResponseDto,
  ) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.userId = userId;
    this.projectId = projectId;
    this.project = project;
  }
}

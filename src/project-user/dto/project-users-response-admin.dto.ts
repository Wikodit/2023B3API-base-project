import { UserResponseDto } from '../../users/dto/user-response-dto';
import { ProjectResponseDto } from '../../projects/dto/project-response-dto';
import { IsNotEmpty } from 'class-validator';

export class ProjectUsersResponseAdminDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  projectId: string;
  user: UserResponseDto;
  project: ProjectResponseDto;
}

import { UserResponseDto } from '../../users/dto/user-response-dto';
import { ProjectUser } from '../../project-user/entities/project-user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  referringEmployeeId: string;

  referringEmployee: UserResponseDto;

  projectUser?: ProjectUser[];
}

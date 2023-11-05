import { User } from '../../users/entities/user.entity';
import { UserResponseDto } from '../../users/dto/user-response-dto';

export class ProjectResponseDto {
  id: string;
  name: string;
  description?: string;
  referringEmployeeId: string;
  referringEmployee: UserResponseDto;
  constructor(
    id: string,
    name: string,
    description: string,
    referringEmployeeId: string,
    referringEmployee: UserResponseDto,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.referringEmployeeId = referringEmployeeId;
    this.referringEmployee = referringEmployee;
  }
}

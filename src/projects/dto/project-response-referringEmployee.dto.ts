import { UserResponseDto } from '../../users/dto/user-response-dto';

export class ProjectResponseReferringEmployeeDto {
  id: string;
  name: string;
  referringEmployeeId: string;
  referringEmployee: UserResponseDto;
  constructor(
    id: string,
    name: string,
    referringEmployeeId: string,
    referringEmployee: UserResponseDto,
  ) {
    this.id = id;
    this.name = name;
    this.referringEmployeeId = referringEmployeeId;
    this.referringEmployee = referringEmployee;
  }
}

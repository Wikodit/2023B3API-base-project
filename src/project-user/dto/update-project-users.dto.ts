import { PartialType } from '@nestjs/swagger';
import { CreateProjectUsersDto } from './create-project-users.dto';

export class UpdateProjectUsersDto extends PartialType(CreateProjectUsersDto) {}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { UpdateProjectUsersDto } from './dto/update-project-users.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { UserRoleEnum } from '../users/entities/user.role.enum';
import { UsersService } from '../users/users.service';
@ApiTags('Project-Users')
@Controller('project-users')
export class ProjectUsersController {
  constructor(
    private readonly projectUsersService: ProjectUsersService,
    public usersService: UsersService,
  ) {}

  @Post()
  create(@Body() createProjectUsersDto: CreateProjectUsersDto) {
    return this.projectUsersService.create(createProjectUsersDto);
  }

  /*
  - En tant qu'Administrateurs ou Chef de projet, je veux pouvoir voir toutes les assignations
  des employés aux différents projets.
  - En tant qu'Employé, je veux pouvoir voir toutes mes assignations aux différents projets.
   */
  @Get()
  async findAll(@Req() req) {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: UserRoleEnum = user.role;
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        return this.projectUsersService.findAll();
      }
      if (userRole === 'Employee') {
        console.log(`${userRole} + ${typeof userRole}`);
      }
    } catch (error) {}
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectUsersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectUserDto: UpdateProjectUsersDto,
  ) {
    return this.projectUsersService.update(+id, updateProjectUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectUsersService.remove(+id);
  }
}

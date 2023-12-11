import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { UserRoleEnum } from '../users/entities/types/user.role.enum';
import { UsersService } from '../users/users.service';
import { ProjectUsersResponseDto } from './dto/project-users-response.dto';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectUsersResponseAdminDto } from './dto/project-users-response-admin.dto';

@ApiTags('Project-Users')
@Controller('project-users')
export class ProjectUsersController {
  constructor(
    private readonly projectUsersService: ProjectUsersService,

    public usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Req() req,
    @Body() createProjectUsersDto: CreateProjectUsersDto,
  ): Promise<ProjectUser | ProjectUsersResponseAdminDto> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: UserRoleEnum = user.role;
      if (userRole === 'Employee') {
        throw new UnauthorizedException(
          `${user.username} cannot assign a project to an employee`,
        );
      }
      return this.projectUsersService.create(createProjectUsersDto, user);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id') id: string,
  ): Promise<ProjectUsersResponseDto> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      return this.projectUsersService.findOne(id, user);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Req() req): Promise<ProjectUsersResponseDto[]> {
    try {
      const userRequest: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: string = userRequest.role;
      let projectUser: ProjectUsersResponseDto[];
      if (userRole === 'Admin' || userRole === 'ProjectManager') {
        projectUser = await this.projectUsersService.managerAndAdminfindAll();
      }
      if (userRole === 'Employee') {
        projectUser =
          await this.projectUsersService.employeeFindAllOwnProjects(
            userRequest,
          );
      }
      if (!projectUser) {
        throw new NotFoundException('ProjectUser not found');
      }
      return projectUser;
    } catch (error) {}
  }
}

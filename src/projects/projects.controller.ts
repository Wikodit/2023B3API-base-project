import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from '../users/users.service';
import { ProjectResponseDto } from './dto/project-response-dto';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { UserRoleEnum } from '../users/entities/user.role.enum';
import { Project } from './entities/project.entity';
import { ProjectUsersResponseDto } from '../project-user/dto/project-users-response.dto';

@Controller('projects')
@ApiTags('Project')
export class ProjectsController {
  constructor(
    @Inject(UsersService)
    public usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}
  @Post()
  async create(
    @Req() req,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: UserRoleEnum = user.role;
      if (userRole === 'Employee') {
        throw new UnauthorizedException(`${userRole} can't create project.`);
      }
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        const project: ProjectResponseDto = await this.projectsService.create(
          req.body.referringEmployeeId,
          userRole,
          createProjectDto,
        );
        return project;
      }
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Req() req,
  ): Promise<CreateProjectDto[] | ProjectUsersResponseDto[]> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: UserRoleEnum = user.role;
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        const projects = await this.projectsService.findAll();
        return projects;
      }
      if (userRole === 'Employee') {
        //return await this.projectsService.findProjectsEmployee(user);
      }
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id') id: string,
  ): Promise<Promise<CreateProjectDto> | string> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const project = await this.projectsService.findOne(id, user);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return project;
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}

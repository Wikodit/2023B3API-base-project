import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { UserRoleEnum } from '../users/entities/types/user.role.enum';
import { ProjectReponsePartialDto } from './dto/project-reponse-partial.dto';
import { ProjectResponseDto } from './dto/project-response-dto';

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
  ): Promise<ProjectReponsePartialDto> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: UserRoleEnum = user.role;
      if (userRole === 'Employee') {
        throw new UnauthorizedException(`${userRole} can't create project.`);
      }
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        const project: ProjectReponsePartialDto =
          await this.projectsService.create(
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

  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id') id: string,
  ): Promise<Promise<CreateProjectDto> | string> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const project: ProjectResponseDto = await this.projectsService.findOne(
        id,
        user,
      );
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return project;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Req() req,
  ): Promise<ProjectResponseDto | ProjectResponseDto[]> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: UserRoleEnum = user.role;
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        const projects: ProjectResponseDto[] =
          await this.projectsService.findAll();
        return projects;
      }
      if (userRole === 'Employee') {
        return await this.projectsService.findProjectsEmployee(user);
      }
    } catch (error) {
      throw error;
    }
  }
}

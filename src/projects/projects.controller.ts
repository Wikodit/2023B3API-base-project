import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Inject,
  NotFoundException,
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
  async findAll(@Req() req): Promise<Project[]> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const userRole: UserRoleEnum = user.role;
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        return await this.projectsService.findAll();
      }
      if (userRole === 'Employee') {
        console.log(`${userRole} + ${typeof userRole}`);
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
      const userRole = user.role;
      if (userRole !== 'Employee') {
        const project = await this.projectsService.findOne(id);
        if (!project) {
          throw new NotFoundException('Project not found');
        }
        return project;
        /*
        {
          id: project.id,
          name: project.name,
          description: project.description,
          referringEmployeeId: project.referringEmployeeId,
        };
         */
      }
      if (userRole === 'Employee') {
        //A finir
        const project = await this.projectsService.findOne(id);
        return project;
      }
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

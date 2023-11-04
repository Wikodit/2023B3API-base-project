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
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ProjectResponseDto } from './dto/project-response-dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../users/auth/public.decorator';

@Controller('projects')
@ApiTags('Project')
export class ProjectsController {
  constructor(
    @Inject(UsersService)
    public usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}
  @Post()
  async create(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    try {
      const user: User = await this.usersService.findOne(req.user.sub);
      const userRole = user.role;
      if (userRole === 'Employee') {
        throw new UnauthorizedException(`${userRole} can't create project.`);
      }
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        console.log(`${userRole} + ${typeof userRole}`);
        return await this.projectsService.create(userRole, createProjectDto);
      }
    } catch (error) {
      throw error;
    }
  }

  //@Public()
  @Get()
  //@UseGuards(AuthGuard)
  async findAll(@Req() req) {
    try {
      const user: User = await this.usersService.findOne(req.user.sub);

      const userRole = user.role;
      if (userRole === 'Employee') {
        console.log(`${userRole} + ${typeof userRole}`);
      }
      if (userRole === 'ProjectManager' || userRole === 'Admin') {
        console.log(`${userRole} + ${typeof userRole}`);
        return await this.projectsService.findAll();
      }
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id') id: string,
  ): Promise<Promise<ProjectResponseDto> | string> {
    try {
      const user: User = await this.usersService.findOne(req.user.sub);
      const userRole = user.role;
      if (userRole !== 'Employee') {
        const project = await this.projectsService.findOne(id);
        if (!project) {
          throw new NotFoundException('Project not found');
        }
        return {
          id: project.id,
          description: project.description,
          referringEmployeeId: project.referringEmployeeId,
        };
      } else {
        return `TODO`;
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

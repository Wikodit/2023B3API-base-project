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
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ProjectResponseDto } from './dto/project-response-dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../users/auth/auth.guard';
import { Public } from '../users/auth/public.decorator';
import * as http from 'http';

@Controller('projects')
@ApiTags('Project')
export class ProjectsController {
  constructor(
    @Inject(UsersService)
    public usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {
    //const userRole = this.usersService.
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  //@UseGuards(AuthGuard)
  async findAll(@Req() req) {
    const user: User = req.user;
    console.log(user);
    return await this.projectsService.findAll();
    /*
    try {
      const user: User = await this.usersService.findOne(req.user.sub);
      console.log(user);
      if (!user) {
        throw new UnauthorizedException('Unidentified user');
      } else {
        if (user.role === 'Employee') {
          return;
        }
        if (user.role === 'ProjectManager' || user.role === 'Admin') {
          return await this.projectsService.findAll();
        }
      }
    } catch (error) {
      throw error;
    }
     */
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    try {
      const project = await this.projectsService.findOne(id);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return {
        id: project.id,
      };
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

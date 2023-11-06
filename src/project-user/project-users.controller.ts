import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { UpdateProjectUsersDto } from './dto/update-project-users.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { UserRoleEnum } from '../users/entities/user.role.enum';
import { UsersService } from '../users/users.service';
import { ProjectUsersResponseDto } from './dto/project-users-response.dto';
import { ProjectUser } from './entities/project-user.entity';
import { User } from '../users/entities/user.entity';
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
  ): Promise<ProjectUser> {
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

  @Get()
  async findAll(@Req() req) {
    try {
      const userRequest: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );

      const projectUser = await this.projectUsersService.findAll(userRequest);
      if (!projectUser) {
        throw new NotFoundException('ProjectUser not found');
      }
      return projectUser;
    } catch (error) {}
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      return this.projectUsersService.findOne(id, user);
    } catch (error) {
      throw error;
    }
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

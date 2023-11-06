import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { UpdateProjectUsersDto } from './dto/update-project-users.dto';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { ProjectResponseDto } from '../projects/dto/project-response-dto';
import { ProjectUsersResponseDto } from './dto/project-users-response.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    public projectUsersRepository: Repository<ProjectUser>,
    @Inject(UsersService)
    public usersService: UsersService /*
    @Inject(ProjectsService)
    public projectsService: ProjectsService,
     */,
  ) {}
  async create(
    createProjectUsersDto: CreateProjectUsersDto,
  ): Promise<ProjectUser> {
    //Ou projectuserresponseDTO
    //      const projectUsers: ProjectUser = this.projectUsersRepository.create(validDto);
    try {
      const projectUsers: ProjectUser = this.projectUsersRepository.create({
        startDate: createProjectUsersDto.startDate,
        endDate: createProjectUsersDto.endDate,
        userId: createProjectUsersDto.userId,
        projectId: createProjectUsersDto.projectId,
      });
      /*
      if (!projectUsers.projectId || !projectUsers.userId) {
        throw new NotFoundException('');
      }
      */
      const savedProjectUsers: ProjectUser =
        await this.projectUsersRepository.save(projectUsers);
      return savedProjectUsers;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<ProjectUser[]> {
    try {
      return this.projectUsersRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    id: string,
    userRequest: UserResponseDto,
  ): Promise<ProjectUsersResponseDto> {
    try {
      const projectUser: ProjectUser =
        await this.projectUsersRepository.findOne({
          where: { id },
        });
      const userAssigned: UserResponseDto = await this.usersService.findOne(
        projectUser.userId,
      );
      /*
      const projectAssigned: ProjectResponseDto =
        await this.projectsService.findOne(projectUser.projectId, userAssigned);
       */
      if (!projectUser) {
        throw new NotFoundException('ProjectUser not found');
      }
      if (userRequest.role === 'Employee') {
        if (userRequest.id === projectUser.userId) {
          return projectUser;
        } else {
          throw new ForbiddenException(
            `${userRequest.username} isn't on this project`,
          );
        }
      } else {
        projectUser.userId = userAssigned.id;
        return projectUser;
      }
    } catch (error) {
      throw error;
    }
  }
  update(id: number, updateProjectUsersDto: UpdateProjectUsersDto) {
    return `This action updates a #${id} projectUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectUser`;
  }
}

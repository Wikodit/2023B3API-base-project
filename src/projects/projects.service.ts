import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectResponseDto } from './dto/project-response-dto';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { ProjectUsersService } from '../project-user/project-users.service';
import { ProjectUsersResponseDto } from '../project-user/dto/project-users-response.dto';
import { ProjectReponsePartialDto } from './dto/project-reponse-partial.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(UsersService)
    public usersService: UsersService,
    @Inject(forwardRef(() => ProjectUsersService))
    public projectUsersService: ProjectUsersService,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    referringEmployeeId: string,
    userRole: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      if (userRole === 'ProjectManager') {
        throw new UnauthorizedException(`${userRole} can't create project.`);
      } else {
        const project: ProjectResponseDto = this.projectsRepository.create({
          ...createProjectDto,
          referringEmployeeId: referringEmployeeId,
        });
        const referringEmployee: UserResponseDto =
          await this.usersService.findOne(referringEmployeeId);
        if (referringEmployee.role === 'Employee') {
          throw new UnauthorizedException("Employee can't manage a project.");
        } else {
          const savedProject: ProjectReponsePartialDto =
            await this.projectsRepository.save(project);
          return {
            ...savedProject,
            referringEmployee: referringEmployee,
          };
        }
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Unauthorized: ' + error.message);
      } else {
        throw new Error('Internal Server Error: ' + error);
      }
    }
  }
  async findOne(
    id: string,
    user: UserResponseDto,
  ): Promise<ProjectResponseDto> {
    try {
      if (user.role === 'Admin' || user.role === 'ProjectManager') {
        return await this.projectsRepository.findOne({ where: { id } });
      }
      if (user.role === 'Employee') {
        const projectUsers: ProjectUsersResponseDto[] =
          await this.projectUsersService.employeeFindAll(user);
        const arrayProjectId: string[] = [];
        projectUsers.map((projectUser: ProjectUsersResponseDto) => {
          arrayProjectId.push(projectUser.projectId);
        });
        for (const projectId of arrayProjectId) {
          if (projectId === id) {
            return this.projectsRepository.findOne({ where: { id } });
          }
        }
        throw new ForbiddenException('Project not found');
      }
      throw new ForbiddenException('Project not found');
    } catch (error) {
      throw error;
    }
  }
  async findAllForAdmin(): Promise<ProjectReponsePartialDto[]> {
    try {
      const projects: Project[] = await this.projectsRepository.find();
      const mappedProjects: ProjectReponsePartialDto[] = projects.map(
        (project: ProjectResponseDto) => {
          return {
            ...project,
          };
        },
      );
      return mappedProjects;
    } catch (error) {
      throw error;
    }
  }
  async findAll(query?: any): Promise<ProjectResponseDto[]> {
    try {
      const projects: ProjectResponseDto[] =
        await this.projectsRepository.find(query);

      const projectPromises: Promise<ProjectResponseDto>[] = projects.map(
        async (project: ProjectResponseDto) => {
          const user: UserResponseDto = await this.usersService.findOne(
            project.referringEmployeeId,
          );
          return {
            ...project,
            referringEmployee: user,
          };
        },
      );
      const projectResults: ProjectResponseDto[] =
        await Promise.all(projectPromises);
      return projectResults;
    } catch (error) {
      throw error;
    }
  }
  async findProjectsEmployee(
    user: UserResponseDto,
  ): Promise<ProjectResponseDto | ProjectResponseDto[]> {
    try {
      const projectUserList: ProjectUsersResponseDto[] =
        await this.projectUsersService.employeeFindAll(user);
      if (!projectUserList) {
        throw new NotFoundException();
      }
      const projectPromises: Promise<ProjectResponseDto>[] = [];
      for (const projectUser of projectUserList) {
        if (projectUser.userId === user.id) {
          const project: ProjectReponsePartialDto =
            await this.projectsRepository.findOne({
              where: { id: projectUser.projectId },
            });
          const referringEmployee: UserResponseDto =
            await this.usersService.findOne(project.referringEmployeeId);
          const projectDetails: ProjectResponseDto = {
            ...project,
            referringEmployee: referringEmployee,
          };
          projectPromises.push(Promise.resolve(projectDetails));
        }
      }
      const projectUserArray: ProjectResponseDto[] =
        await Promise.all(projectPromises);
      return projectUserArray;
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }
  findOneAdmin(id: string): Promise<ProjectResponseDto> {
    try {
      return this.projectsRepository.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }
}

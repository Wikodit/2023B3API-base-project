import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectResponseDto } from './dto/project-response-dto';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { ProjectUsersService } from '../project-user/project-users.service';
import { ProjectUsersResponseDto } from '../project-user/dto/project-users-response.dto';
import { ProjectResponseReferringEmployeeDto } from './dto/project-response-referringEmployee.dto';
import { ProjectReponseAdminDto } from './dto/project-reponse-admin.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(UsersService)
    public usersService: UsersService,
    @Inject(ProjectUsersService)
    public projectUsersService: ProjectUsersService,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    referringEmployeeId,
    userRole,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      if (userRole === 'ProjectManager') {
        throw new UnauthorizedException(`${userRole} can't create project.`);
      } else {
        const project: Project = this.projectsRepository.create({
          name: createProjectDto.name,
          description: 'CreateProject Description', //description: createProjectDto.description??
          referringEmployeeId: referringEmployeeId,
        });
        const referringEmployee: UserResponseDto =
          await this.usersService.findOne(referringEmployeeId);
        if (referringEmployee.role === 'Employee') {
          throw new UnauthorizedException("Employee can't manage a project.");
        } else {
          const savedProject: Project =
            await this.projectsRepository.save(project);
          return {
            id: savedProject.id,
            name: savedProject.name,
            referringEmployeeId: referringEmployeeId,
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
  async findAllForAdmin(): Promise<ProjectReponseAdminDto[]> {
    try {
      const projects: Project[] = await this.projectsRepository.find();
      const mappedProjects: ProjectReponseAdminDto[] = projects.map(
        (project: Project) => {
          return {
            id: project.id,
            name: project.name,
            referringEmployeeId: project.referringEmployeeId,
          };
        },
      );
      return mappedProjects;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<ProjectResponseReferringEmployeeDto[]> {
    try {
      const projects: ProjectResponseDto[] =
        await this.projectsRepository.find();

      const projectPromises: Promise<ProjectResponseReferringEmployeeDto>[] =
        projects.map(async (project: ProjectResponseDto) => {
          const user: UserResponseDto = await this.usersService.findOne(
            project.referringEmployeeId,
          );
          return {
            id: project.id,
            name: project.name,
            referringEmployeeId: project.referringEmployeeId,
            referringEmployee: user,
          };
        });

      const projectResults: ProjectResponseReferringEmployeeDto[] =
        await Promise.all(projectPromises);
      return projectResults;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, user: UserResponseDto): Promise<Project> {
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
  async findProjectsEmployee(
    user: UserResponseDto,
  ): Promise<
    ProjectResponseReferringEmployeeDto | ProjectResponseReferringEmployeeDto[]
  > {
    try {
      const projectUserList: ProjectUsersResponseDto[] =
        await this.projectUsersService.employeeFindAll(user);
      if (!projectUserList) {
        throw new NotFoundException();
      }
      const projectPromises: Promise<ProjectResponseReferringEmployeeDto>[] =
        [];
      for (const projectUser of projectUserList) {
        if (projectUser.userId === user.id) {
          const project: Project = await this.projectsRepository.findOne({
            where: { id: projectUser.projectId },
          });
          const referringEmployee: UserResponseDto =
            await this.usersService.findOne(project.referringEmployeeId);
          const projectDetails: ProjectResponseReferringEmployeeDto = {
            id: project.id,
            name: project.name,
            referringEmployeeId: project.referringEmployeeId,
            referringEmployee: referringEmployee,
          };
          projectPromises.push(Promise.resolve(projectDetails));
        }
      }
      const projectUserArray: ProjectResponseReferringEmployeeDto[] =
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

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}

import {
  ForbiddenException,
  forwardRef,
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
import { ProjectUsersResponseDto } from './dto/project-users-response.dto';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectResponseDto } from '../projects/dto/project-response-dto';
import { CreateProjectDto } from '../projects/dto/create-project.dto';
import { ProjectUsersResponseAdminDto } from './dto/project-users-response-admin.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    public projectUsersRepository: Repository<ProjectUser>,
    @Inject(UsersService)
    public usersService: UsersService,
    @Inject(forwardRef(() => ProjectsService))
    public projectsService: ProjectsService,
  ) {}
  async create(
    createProjectUsersDto: CreateProjectUsersDto,
    user: UserResponseDto,
  ): Promise<ProjectUser | ProjectUsersResponseAdminDto> {
    try {
      const projectUsers: ProjectUser = this.projectUsersRepository.create(
        createProjectUsersDto,
      );
      const savedProjectUsers: ProjectUser =
        await this.projectUsersRepository.save(projectUsers);
      if (user.role === 'ProjectManager') {
        if (!savedProjectUsers.userId) {
          throw new NotFoundException("Can't assign project, user not found");
        }
        return savedProjectUsers;
      }
      if (user.role === 'Admin') {
        const userAssigned: UserResponseDto = await this.usersService.findOne(
          projectUsers.userId,
        );
        const projectAssigned: ProjectResponseDto =
          await this.projectsService.findForAdmin(projectUsers.projectId);

        //ICI PROBLEME LORS DU PROJECT RETOUR, FAUT RENVOYER LE REFERRENIGMANAGERID
        const adminResponse: ProjectUsersResponseAdminDto = {
          id: savedProjectUsers.id,
          startDate: savedProjectUsers.startDate,
          endDate: savedProjectUsers.endDate,
          userId: savedProjectUsers.userId,
          projectId: savedProjectUsers.projectId,
          user: userAssigned,
          project: projectAssigned,
        };
        if (!savedProjectUsers.userId) {
          throw new NotFoundException("Can't assign project, user not found");
        }
        return adminResponse;
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    userRequest: UserResponseDto,
  ): Promise<CreateProjectDto[] | ProjectUsersResponseDto[]> {
    try {
      const userRole: string = userRequest.role;
      if (userRole === 'Admin' || userRole === 'ProjectManager') {
        const projectList = await this.projectsService.findAll();
        const projectResponse = projectList.map((project) => {
          return {
            id: project.id,
            name: project.name,
            referringEmployeeId: project.referringEmployeeId,
          };
        });
        return projectResponse;
      }

      if (userRole === 'Employee') {
        const userRequestId: string = userRequest.id;
        const usersProjectsAssigned: ProjectUser[] =
          await this.projectUsersRepository.find();

        const ownUserProjectUser: ProjectUser[] = usersProjectsAssigned.filter(
          (userProjects: ProjectUser): boolean =>
            userProjects.userId === userRequestId,
        );
        if (ownUserProjectUser[0] === null) {
          throw new ForbiddenException('No project for this user');
        } else {
          return ownUserProjectUser;
        }
      }
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
      if (userRequest.role === 'Employee') {
        const projectAssigned: ProjectResponseDto =
          await this.projectsService.findOne(
            projectUser.projectId,
            userAssigned,
          );
        if (projectAssigned) {
          return projectUser;
        } else {
          throw new ForbiddenException(
            `${userAssigned.username} isn't on this project`,
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

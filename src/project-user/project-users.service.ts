import {
  ConflictException,
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
import { ProjectUsersResponseAdminDto } from './dto/project-users-response-admin.dto';
import { ProjectReponsePartialDto } from '../projects/dto/project-reponse-partial.dto';

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
      const projectUser: ProjectUser = this.projectUsersRepository.create(
        createProjectUsersDto,
      );
      const userAssigned: UserResponseDto = await this.usersService.findOne(
        projectUser.userId,
      );
      const projectAssigned: ProjectReponsePartialDto =
        await this.projectsService.findOneAdmin(projectUser.projectId);
      if (!projectAssigned || !userAssigned) {
        throw new NotFoundException('Not found');
      }
      const employeeReferring: UserResponseDto =
        await this.usersService.findOne(projectAssigned.referringEmployeeId);
      const userProjects: ProjectUser[] =
        await this.projectUsersRepository.find({
          where: { userId: userAssigned.id },
        });

      const startDateNewPro = new Date(projectUser.startDate).getTime();
      const endDateNewPro = new Date(projectUser.endDate).getTime();

      userProjects.forEach((project: ProjectUser) => {
        const userProjectDate = {
          startDate: `${project.startDate.getTime()}`,
          endDate: `${project.endDate.getTime()}`,
        };
        if (
          (startDateNewPro <= parseInt(userProjectDate.startDate) &&
            endDateNewPro >= parseInt(userProjectDate.endDate)) ||
          (startDateNewPro >= parseInt(userProjectDate.startDate) &&
            endDateNewPro <= parseInt(userProjectDate.endDate)) ||
          (startDateNewPro <= parseInt(userProjectDate.startDate) &&
            endDateNewPro >= parseInt(userProjectDate.startDate)) ||
          (startDateNewPro <= parseInt(userProjectDate.endDate) &&
            endDateNewPro >= parseInt(userProjectDate.endDate))
        ) {
          throw new ConflictException(
            `${userAssigned.username} already assigned to project on the same date range`,
          );
        }
      });
      if (user.role === 'ProjectManager') {
        const savedProjectUsers: ProjectUser =
          await this.projectUsersRepository.save(projectUser);
        return savedProjectUsers;
      }
      if (user.role === 'Admin') {
        const savedProjectUsers: ProjectUser =
          await this.projectUsersRepository.save(projectUser);
        const adminResponse: ProjectUsersResponseAdminDto = {
          /*
          id: savedProjectUsers.id,
          startDate: savedProjectUsers.startDate,
          endDate: savedProjectUsers.endDate,
          userId: savedProjectUsers.userId,
          projectId: savedProjectUsers.projectId,
           */
          ...savedProjectUsers,
          user: userAssigned,
          project: {
            id: projectAssigned.id,
            name: projectAssigned.name,
            referringEmployeeId: projectAssigned.referringEmployeeId,

            //...projectAssigned,
            referringEmployee: employeeReferring,
          },
        };
        return adminResponse;
      }
    } catch (error) {
      throw error;
    }
  }
  async employeeFindAll(
    userRequest: UserResponseDto,
  ): Promise<ProjectUsersResponseDto[]> {
    try {
      const userRequestId: string = userRequest.id;
      const usersProjectsAssigned: ProjectUsersResponseDto[] =
        await this.projectUsersRepository.find({
          where: { userId: userRequestId },
        });
      if (usersProjectsAssigned[0] === null) {
        throw new ForbiddenException('No project for this user');
      } else {
        return usersProjectsAssigned;
      }
    } catch (error) {
      throw error;
    }
  }
  async employeeFindAllOwnProjects(
    userRequest: UserResponseDto,
  ): Promise<ProjectReponsePartialDto[]> {
    try {
      const userRequestId: string = userRequest.id;
      const usersProjectsAssigned: ProjectUsersResponseDto[] =
        await this.projectUsersRepository.find({
          where: { userId: userRequestId },
        });
      if (usersProjectsAssigned[0] === null) {
        throw new ForbiddenException('No project for this user');
      } else {
        const projectOwnUserArr: ProjectReponsePartialDto[] = [];
        for (const projectUser of usersProjectsAssigned) {
          const projectOwnUser: ProjectReponsePartialDto =
            await this.projectsService.findOne(
              projectUser.projectId,
              userRequest,
            );
          projectOwnUserArr.push({
            id: projectOwnUser.id,
            name: projectOwnUser.name,
            referringEmployeeId: projectOwnUser.referringEmployeeId,
          });
        }
        return projectOwnUserArr;
      }
    } catch (error) {
      throw error;
    }
  }
  async managerAndAdminfindAll(): Promise<ProjectReponsePartialDto[] | void> {
    try {
      const projectList: ProjectReponsePartialDto[] =
        await this.projectsService.findAllForAdmin();
      return projectList;
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

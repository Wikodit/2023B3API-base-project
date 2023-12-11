import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
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
    const employeeReferring: UserResponseDto = await this.usersService.findOne(
      projectAssigned.referringEmployeeId,
    );
    const userProjects: ProjectUser[] = await this.projectUsersRepository.find({
      where: { userId: userAssigned.id },
    });
    const startDateNewPro: number = new Date(projectUser.startDate).getTime();
    const endDateNewPro: number = new Date(projectUser.endDate).getTime();
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
        ...savedProjectUsers,
        user: userAssigned,
        project: {
          ...projectAssigned,
          referringEmployee: employeeReferring,
        },
      };
      return adminResponse;
    }
  }

  async findOne(
    id: string,
    userRequest: UserResponseDto,
  ): Promise<ProjectUsersResponseDto> {
    const projectUser: ProjectUser = await this.projectUsersRepository.findOne({
      where: { id },
    });
    const userAssigned: UserResponseDto = await this.usersService.findOne(
      projectUser.userId,
    );
    if (userRequest.role === 'Employee') {
      const projectAssigned: ProjectResponseDto =
        await this.projectsService.findOne(projectUser.projectId, userAssigned);
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
  }

  async employeeFindAll(
    userRequest: UserResponseDto,
  ): Promise<ProjectUsersResponseDto[]> {
    const userRequestId: string = userRequest.id;
    const usersProjectsAssigned: ProjectUsersResponseDto[] =
      await this.projectUsersRepository.find({
        where: { userId: userRequestId },
      });
    if (usersProjectsAssigned.length === 0) {
      throw new ForbiddenException('No project for this user');
    } else {
      return usersProjectsAssigned;
    }
  }

  async projectManagerGetDate(
    userId: string,
    eventToValid: Date,
  ): Promise<ProjectUser> {
    const options: FindManyOptions<ProjectUser> = {
      where: {
        startDate: LessThanOrEqual(eventToValid),
        endDate: MoreThanOrEqual(eventToValid),
        project: {
          referringEmployeeId: userId,
        },
      },
      relations: ['project'],
    };
    return this.projectUsersRepository.findOne(options);
  }

  async employeeFindAllOwnProjects(
    userRequest: UserResponseDto,
  ): Promise<ProjectReponsePartialDto[]> {
    const userRequestId: string = userRequest.id;
    const usersProjectsAssigned: ProjectUsersResponseDto[] =
      await this.projectUsersRepository.find({
        where: { userId: userRequestId },
      });
    if (usersProjectsAssigned.length === 0) {
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
  }

  async managerAndAdminfindAll(): Promise<ProjectReponsePartialDto[] | void> {
    return await this.projectsService.findAllForAdmin();
  }

  async findOneByDateAndUser(date: Date, userId: string): Promise<ProjectUser> {
    const projectUser = await this.projectUsersRepository.findOne({
      where: {
        userId,
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
      },
    });
    if (!projectUser) {
      throw new NotFoundException(
        'No project found for this user on this date',
      );
    }
    return projectUser;
  }
}

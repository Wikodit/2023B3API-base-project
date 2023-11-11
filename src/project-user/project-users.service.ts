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
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { ProjectUsersResponseDto } from './dto/project-users-response.dto';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectResponseDto } from '../projects/dto/project-response-dto';
import { ProjectUsersResponseAdminDto } from './dto/project-users-response-admin.dto';
import { ProjectReponseAdminDto } from '../projects/dto/project-reponse-admin.dto';
@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    public projectUsersRepository: Repository<ProjectUser>,
    @Inject(UsersService)
    public usersService: UsersService,
    @Inject(forwardRef(() => ProjectsService))
    public projectsService: ProjectsService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async create(
    createProjectUsersDto: CreateProjectUsersDto,
    user: UserResponseDto,
  ): Promise<ProjectUser | ProjectUsersResponseAdminDto> {
    try {
      const projectUsers: ProjectUser = this.projectUsersRepository.create(
        createProjectUsersDto,
      );
      //401 If user or project not found
      const userAssigned: UserResponseDto = await this.usersService.findOne(
        projectUsers.userId,
      );
      const projectAssigned: ProjectResponseDto =
        await this.projectsService.findOneAdmin(projectUsers.projectId);

      if (!projectAssigned || !userAssigned) {
        throw new NotFoundException('Not found');
      }
      const employeeReferring: UserResponseDto =
        await this.usersService.findOne(projectAssigned.referringEmployeeId);
      //409 If user already assigned to project on the same date range
      const userProjects: ProjectUser[] =
        await this.projectUsersRepository.find({
          where: { userId: userAssigned.id },
        });

      const startsDatesUser: Date[] = userProjects.map(
        (project: ProjectUser) => project.startDate,
      );
      const endsDatesUser: Date[] = userProjects.map(
        (project: ProjectUser) => project.startDate,
      );
      const startDate: Date = new Date(projectUsers.startDate);
      const endDate: Date = new Date(projectUsers.endDate);

      const userNewProjectDates = [
        { startDate: `${startDate}`, endDate: `${endDate}` },
      ];

      const userProjectsDates = [
        { startDate: `${startsDatesUser}`, endDate: `${endsDatesUser}` },
      ];

      const isAConflictException: boolean = userProjectsDates.some(
        (project) => {
          return userNewProjectDates.some((newProject) => {
            return (
              newProject.startDate <= project.startDate &&
              newProject.endDate >= project.endDate
            );
          });
        },
      );
      if (isAConflictException) {
        throw new ConflictException(
          `${userAssigned.username} already assigned to project on the same date range`,
        );
      }
      console.log('userProjectsDates');
      console.log(userProjectsDates);
      console.log(userProjectsDates);
      console.log(userProjectsDates);
      console.log(userProjectsDates);
      if (user.role === 'ProjectManager') {
        const savedProjectUsers: ProjectUser =
          await this.projectUsersRepository.save(projectUsers);
        return savedProjectUsers;
      }
      if (user.role === 'Admin') {
        const savedProjectUsers: ProjectUser =
          await this.projectUsersRepository.save(projectUsers);
        const adminResponse: ProjectUsersResponseAdminDto = {
          id: savedProjectUsers.id,
          startDate: savedProjectUsers.startDate,
          endDate: savedProjectUsers.endDate,
          userId: savedProjectUsers.userId,
          projectId: savedProjectUsers.projectId,
          user: userAssigned,
          project: {
            id: projectAssigned.id,
            name: projectAssigned.name,
            referringEmployeeId: projectAssigned.referringEmployeeId,
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
    } catch (error) {
      throw error;
    }
  }
  async managerAndAdminfindAll(): Promise<ProjectReponseAdminDto[] | void> {
    try {
      const projectList: ProjectReponseAdminDto[] =
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

  async findAllDateByAnUser(user: UserResponseDto): Promise<ProjectUser[]> {
    //const userDates = [];
    const userProjects: ProjectUser[] = await this.projectUsersRepository.find({
      where: { userId: user.id },
    });
    console.log('userProjects');
    console.log(userProjects);
    console.log(userProjects.map((project) => project.startDate));
    console.log(userProjects.map((project) => project.endDate));

    console.log(userProjects);
    console.log(userProjects);
    return userProjects;
  }
  update(id: number, updateProjectUsersDto: UpdateProjectUsersDto) {
    return `This action updates a #${id} projectUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectUser`;
  }
}

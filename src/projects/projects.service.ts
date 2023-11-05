import {
  BadRequestException,
  Inject,
  Injectable,
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

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(UsersService)
    public usersService: UsersService,
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
  async findAll(): Promise<Project[]> {
    try {
      return this.projectsRepository.find();
    } catch (error) {
      throw error;
    }
  }

  findOne(id: string): Promise<Project> {
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

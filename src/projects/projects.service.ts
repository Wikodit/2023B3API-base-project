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
import { User } from '../users/entities/user.entity';
import { UserRoleEnum } from '../users/entities/user.role.enum';
import { ProjectResponseDto } from './dto/project-response-dto';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(UsersService)
    public usersService: UsersService,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    userRole,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    console.log(userRole);
    if (userRole === 'ProjectManager') {
      throw new UnauthorizedException(`${userRole} can't create project.`);
    } else {
      const project: Project = this.projectsRepository.create({
        name: createProjectDto.name,
        description: 'Description CreateProject', //description: createProjectDto.description,
        referringEmployeeId: '50ea9634-bf10-42e7-ac3f-ece5f4c619dc', //req.user.sub, //temp
      });
      const savedProject: Project = await this.projectsRepository.save(project);
      return {
        id: savedProject.id,
        description: savedProject.description,
        referringEmployeeId: savedProject.referringEmployeeId,
      };
    }
  }

  /*
  async create(
    req,
    createProjectDto: CreateProjectDto,
  ): Promise<CreateProjectDto> {
    try {
      const user: User = await this.usersService.findOne(req.user.sub);
      const userRole = user.role;
      if (userRole === 'Employee') {
        throw new UnauthorizedException(`${userRole} can't create project.`);
      } else {
        const project: Project = this.projectsRepository.create({
          name: createProjectDto.name,
          description: createProjectDto.description,
          referringEmployeeId: createProjectDto.referringEmployeeId,
        });
        const savedProject: Project =
          await this.projectsRepository.save(project);
        return savedProject;



        const project: Project = this.projectsRepository.create({
        name: createProjectDto.name,
        description: createProjectDto.description,
        referringEmployeeId: '50ea9634-bf10-42e7-ac3f-ece5f4c619dc', //req.user.sub, //temp
      });
      const savedProject: Project = await this.projectsRepository.save(project);
      return savedProject;
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Unauthorized: ' + error.message);
      } else {
        throw new Error('Internal Server Error: ' + error);
      }
    }
  }
   */

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

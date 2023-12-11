import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, FindManyOptions, FindOneOptions, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import Project from '../projects/entities/project.entity';

@Injectable()
export class ProjectsUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectsUsersRepository: Repository<ProjectUser>
  ) {}

  // Créer un nouvel utilisateur de projet
  async create(
    createProjectUserDto: CreateProjectUserDto,
  ): Promise<ProjectUser> {
    try {
      const newProjectUser =
        this.projectsUsersRepository.create(createProjectUserDto);
      const savedProjectUser =
        await this.projectsUsersRepository.save(newProjectUser);
      if (savedProjectUser == null) {
        throw new NotFoundException("L'utilisateur ou le projet n'a pas été trouvé");
      }
      const options: FindManyOptions<ProjectUser> = {
        where: { id: savedProjectUser.id },
        relations: ['user', 'project', 'project.referringEmployee'],
      };
      const completeProjectUser =
        await this.projectsUsersRepository.findOne(options);
      delete completeProjectUser.project.referringEmployee.password;
      delete completeProjectUser.user.password;
      return completeProjectUser;
    } catch (error) {
      throw new NotFoundException("L'utilisateur ou le projet n'a pas été trouvé");
    }
  }


  // Récupérer un utilisateur de projet avec tous les détails
  private async getCompleteProjectUser(id: string): Promise<ProjectUser> {
    const options = this.buildFindOptionsWithRelations(['user', 'project', 'project.referringEmployee']);
    const completeProjectUser = await this.projectsUsersRepository.findOne({...options, where: { id }});
    if (!completeProjectUser) {
      throw new NotFoundException("L'utilisateur ou le projet n'a pas été trouvé");
    }
    delete completeProjectUser.project.referringEmployee.password;
    delete completeProjectUser.user.password;
    return completeProjectUser;
  }

  // Trouver un projet par l'employé
  async findByEmployee(createProjectUserDto: CreateProjectUserDto): Promise<ProjectUser | null> {
    const finds = await this.projectsUsersRepository.find({ 
      where: { userId: createProjectUserDto.userId } 
    });
    for (const find of finds) {
      if (this.isDateRangeOverlapping(find, createProjectUserDto)) {
        return find;
      }
    }
    return null;
  }

  // Vérifier si les plages de dates se chevauchent
  private isDateRangeOverlapping(find: ProjectUser, dto: CreateProjectUserDto): boolean {
    return (
      (find.startDate <= dto.startDate && find.endDate >= dto.startDate) ||
      (dto.startDate <= find.startDate && dto.endDate >= find.startDate)
    );
  }

  // Récupérer tous les projets
  async findAll(): Promise<Project[]> {
    const projectUsers = await this.projectsUsersRepository.find(this.buildFindOptionsWithRelations(['user', 'project']));
    return projectUsers.map(projectUser => projectUser.project);
  }

  // Récupérer un projet spécifique par ID
  async findOneProject(id: string): Promise<Project[]> {
    const projectUsers = await this.projectsUsersRepository.find({
      ...this.buildFindOptionsWithRelations(['user', 'project']), 
      where: { id }
    });
    return projectUsers.map(projectUser => projectUser.project);
  }

  // Récupérer un utilisateur de projet spécifique par ID
  async findOne(id: string): Promise<ProjectUser> {
    const userProject = await this.projectsUsersRepository.findOne({ where: { id } });
    if (!userProject) {
      throw new NotFoundException("Le projet de l'utilisateur n'a pas été trouvé");
    }
    return userProject;
  }

  // Vérifier si l'utilisateur est impliqué dans un projet
  async isUserInvolvedInProject(userId: string, projectId: string): Promise<boolean> {
    const project = await this.projectsUsersRepository.findOne({
      where: { userId, projectId }
    });
    return !!project;
  }

  // Récupérer les projets d'un utilisateur
  async getProjectsUser(userId: string) {
    const options: FindOneOptions<CreateProjectUserDto> = {
      where: { userId: userId },
      relations: ['user', 'project', 'project.referringEmployee'],
    };
    const projectUser = await this.projectsUsersRepository.find(options);
    const rep = projectUser.map((projectUser) => ({
      id: projectUser.project.id,
      name: projectUser.project.name,
      referringEmployeeId: projectUser.project.referringEmployeeId,
      referringEmployee: {
        id: projectUser.user.id ,
        username: projectUser.user.username,
        email: projectUser.user.email,
        role: projectUser.user.role,
      },
    }));
    return rep;
  }
  
  // Vérifier si le manager est assigné à un projet à une date donnée
  async managerDate(userId: string, date: Date) {
    const involvedManager = await this.projectsUsersRepository.findOne({
      where: {
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
        project: { referringEmployeeId: userId },
      },
      relations: ['project']
    });
    return involvedManager;
  }

  // Construire les options de recherche avec relations
  private buildFindOptionsWithRelations(relations: string[]): FindManyOptions<ProjectUser> {
    return { relations };
  }
}

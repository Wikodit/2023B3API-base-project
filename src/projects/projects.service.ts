import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private readonly jwtService: JwtService,
  ) {}

  // Fonction pour creer un nouveau projet
  async create(createProjectDto: CreateProjectDto) {
    const newProject = this.projectsRepository.create(createProjectDto);
    const insertedProject = await this.projectsRepository.save(newProject);
    return { insertedProject };
  }

  //fonction pour recuperer le projet par son nom
  async getProject(name: string) {
    const project: UpdateProjectDto = await this.projectsRepository.findOne({
      where: { name: name },
    });
    return { project };
  }
  // fonction pour recup tout les projets
  async findAll() {
    const options: FindManyOptions<Project> = {
      relations: ['referringEmployee'],
    };
    const projects = await this.projectsRepository.find(options);

    const allProjets = projects.map((project) => ({
      id: project.id,
      name: project.name,
      referringEmployeeId: project.referringEmployeeId,
      referringEmployee: {
        id: project.referringEmployee.id,
        username: project.referringEmployee.username,
        email: project.referringEmployee.email,
        role: project.referringEmployee.role,
      },
    }));
    return allProjets;
  }
  //recherche un projet par un id  employée 
  async findByEmployee(id: string) {
    const options: FindManyOptions<Project> = {
      where: { referringEmployeeId: id },
      relations: ['user', 'project_user'],
    };
    const project = await this.projectsRepository.findOne(options);
    delete project.referringEmployee.password;
    return { project };
  }
//recherche un projet par son id
  async findById(id: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: id },
    });
    return project;
  }
}

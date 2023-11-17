import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Project } from '../entity/project.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectCreateDto } from '../dto/project-create.dto'

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>
  ) {}

  /**
   * Create a new project from the given data.
   */
  public async create(dto: ProjectCreateDto): Promise<Project> {
    return this.repository.save(this.repository.create(dto))
  }

  /**
   * Find all projects.
   */
  public async findAll(): Promise<Project[]> {
    return this.repository.find()
  }

  /**
   * Find project matching to the given UUID, otherwise null.
   */
  public async findById(id: string): Promise<Project | null> {
    return this.repository.findOneBy({ id })
  }

  /**
   * Find project where the given user is a part of it.
   */
  public async findUserProjects(id: string): Promise<Project[]> {
    return this.repository.findBy({ referringEmployeeId: id })
  }
}
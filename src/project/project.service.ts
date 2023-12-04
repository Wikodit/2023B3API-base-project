import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Project } from '../entity/project.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ProjectCreateDto } from '../dto/project-create.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    private readonly users: UserService
  ) {}

  /**
   * Create a new project from the given data.
   */
  public async create(dto: ProjectCreateDto): Promise<Project> {
    return this.repository.save(this.repository.create({
      ...dto,
      referringEmployee: await this.users.findById(dto.referringEmployeeId)
    }))
  }

  /**
   * Find all projects.
   */
  public async findAll(): Promise<Project[]> {
    return this.repository.find({relations: [ 'referringEmployee' ]})
  }

  /**
   * Find project matching to the given UUID, otherwise null.
   */
  public async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({
      relations: [ 'referringEmployee' ],
      where: { id }
    })
  }
}
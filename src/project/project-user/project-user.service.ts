import { Injectable } from '@nestjs/common'
import { ProjectUserCreateDto } from '../../dto/project-user-create.dto'
import { ProjectUser } from '../../entity/project-user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ProjectUserService {

  constructor(
    @InjectRepository(ProjectUser)
    private readonly repository: Repository<ProjectUser>,
  ) {}

  /**
   * Create a new project member for the given project and user
   */
  public async create(dto: ProjectUserCreateDto): Promise<ProjectUser> {
    return this.repository.save(this.repository.create(dto))
  }
}
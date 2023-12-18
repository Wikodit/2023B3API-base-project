import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectUserCreateDto } from '../../dto/project-user-create.dto'
import { ProjectUser } from '../../entity/project-user.entity'
import { Project } from '../../entity/project.entity'
import { User } from '../../entity/user.entity'

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly repository: Repository<ProjectUser>
  ) {}

  /**
   * Create a new project member for the given project and user
   */
  public async create(dto: ProjectUserCreateDto): Promise<ProjectUser> {
    return this.repository.save(this.repository.create(dto))
  }

  /**
   * Return true if the given user is a member of the given project
   */
  public async isMemberOf(user: User, project: Project): Promise<boolean> {
    const pUser = await this.repository.findOneBy({
      userId: user.id,
      projectId: project.id
    })
    
    return pUser!== null
  }

  /**
   * Return a list of projects where the given user is registered as member.
   */
  public async getUserProjects(user: User): Promise<Project[]> {
    return this.repository
      .findBy({ userId: user.id })
      .then((pus) => Promise.resolve(pus.map((pu) => pu.project)))
  }
}

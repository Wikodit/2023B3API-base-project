import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectUserCreateDto } from '../../dto/project-user-create.dto'
import { ProjectUser } from '../../entity/project-user.entity'
import { Project } from '../../entity/project.entity'
import { User } from '../../entity/user.entity'
import { UserService } from '../../user/user.service'
import { ProjectService } from '../project.service'

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly repository: Repository<ProjectUser>,
    private readonly users: UserService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projects: ProjectService
  ) {}

  /**
   * Create a new project member for the given project and user
   */
  public async create(dto: ProjectUserCreateDto): Promise<ProjectUser> {
    const user = await this.users.findById(dto.userId)
    if (!user) throw new NotFoundException("The given userId doesn't match to an existing user.")

    const project = await this.projects.findById(dto.projectId)
    if (!project) throw new NotFoundException("The given projectId doesn't match to an existing project.")

    const assignations = await this.repository.findBy({ userId: user.id })
    for (const assign of assignations) {
      const overlap = Math.max(
        Math.min(dto.endDate.getTime(), assign.endDate.getTime()) -
          Math.max(dto.startDate.getTime(), assign.startDate.getTime()),
        0
      )
      
      if (overlap > 0)
        throw new ConflictException("This user isn't free for the given period.")
    }

    return Promise.resolve({
      ...(await this.repository.save(this.repository.create(dto))),
      project,
      user
    })
  }

  /**
   * Return true if the given user is a member of the given project
   */
  public async findProjectUser(user: User, project: Project): Promise<ProjectUser | null> {
    return this.repository.findOneBy({
      userId: user.id,
      projectId: project.id
    })
  }

  /**
   * Find single ProjectUser by id
   */
  public async findById(id: string): Promise<ProjectUser> {
    return this.repository.findOneBy({ id })
  }

  /**
   * Find all project users
   */
  public async findAll(): Promise<ProjectUser[]> {
    return this.repository.find()
  }

  /**
   * Find all project users with the same user
   */
  public async findByUser(user: User): Promise<ProjectUser[]> {
    return this.repository.findBy({ userId: user.id })
  }
}

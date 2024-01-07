import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectCreateDto } from '../dto/project-create.dto'
import { Project } from '../entity/project.entity'
import { User, UserRole } from '../entity/user.entity'
import { UserService } from '../user/user.service'
import { ProjectUserService } from './project-user/project-user.service'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    private readonly users: UserService,
    private readonly projectUsers: ProjectUserService
  ) {}

  /**
   * Create a new project from the given data.
   */
  public async create(dto: ProjectCreateDto): Promise<Project> {
    return this.repository.save(
      this.repository.create({
        ...dto,
        referringEmployee: await this.users.findById(dto.referringEmployeeId)
      })
    )
  }

  /**
   * Find all projects.
   */
  public async findAll(): Promise<Project[]> {
    return this.repository.find({ relations: ['referringEmployee', 'members'] })
  }

  /**
   * Find projects depending on user
   */
  public async findProjectsDependingOnUser(user: User): Promise<Project[]> {
    const projects = await this.findAll()

    if (user.role === UserRole.EMPLOYEE) {
      return projects.filter(p => p.members.find(pu => pu.userId === user.id))
    }

    return projects
  }

  /**
   * Find project matching to the given UUID, otherwise null.
   */
  public async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({
      relations: ['referringEmployee'],
      where: { id }
    })
  }
}

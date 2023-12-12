import { Controller, UseInterceptors, Post, Body } from '@nestjs/common'
import { TransformInterceptor } from '../../interceptor/transform.interceptor'
import { ProjectUserService } from './project-user.service'
import { ProjectUserCreateDto } from '../../dto/project-user-create.dto'
import { ProjectUser } from '../../entity/project-user.entity'
import { Roles } from '../../decorator/roles.decorator'
import { UserRole } from '../../entity/user.entity'

@UseInterceptors(TransformInterceptor)
@Controller('/project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUsers: ProjectUserService
  ) {}

  @Roles([UserRole.ADMIN, UserRole.PROJECT_MANAGER])
  @Post()
  public async postProjectUser(@Body() dto: ProjectUserCreateDto): Promise<ProjectUser> {
    return this.projectUsers.create(dto)
  }
}
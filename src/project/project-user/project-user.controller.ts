import { Body, Controller, Param, ParseUUIDPipe, Post, UseInterceptors, Get, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common'
import { Roles } from '../../decorator/roles.decorator'
import { ProjectUserCreateDto } from '../../dto/project-user-create.dto'
import { ProjectUser } from '../../entity/project-user.entity'
import { User, UserRole } from '../../entity/user.entity'
import { TransformInterceptor } from '../../interceptor/transform.interceptor'
import { ProjectUserService } from './project-user.service'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from '../../decorator/current-user.decorator'

@ApiBearerAuth('JWT')
@UseInterceptors(TransformInterceptor)
// Transform must be set to true to allow Date conversion
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('/project-users')
export class ProjectUserController {
  constructor(private readonly projectUsers: ProjectUserService) {}

  @Post()
  @Roles([UserRole.ADMIN, UserRole.PROJECT_MANAGER])
  @HttpCode(201)
  public async postProjectUser(@Body() dto: ProjectUserCreateDto): Promise<ProjectUser> {
    return this.projectUsers.create(dto)
  }

  @Get('/:uuid')
  public async getProjectUserById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<ProjectUser> {
    return this.projectUsers.findById(uuid)
  }

  @Get()
  public async getProjectUsers(@CurrentUser() user: User): Promise<ProjectUser[]> {
    if (user.role === UserRole.EMPLOYEE) return this.projectUsers.findByUser(user) 
    return this.projectUsers.findAll()
  }
}

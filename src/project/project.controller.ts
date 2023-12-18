import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CurrentUser } from '../decorator/current-user.decorator'
import { Roles } from '../decorator/roles.decorator'
import { ProjectCreateDto } from '../dto/project-create.dto'
import { Project } from '../entity/project.entity'
import { User, UserRole } from '../entity/user.entity'
import { TransformInterceptor } from '../interceptor/transform.interceptor'
import { UserService } from '../user/user.service'
import { ProjectUserService } from './project-user/project-user.service'
import { ProjectService } from './project.service'
import { instanceToPlain } from 'class-transformer'

@UseInterceptors(TransformInterceptor)
@UsePipes(ValidationPipe)
@Controller('/projects')
export class ProjectController {
  constructor(
    private readonly users: UserService,
    private readonly projects: ProjectService,
    private readonly projectUsers: ProjectUserService
  ) {}

  @Roles([UserRole.ADMIN])
  @Post()
  public async postProject(@Body() dto: ProjectCreateDto): Promise<Project> {
    const employee = await this.users.findById(dto.referringEmployeeId)
    // Project referring employee must be ADMIN or PROJECT_MANAGER
    // to create new projects.
    if (employee.role === UserRole.EMPLOYEE) throw new UnauthorizedException()

    return this.projects.create(dto)
  }

  @Get()
  public async getProjects(@CurrentUser() user: User): Promise<Project[]> {
    return this.projects.findProjectsDependingOnUser(user)
  }

  @UseInterceptors(TransformInterceptor)
  @Get('/:uuid')
  public async getProject(
    @CurrentUser() user: User,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<Project> {
    const project = await this.projects.findById(uuid)
    if (!project) throw new NotFoundException()
    
    console.log(instanceToPlain(project, { enableCircularCheck: true }))

    if (user.role !== UserRole.EMPLOYEE || await this.projectUsers.isMemberOf(user, project)) {
      return project
    }

    throw new ForbiddenException()
  }
}

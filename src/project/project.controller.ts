import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Project } from '../entity/project.entity'
import { AuthGuard } from '../guard/auth.guard'
import { ProjectCreateDto } from '../dto/project-create.dto'
import { ProjectService } from './project.service'
import { Roles } from '../decorator/roles.decorator'
import { UserRole } from '../entity/user.entity'
import { UserService } from '../user/user.service'
import { TransformInterceptor } from '../interceptor/transform.interceptor'

@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
@UsePipes(ValidationPipe)
@Controller('/projects')
export class ProjectController {
  constructor(
    private readonly users: UserService,
    private readonly projects: ProjectService
  ) {}

  @Roles([UserRole.ADMIN])
  @Post()
  public async postProject(@Body() dto: ProjectCreateDto): Promise<Project> {
    const employee = await this.users.findById(dto.referringEmployeeId)
    // Project referring employee must be ADMIN or PROJECT_MANAGER
    if (employee.role === UserRole.EMPLOYEE) throw new UnauthorizedException()

    return this.projects.create(dto)
  }

  @Get()
  public async getProjects(): Promise<Project[]> {
    return this.projects.findAll()
  }

  @Get('/:uuid')
  public async getProject(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<Project> {
    const p = await this.projects.findById(uuid)
    if (!p) throw new NotFoundException()

    return p
  }
}

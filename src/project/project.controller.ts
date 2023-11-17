import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common'
import { Project } from '../entity/project.entity'
import { AuthGuard } from '../guard/auth.guard'
import { ProjectCreateDto } from '../dto/project-create.dto'
import { ProjectService } from './project.service'
import { RoleGuard } from '../guard/role.guard'
import { RequiredRole } from '../decorator/required-role.decorator'
import { UserRole } from '../entity/user.entity'
import { RequestWithUser } from '../types'

@UseGuards(AuthGuard, RoleGuard)
@Controller('/projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @RequiredRole(UserRole.ADMIN)
  public async create(@Body() dto: ProjectCreateDto): Promise<Project> {
    return this.projectService.create(dto)
  }

  @Get()
  public async projects(@Req() req: RequestWithUser): Promise<Project[]> {
    // Cannot be implemented yet
    return null
  }

  @Get('/:uuid')
  public async project(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<Project> {
    // Cannot be implemented yet
    return null
  }
}
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { Project } from '../entity/project.entity'
import { AuthGuard } from '../guard/auth.guard'

@UseGuards(AuthGuard)
@Controller('/projects')
export class ProjectController {

  @Post()
  public async projects(@Body() dto: any): Promise<Project> {
    
    return null
  }
}
import { Module, forwardRef } from '@nestjs/common'
import { Project } from '../entity/project.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { UserModule } from '../user/user.module'
import { ProjectUserModule } from './project-user/project-user.module'

@Module({
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => UserModule),
    forwardRef(() => ProjectUserModule)
  ],
  providers: [ProjectService]
})
export class ProjectModule {}

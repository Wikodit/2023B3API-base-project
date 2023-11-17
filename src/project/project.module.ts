import { Module, forwardRef } from '@nestjs/common'
import { Project } from '../entity/project.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectService } from './project.service'
import { UserModule } from '../user/user.module'
import { ProjectController } from './project.controller'

@Module({
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => UserModule)
  ],
  providers: [ProjectService]
})
export class ProjectModule {}

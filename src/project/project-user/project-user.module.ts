import { Module } from '@nestjs/common'
import { ProjectUserController } from './project-user.controller'
import { ProjectUserService } from './project-user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectUser } from '../../entity/project-user.entity'

@Module({
  controllers: [ProjectUserController],
  exports: [ProjectUserService],
  imports: [
    TypeOrmModule.forFeature([ProjectUser])
  ],
  providers: [ProjectUserService]
})
export class ProjectUserModule {}

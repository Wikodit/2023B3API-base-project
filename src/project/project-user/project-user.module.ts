import { Module, forwardRef } from '@nestjs/common'
import { ProjectUserController } from './project-user.controller'
import { ProjectUserService } from './project-user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectUser } from '../../entity/project-user.entity'
import { ProjectModule } from '../project.module'
import { UserModule } from '../../user/user.module'

@Module({
  controllers: [ProjectUserController],
  exports: [ProjectUserService],
  imports: [
    TypeOrmModule.forFeature([ProjectUser]),
    forwardRef(() => ProjectModule),
    forwardRef(() => UserModule)
  ],
  providers: [ProjectUserService]
})
export class ProjectUserModule {}

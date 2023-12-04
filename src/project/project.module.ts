import { Module, forwardRef } from '@nestjs/common'
import { Project } from '../entity/project.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { AuthModule } from '../user/auth/auth.module'
import { UserModule } from '../user/user.module'

@Module({
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule)
  ],
  providers: [ProjectService]
})
export class ProjectModule {}

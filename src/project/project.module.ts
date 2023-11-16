import { Module } from '@nestjs/common'
import { Project } from '../entity/project.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectService } from './project.service'

@Module({
  controllers: [],
  exports: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project])
  ],
  providers: [ProjectService]
})
export class ProjectModule {}
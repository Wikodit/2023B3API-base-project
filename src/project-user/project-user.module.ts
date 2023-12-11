import { Module, forwardRef } from '@nestjs/common';
import { ProjectsUsersService } from './project-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUsersController } from './project-users.controller';
import { ProjectUser } from './entities/project-user.entity';
import {ProjectsModule} from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
 

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectUser]),
    forwardRef(() => ProjectsModule),
    forwardRef(() => UsersModule), 
  ],
  controllers: [
    ProjectUsersController,

  ],
  providers: [
    ProjectsUsersService,
  ], 
  exports: [ProjectsUsersService],
})
export class ProjectsUsersModule {}

import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from './entities/project.entity';
import { ProjectsUsersModule } from '../project-user/project-user.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => ProjectsUsersModule),
    forwardRef(() => UsersModule),
    AuthModule
  ],
  controllers: [
    ProjectsController,

  ],
  providers: [ProjectsService], // Add UserRepository to providers
  exports: [ProjectsService],
})
export class ProjectsModule {}

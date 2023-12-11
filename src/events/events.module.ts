import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/events.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ProjectsUsersModule } from '../project-user/project-user.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => ProjectsUsersModule),
    forwardRef(()=> UsersModule),
  ],
  controllers: [
    EventsController,
  ],
  providers: [
    EventsService,
  ], 
  exports: [EventsService],
})
export class EventsModule {}
 
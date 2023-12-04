import { Module } from '@nestjs/common';
import { CsvExportService } from './csv-export.service';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectUsersModule } from '../project-user/project-users.module';
import { CsvExportController } from './csv-export.controller';

@Module({
  imports: [EventsModule, UsersModule, ProjectsModule, ProjectUsersModule],
  controllers: [CsvExportController],
  providers: [CsvExportService],
  exports: [CsvExportService],
})
export class CsvExportModule {}

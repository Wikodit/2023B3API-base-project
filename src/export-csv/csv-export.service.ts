import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { createObjectCsvWriter } from 'csv-writer';
import { EventResponseDto } from '../events/dto/event-response.dto';
import { UserResponseDto } from '../users/dto/user-response-dto';

@Injectable()
export class CsvExportService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly projectsService: ProjectsService,
  ) {}
  async exportCsvForCurrentMonth() {
    try {
      const events: EventResponseDto[] =
        await this.eventsService.getAcceptedEventsForCurrentMonth();
      const data = await Promise.all(
        events.map(async (event: EventResponseDto) => {
          const user: UserResponseDto = await this.usersService.findOne(
            event.userId,
          );
          /*
          const project = await this.projectsService.findOne(
            event.,
            user,
          );
           */
          return {
            UserName: user.username,
            ProjectName: event.project.name,
          };
        }),
      );

      const csvWriter = createObjectCsvWriter({
        path: 'conges_acceptes.csv', // Spécifiez le nom du fichier
        header: [
          { id: 'UserName', title: 'User Name' },
          { id: 'ProjectName', title: 'Project Name' },
          // Ajoutez des en-têtes pour d'autres propriétés
        ],
      });

      await csvWriter.writeRecords(data);
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { createObjectCsvWriter } from 'csv-writer';
import { EventResponseDto } from '../events/dto/event-response.dto';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { ProjectUsersService } from '../project-user/project-users.service';
import * as cron from 'node-cron';

@Injectable()
export class CsvExportService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly projectsService: ProjectsService,
    private readonly projectUsersService: ProjectUsersService,
  ) {
    //Génération automatique du fichier csv le 25 de chaque mois
    //Afin de tester cette fonctionnalité, remplacer par '*/1 * * * *'
    //pour générer le fichier toutes les minutes
    cron.schedule('0 0 25 * *', async () => {
      console.log('Running csv export task');
      await this.exportCsvForCurrentMonth();
    });
  }
  async exportCsvForCurrentMonth() {
    try {
      const events: EventResponseDto[] =
        await this.eventsService.getAcceptedEventsForCurrentMonth();
      const data = await Promise.all(
        events.map(async (event: EventResponseDto) => {
          const user: UserResponseDto = await this.usersService.findOne(
            event.userId,
          );
          const projectUser =
            await this.projectUsersService.findOneByDateAndUser(
              new Date(event.date),
              event.userId,
            );
          const project = await this.projectsService.findOne(
            projectUser.projectId,
            user,
          );
          return {
            UserName: user.username,
            ProjectName: project.name,
          };
        }),
      );
      const csvWriter = createObjectCsvWriter({
        path: 'conges_acceptes.csv', // Specify the file name
        header: [
          { id: 'UserName', title: "Nom d'utilisateur" },
          { id: 'ProjectName', title: 'Nom du projet' },
        ],
      });
      await csvWriter.writeRecords(data);
    } catch (error) {
      throw error;
    }
  }
}

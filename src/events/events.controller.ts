import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
  UseGuards,
  Get,
  Param,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '../auth/guard';
import { ProjectsUsersService } from '../project-user/project-user.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventService: EventsService,
    private readonly projectUserService: ProjectsUsersService,
  ) {}
//Créer un Nouvel Event
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createEventDto: CreateEventDto, @Req() req) {
    const userId = req.user.sub;
    return this.eventService.createEvent(userId, createEventDto);
  }
  //Récupère un event en fonction d'un ID
  @Get(':id')
  @UseGuards(AuthGuard)
  getEvent(@Param('id') event: string) {
    return this.eventService.getEvent(event);
  }
  //retoure la liste de tout les events
  @Get()
  @UseGuards(AuthGuard)
  getAll() {
    return this.eventService.getAll();
  }
  //accepter un event
  @UseGuards(AuthGuard)
  @Post('/:id/validate')
  async validateEvent(@Param('id') eventId: string, @Req() req) {
    try {
      if (req.user.role === 'Employee') {
        throw new UnauthorizedException();
      }
      const event = await this.eventService.getEvent(eventId);
      if (
        event.eventStatus === 'Accepted' ||
        event.eventStatus === 'Declined'
      ) {
        throw new ForbiddenException(
          'ne peut pas modifier le statut dun événement validé ou refusé',
        );
      }

      if (req.user.role === 'ProjectManager') {
        const autorized = await this.projectUserService.managerDate(
          req.user.sub,
          event.date,
        );



        if (autorized == null) {
          throw new UnauthorizedException();
        }
        const update = await this.eventService.updateEvent(eventId);
        return update;
      }
      if (req.user.role == 'Admin') {
        const update = await this.eventService.updateEvent(eventId);
        return update;
      }
    } catch (error) {
      throw new UnauthorizedException('Evenement pas trouvé');
    }
  }
  //refuser un event
  @UseGuards(AuthGuard)
  @Post('/:id/decline')
  async declineEvent(@Param('id') eventId: string, @Req() req) {
    try {
      if (req.user.role === 'Employee') {
        throw new UnauthorizedException();
      }
      const event = await this.eventService.getEvent(eventId);
      if (
        event.eventStatus === 'Accepted' ||
        event.eventStatus === 'Declined'
      ) {
        throw new ForbiddenException(
          'Impossible de modifier le statut d un événement validé ou refusé',
        );
      }

      if (req.user.role === 'ProjectManager') {
        const isAuthorized = await this.projectUserService.managerDate(
          req.user.sub,
          event.date,
        );
        if (isAuthorized == null) {
          throw new UnauthorizedException();
        }
        const update = await this.eventService.declineEvent(eventId);
        return update;
      }
      if (req.user.role == 'Admin') {
        const update = await this.eventService.declineEvent(eventId);
        return update;
      }
    } catch (error) {
      throw new UnauthorizedException('Evenement inconnu');
    }
  }
}

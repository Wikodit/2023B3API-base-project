import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Inject,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EventResponseDto } from './dto/event-response.dto';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { EventTypeEnum } from './entities/event.type.enum';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an event' })
  async create(
    @Req() req,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventResponseDto> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      if (!user) {
        throw new NotFoundException('Unidentified User');
      }
      const eventsList: EventResponseDto[] = await this.eventsService.findAll();
      // 401 because of 3 TT in the same week
      const userAllEvents: EventResponseDto[] = eventsList.filter(
        (event: EventResponseDto) => {
          return event.userId === user.id;
        },
      );
      const userRemoteWorkEvents: EventResponseDto[] = userAllEvents.filter(
        (event: EventResponseDto) => {
          return event.eventType === EventTypeEnum.RemoteWork;
        },
      );
      if (userRemoteWorkEvents.length >= 2) {
        throw new UnauthorizedException(
          'User has already 2 days of RemoteWork',
        );
      }
      //401 because of 2 event the same day
      const hasTwoEventOnSameDay = eventsList.some(
        (event: EventResponseDto) => {
          const eventDate = new Date(event.date).toDateString();
          const newEventDate = new Date(createEventDto.date).toDateString();
          return event.userId === user.id && eventDate === newEventDate;
        },
      );
      if (hasTwoEventOnSameDay) {
        throw new UnauthorizedException(
          'User already has an event on the same day',
        );
      }
      const eventCreated: Promise<EventResponseDto> = this.eventsService.create(
        createEventDto,
        user.id,
      );
      return eventCreated;
    } catch (error) {
      throw error;
    }
  }
  @Get()
  @ApiOperation({ summary: 'Find all events' })
  //@ApiResponse({ status: HttpStatus.OK, type: EventResponseDto })
  async findAll(): Promise<EventResponseDto[]> {
    try {
      return this.eventsService.findAll();
    } catch (error) {
      throw error;
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Find a selected event' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    try {
      return this.eventsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }
  /*
  Il est impossible d'altérer le statut d'un projet déjà validé ou refusé
  Les administrateurs peuvent valider n'importe quelle demande
  Il n'est possible de traiter un évènement que si l'utilisateur est
      rattaché à un projet le jour de l'évènement
  Les chefs de projet peuvent valider ou refuser un évènement que si
      l'utilisateur est rattaché à un projet où le chef est référent
      pour la date de l'évènement.
   */
  @Get(':id/validate')
  @ApiOperation({ summary: 'Validation' })
  async validateOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<EventResponseDto> {
    try {
      console.log('Coucou');
      console.log('Coucou');
      console.log('Coucou');
      console.log('Coucou');
      console.log('Coucou');
      console.log('Coucou');
      console.log('Coucou');
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      if (user.role === 'Employee') {
        throw new UnauthorizedException(
          'User is not allowed to see this event',
        );
      }
      const eventToValid = await this.eventsService.acceptOne(id);
      return eventToValid;
    } catch (error) {
      throw error;
    }
  }
  @Get(':id/decline')
  @ApiOperation({ summary: 'Validation' })
  async declineOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<EventResponseDto> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      if (user.role === 'Employee') {
        throw new UnauthorizedException(
          'User is not allowed to see this event',
        );
      }
      const eventToReject = await this.eventsService.rejectOne(id);
      return eventToReject;
    } catch (error) {
      throw error;
    }
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}

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
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EventResponseDto } from './dto/event-response.dto';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { EventTypeEnum } from './entities/types/event.type.enum';
import { UpdateResult } from 'typeorm';
import { ProjectUsersService } from '../project-user/project-users.service';
import { ProjectUser } from '../project-user/entities/project-user.entity';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(ProjectUsersService)
    private readonly projectUsersService: ProjectUsersService,
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
  @Post(':id/validate')
  @ApiOperation({ summary: 'Validation' })
  async validateOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<UpdateResult> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const eventToValid = await this.eventsService.findOne(id);
      if (user.role === 'Employee') {
        throw new UnauthorizedException(
          'User is not allowed to see this event',
        );
      }
      if (
        eventToValid.eventStatus === 'Accepted' ||
        eventToValid.eventStatus === 'Declined'
      ) {
        throw new ForbiddenException('Event already accepted or declined');
      }

      if (user.role === 'ProjectManager') {
        const isSameDate: ProjectUser | void =
          await this.projectUsersService.projectManagerGetDate(
            user.id,
            new Date(eventToValid.date),
          );
        if (isSameDate == null) {
          throw new UnauthorizedException("Manager can't validate this event");
        }
        const updateEvent: UpdateResult = await this.eventsService.acceptEvent(
          eventToValid.id,
        );
        return updateEvent;
      }
      if (user.role === 'Admin') {
        const updateEvent: UpdateResult = await this.eventsService.acceptEvent(
          eventToValid.id,
        );
        return updateEvent;
      }
    } catch (error) {
      throw error;
    }
  }
  @Post(':id/decline')
  @ApiOperation({ summary: 'Validation' })
  async declineOne(@Param('id') id: string, @Req() req): Promise<UpdateResult> {
    try {
      const user: UserResponseDto = await this.usersService.findOne(
        req.user.sub,
      );
      const eventToValid = await this.eventsService.findOne(id);
      if (user.role === 'Employee') {
        throw new UnauthorizedException(
          'User is not allowed to see this event',
        );
      }
      if (
        eventToValid.eventStatus === 'Accepted' ||
        eventToValid.eventStatus === 'Declined'
      ) {
        throw new Error('Event already accepted or declined');
      }
      if (user.role === 'ProjectManager') {
        const isSameDate: ProjectUser | void =
          await this.projectUsersService.projectManagerGetDate(
            user.id,
            new Date(eventToValid.date),
          );
        if (isSameDate == null) {
          throw new UnauthorizedException("Manager can't validate this event");
        }
        const updateEvent: UpdateResult = await this.eventsService.declineEvent(
          eventToValid.id,
        );
        return updateEvent;
      }
      if (user.role === 'Admin') {
        const updateEvent: UpdateResult = await this.eventsService.declineEvent(
          eventToValid.id,
        );
        return updateEvent;
      }
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

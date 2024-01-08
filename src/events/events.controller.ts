import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
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
        (event: EventResponseDto): boolean => {
          return event.userId === user.id;
        },
      );
      const userRemoteWorkEvents: EventResponseDto[] = userAllEvents.filter(
        (event: EventResponseDto): boolean => {
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
      return this.eventsService.create(createEventDto, user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all events' })
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
    const { user, event } = await this.verifyEventAndUser(req.user.sub, id);
    if (user.role === 'ProjectManager') {
      const isSameDate: ProjectUser | void =
        await this.projectUsersService.projectManagerGetDate(
          user.id,
          new Date(event.date),
        );
      if (isSameDate == null) {
        throw new UnauthorizedException("Manager can't validate this event");
      }
    }
    return await this.eventsService.acceptEvent(event.id);
  }

  @Post(':id/decline')
  @ApiOperation({ summary: 'Decline' })
  async declineOne(@Param('id') id: string, @Req() req): Promise<UpdateResult> {
    const { user, event } = await this.verifyEventAndUser(req.user.sub, id);
    if (user.role === 'ProjectManager') {
      const isSameDate: ProjectUser | void =
        await this.projectUsersService.projectManagerGetDate(
          user.id,
          new Date(event.date),
        );
      if (isSameDate == null) {
        throw new UnauthorizedException("Manager can't decline this event");
      }
    }
    return await this.eventsService.declineEvent(event.id);
  }

  private async verifyEventAndUser(
    userId: string,
    eventId: string,
  ): Promise<{ user: UserResponseDto; event: EventResponseDto }> {
    const user: UserResponseDto = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === 'Employee') {
      throw new UnauthorizedException(
        'User is not allowed to perform this action',
      );
    }

    const event: EventResponseDto = await this.eventsService.findOne(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.eventStatus === 'Accepted' || event.eventStatus === 'Declined') {
      throw new ForbiddenException('Event already processed');
    }

    return { user, event };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventStatusEnum } from './entities/types/event.status.enum';
import { UserResponseDto } from '../users/dto/user-response-dto';
import { ProjectUsersService } from '../project-user/project-users.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayOfYear from 'dayjs/plugin/dayOfYear';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,

    @Inject(ProjectUsersService)
    public projectUsersService: ProjectUsersService,

    @Inject(UsersService)
    public usersService: UsersService,

    @Inject(ProjectsService)
    public projectsService: ProjectsService,
  ) {}
  async create(
    createEventDto: CreateEventDto,
    user: string,
  ): Promise<EventResponseDto> {
    const eventCreate: Event = this.eventsRepository.create({
      userId: user,
      ...createEventDto,
    });
    const savedEvent: Event = await this.eventsRepository.save(eventCreate);
    return savedEvent;
  }
  async findAll(): Promise<EventResponseDto[]> {
    try {
      return await this.eventsRepository.find();
    } catch (error) {
      throw error;
    }
  }
  async findOne(id: string): Promise<EventResponseDto> {
    try {
      return await this.eventsRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
  async acceptEvent(eventId: string) {
    const updateEvent = await this.eventsRepository.update(eventId, {
      eventStatus: EventStatusEnum.Accepted,
    });
    return updateEvent;
  }
  async declineEvent(eventId: string) {
    const declineEvent = await this.eventsRepository.update(eventId, {
      eventStatus: EventStatusEnum.Declined,
    });
    return declineEvent;
  }
  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }
  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}

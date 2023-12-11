import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventStatusEnum } from './entities/types/event.status.enum';
import { ProjectUsersService } from '../project-user/project-users.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

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
    return await this.eventsRepository.save(eventCreate);
  }

  async findOne(id: string): Promise<EventResponseDto> {
    return await this.eventsRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<EventResponseDto[]> {
    return await this.eventsRepository.find();
  }

  async acceptEvent(eventId: string): Promise<UpdateResult> {
    return await this.eventsRepository.update(eventId, {
      eventStatus: EventStatusEnum.Accepted,
    });
  }

  async declineEvent(eventId: string): Promise<UpdateResult> {
    return await this.eventsRepository.update(eventId, {
      eventStatus: EventStatusEnum.Declined,
    });
  }

  async getEventsEmployeeInSelectedMonth(
    userId: string,
    firstDay: Date,
    lastDay: Date,
  ): Promise<number> {
    const firstDayOfMonth: string = firstDay.toISOString().slice(0, 10);
    const lastDayOfMonth: string = lastDay.toISOString().slice(0, 10);
    const options: FindManyOptions<Event> = {
      where: {
        userId,
        date: Between(firstDayOfMonth, lastDayOfMonth),
        eventStatus: EventStatusEnum.Accepted,
      },
    };
    return await this.eventsRepository.count(options);
  }

  async getAcceptedEventsForCurrentMonth(): Promise<EventResponseDto[]> {
    const currentDate: Date = new Date();
    const firstDayOfMonth: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDayOfMonth: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const options: FindManyOptions<Event> = {
      where: {
        date: Between(
          firstDayOfMonth.toISOString().slice(0, 10),
          lastDayOfMonth.toISOString().slice(0, 10),
        ),
        eventStatus: EventStatusEnum.Accepted,
      },
    };
    return await this.eventsRepository.find(options);
  }
}

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
  async acceptOne(
    id: string,
    user: UserResponseDto,
  ): Promise<EventResponseDto> {
    try {
      const eventToValid: EventResponseDto =
        await this.eventsRepository.findOne({
          where: { id },
        });
      if (
        eventToValid.eventStatus === 'Accepted' ||
        eventToValid.eventStatus === 'Declined'
      ) {
        throw new Error('Event already accepted or declined');
      } else {
        if (user.role === 'Admin') {
          eventToValid.eventStatus = EventStatusEnum.Accepted;
          await this.eventsRepository.save(eventToValid);
          return eventToValid;
        }
        if (user.role === 'ProjectManager') {
          //TODO
          //Les chefs de projet peuvent valider ou refuser un évènement que si l'utilisateur
          //est rattaché à un projet où le chef est référent pour la date de l'évènement.
        }
      }
    } catch (error) {
      throw error;
    }
  }
  async rejectOne(
    id: string,
    user: UserResponseDto,
  ): Promise<EventResponseDto> {
    try {
      const eventToReject = await this.eventsRepository.findOne({
        where: { id },
      });
      if (
        eventToReject.eventStatus === 'Accepted' ||
        eventToReject.eventStatus === 'Declined'
      ) {
        throw new Error('Event already accepted or declined');
      } else {
        if (user.role === 'Admin') {
          eventToReject.eventStatus = EventStatusEnum.Declined;
          await this.eventsRepository.save(eventToReject);
          return eventToReject;
        }
        if (user.role === 'ProjectManager') {
          // TODO
          //Les chefs de projet peuvent valider ou refuser un évènement que si l'utilisateur
          //est rattaché à un projet où le chef est référent pour la date de l'évènement.
          //employee rataché projet , ou chef de projet date  projet

          const dateEvent = new Date(eventToReject.date);
          const dayEvent = dateEvent;

          //Utilisateur en param
          const userIsRejected = await this.usersService.findOne(
            eventToReject.userId,
          );
          //Tous les projects de l'utilisateur en param
          const getAllProjectsUsersToRefuse =
            await this.projectUsersService.employeeFindAllOwnProjects(
              userIsRejected,
            );

          const getReferentsProjects = await this.projectsService.findAll({
            where: { referringEmployeeId: user.id },
          });
          //J'ai ici toues les projects du manager.
          //Je veux tous les projectsUsers liés à ces projects
          const projects = await this.projectsService.findAllForAdmin();
          const projectsUsers =
            await this.projectUsersService.employeeFindAll(user);
          const ownPro = projectsUsers.filter((projectUser) => {
            return projectUser.userId === user.id;
          });

          console.log('getAllProjectsUsersToRefuse');
          console.log(getAllProjectsUsersToRefuse);
          console.log(getAllProjectsUsersToRefuse);
          console.log('getAllReferentsProjects');
          console.log(getReferentsProjects);
          console.log(getReferentsProjects);
          console.log('dayEvent');
          console.log(dayEvent);
          console.log(dayEvent);

          console.log('ownPro');
          console.log(ownPro);
          console.log(ownPro);
          /*
          const getAllProjectsManager =
            await this.projectUsersService.employeeFindAll(user);
          const dateManagerProject = getAllProjectsManager.map(
            (projectsUser) => ({
              startDate: `${projectsUser.startDate}`,
              endDate: `${projectsUser.endDate}`,
            }),
          );
          console.log('dateManagerProject');
          console.log(dateManagerProject);
          console.log(dateManagerProject);
          console.log('userProjectDate');
          console.log(getAllProjectsManager);
          console.log(getAllProjectsManager);
           */
        }
      }
    } catch (error) {
      throw error;
    }
  }
  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }
  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/events.entity';
import { CreateEventDto } from './dto/create-event.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}
  // création d'un vouvelle event
  async createEvent(
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<Event | null> {
//impossible d'avoir 2 event dans la meme journée
    const options: FindManyOptions<Event> = {
      where: {
        userId: userId,
        date: createEventDto.date,
      },
      relations: ['user'],
    };
    const onEventByDay = await this.eventRepository.findOne(options);

    if (onEventByDay !== null) {
      throw new UnauthorizedException(
        'un event est deja creer a se sjour',
      );
    }
// TT pas plus de 2 fois par semaines
    if (createEventDto.eventType === 'RemoteWork') {
      const date = dayjs(createEventDto.date);

      const dayMonday = date.startOf('week').subtract(1, 'day');
      const monday = dayMonday.toDate();

      const dayFriday = dayMonday.add(6, 'day');
      const friday = dayFriday.toDate();

      const options: FindManyOptions<Event> = {
        where: {
          userId: userId,
          eventType: 'RemoteWork',
          date: Between(monday, friday),
        },
      };
      const nbTTSemaine =
        await this.eventRepository.count(options);
      if (nbTTSemaine >= 2) {
        throw new UnauthorizedException(
          'vous avez deja 2 jour de tt cet semaine',
        );
      }
    }
    if (createEventDto.eventType === 'RemoteWork') {
      createEventDto.eventStatus = 'Accepted';
    }
 if (createEventDto.eventType === 'PaidLeave') {
      createEventDto.eventStatus = 'Pending';
    }
    const newEvent = this.eventRepository.create({
      ...createEventDto,
      userId: userId,
    });
    const event = await this.eventRepository.save(newEvent);
    return event;
  }
  async getEvent(id: string) {
    const options: FindManyOptions<Event> = {
      where: { id: id },
    };
    const event = await this.eventRepository.findOne(options);
    if (event == null) {
      throw new NotFoundException();
    }
    return event;
  }
  async getAll() {
    const event = await this.eventRepository.find();
    if (event == null) {
      throw new NotFoundException();
    }
    return event;
  }

  // recherche si l'utilisateur est assigné à un projet le jour de l'evenement

  async updateEvent(eventId: string) {
    const update = await this.eventRepository.update(eventId, {
      eventStatus: 'Accepted',
    });
    return update;
  }

  async declineEvent(eventId: string) {
    const update = await this.eventRepository.update(eventId, {
      eventStatus: 'Declined',
    });
    return update;
  }
  //recupere les absence des employee par leur id et le mois 
  async getAbsenceEmployee(userId: string, month: number) {
    const firstDayMouth = dayjs()
      .month(month - 1)
      .startOf('month');
    const dayJslastDayOfMonth = dayjs()
      .month(month - 1)
      .endOf('month');

    const lastDayMonth = dayJslastDayOfMonth.toDate();
    console.log('la date est ' + JSON.stringify(lastDayMonth));
    const firstDayOfMonth = firstDayMouth.toDate();
    const options: FindManyOptions<Event> = {
      where: {
        userId: userId,
        date: Between(firstDayOfMonth, lastDayMonth),
        eventStatus: 'Accepted',
      },
    };
    try {
      const event = await this.eventRepository.count(options);
      return event;
    } catch {
      return 0;
    }
  }
}

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Between, In, Repository } from 'typeorm';
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

  async createEvent(userId: string, createEventDto: CreateEventDto): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({
      where: { userId, date: createEventDto.date },
      relations: ['user'],
    });
    if (existingEvent) {
      throw new UnauthorizedException('Un événement est déjà créé à ce jour.');
    }

    if (createEventDto.eventType === 'RemoteWork') {
      const weekRange = this.getWeekRange(createEventDto.date);
      const count = await this.eventRepository.count({
        where: {
          userId,
          eventType: 'RemoteWork',
          date: Between(weekRange.start, weekRange.end),
        },
      });
      if (count >= 2) {
        throw new UnauthorizedException('Vous avez déjà 2 jours de télétravail cette semaine.');
      }
    }

    createEventDto.eventStatus = createEventDto.eventType === 'RemoteWork' ? 'Accepted' : 'Pending';
    const newEvent = this.eventRepository.create({ ...createEventDto, userId });
    return await this.eventRepository.save(newEvent);
  }

  async getEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  async getAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async updateEvent(eventId: string): Promise<void> {
    await this.eventRepository.update(eventId, { eventStatus: 'Accepted' });
  }

  async declineEvent(eventId: string): Promise<void> {
    await this.eventRepository.update(eventId, { eventStatus: 'Declined' });
  }

  async getAbsenceEmployee(userId: string, month: number): Promise<number> {
    const monthRange = this.getMonthRange(month);
    return await this.eventRepository.count({
      where: {
        userId,
        date: Between(monthRange.start, monthRange.end),
        eventStatus: 'Accepted',
      },
    });
  }

  private getWeekRange(date: Date) {
    const startOfWeek = dayjs(date).startOf('week').subtract(1, 'day').toDate();
    const endOfWeek = dayjs(startOfWeek).add(6, 'day').toDate();
    return { start: startOfWeek, end: endOfWeek };
  }

  private getMonthRange(month: number) {
    const startOfMonth = dayjs().month(month - 1).startOf('month').toDate();
    const endOfMonth = dayjs().month(month - 1).endOf('month').toDate();
    return { start: startOfMonth, end: endOfMonth };
  }
  async calculateMealVouchers(userId: string, month: number): Promise<number> {
    const monthRange = this.getMonthRange(month);
    const businessDays = this.getBusinessDaysInMonth(month);

    // Récupérer tous les jours de télétravail ou de congés payés dans le mois
    const nonEligibleDays = await this.eventRepository.find({
      where: {
        userId,
        date: Between(monthRange.start, monthRange.end),
        // Utilisez une assertion de type pour s'aligner avec le type attendu par TypeORM
        eventType: In(['RemoteWork', 'PaidLeave'] as ('RemoteWork' | 'PaidLeave')[]),
        eventStatus: 'Accepted'
      },
    });

    // Soustraire les jours non éligibles des jours ouvrables
    const eligibleDays = businessDays - nonEligibleDays.length;

    // Calculer le montant des titres-restaurant (8 euros par jour éligible)
    return eligibleDays * 8;
  }
  private getBusinessDaysInMonth(month: number): number {
    const startOfMonth = dayjs().month(month - 1).startOf('month');
    const endOfMonth = dayjs().month(month - 1).endOf('month');
    let businessDays = 0;

    for (let day = startOfMonth; day.isBefore(endOfMonth); day = day.add(1, 'day')) {
      // 0 pour Dimanche, 6 pour Samedi
      if (day.day() !== 0 && day.day() !== 6) {
        businessDays++;
      }
    }

    return businessDays;
  }
  
}

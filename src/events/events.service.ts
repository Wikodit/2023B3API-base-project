import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventStatusEnum } from './entities/event.status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}
  async create(
    createEventDto: CreateEventDto,
    user: string,
  ): Promise<EventResponseDto> {
    const eventCreate: Event = this.eventsRepository.create({
      id: createEventDto.id,
      userId: user,
      eventType: createEventDto.eventType,
      eventDescription: createEventDto.eventDescription,
      date: createEventDto.date,
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
  async acceptOne(id: string) {
    try {
      const eventToValid = await this.eventsRepository.findOne({
        where: { id },
      });
      if (
        eventToValid.eventStatus === 'Accepted' ||
        eventToValid.eventStatus === 'Declined'
      ) {
        throw new Error('Event already accepted or declined');
      } else {
        eventToValid.eventStatus = EventStatusEnum.Declined;
        console.log('eventToValid');
        console.log(eventToValid);
        console.log(eventToValid);
        console.log(eventToValid);
        console.log(eventToValid);
        await this.eventsRepository.save(eventToValid);
      }
      return eventToValid;
    } catch (error) {
      throw error;
    }
  }
  async rejectOne(id: string) {
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
        eventToReject.eventStatus = EventStatusEnum.Declined;
        await this.eventsRepository.save(eventToReject);
      }
      return eventToReject;
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

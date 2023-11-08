import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

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
    console.log('USER');
    console.log(user);
    console.log(eventCreate.userId);
    console.log('EVENT CREATED  ');
    console.log(eventCreate);
    const savedEvent: Event = await this.eventsRepository.save(eventCreate);
    console.log('SAVED EVENT  ');
    console.log(savedEvent);
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

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}

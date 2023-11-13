import { EventStatusEnum } from '../entities/types/event.status.enum';
import { EventTypeEnum } from '../entities/types/event.type.enum';

export class EventResponseDto {
  id!: string;
  date!: string;
  eventStatus?: EventStatusEnum;
  eventType!: EventTypeEnum;
  eventDescription?: string;
  userId!: string;
  constructor(
    id: string,
    date: string,
    eventStatus: EventStatusEnum,
    eventType: EventTypeEnum,
    eventDescription: string,
    userId: string,
  ) {
    this.id = id;
    this.date = date;
    this.eventStatus = eventStatus;
    this.eventType = eventType;
    this.eventDescription = eventDescription;
    this.userId = userId;
  }
}

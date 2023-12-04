import { EventStatusEnum } from '../entities/types/event.status.enum';
import { EventTypeEnum } from '../entities/types/event.type.enum';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class EventResponseDto {
  id!: string;

  @IsDateString()
  date!: string;

  @IsEnum(EventStatusEnum)
  eventStatus?: EventStatusEnum;

  @IsEnum(EventTypeEnum)
  eventType!: EventTypeEnum;

  @IsString()
  @IsOptional()
  eventDescription?: string;

  userId: string;
}

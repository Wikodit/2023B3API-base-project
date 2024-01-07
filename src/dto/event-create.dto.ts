import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { EventType } from '../entity/event.entity'

export class EventCreateDto {
  @Type(() => Date)
  @IsDate()
  date: Date

  @IsString()
  @IsNotEmpty()
  @IsEnum(EventType)
  eventType: EventType

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  eventDescription?: string
}

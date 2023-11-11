import { IsNotEmpty, IsOptional } from 'class-validator';
import { Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatusEnum } from '../entities/event.status.enum';
import { EventTypeEnum } from '../entities/event.type.enum';
@Entity()
export class CreateEventDto {
  //@IsNotEmpty()
  public id!: string;
  @IsNotEmpty({ message: "Date can't be blank" })
  @ApiProperty({ example: '04/08/23', description: 'Event date' })
  public date!: string;

  @ApiProperty({
    enum: EventStatusEnum,
    enumName: 'EventStatusEnum',
    example: 'Pending',
    description: 'Event status enum',
  })
  public eventStatus?: EventStatusEnum;
  @ApiProperty({
    enum: EventTypeEnum,
    enumName: 'EventTypeEnum',
    example: 'Declined',
    description: 'Event type enum',
  })
  public eventType!: EventTypeEnum;
  @ApiProperty({
    example: "This is an event' description",
    description: 'Event Description',
  })
  public eventDescription?: string;
  @IsNotEmpty({ message: "User can't be blank" })
  public userId!: string;
}

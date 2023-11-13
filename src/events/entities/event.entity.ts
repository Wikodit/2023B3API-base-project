import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EventTypeEnum } from './types/event.type.enum';
import { EventStatusEnum } from './types/event.status.enum';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column()
  public date!: string;
  @Column({
    type: 'enum',
    enum: EventStatusEnum,
    default: EventStatusEnum.Pending,
  })
  public eventStatus?: EventStatusEnum;
  @Column({
    type: 'enum',
    enum: EventTypeEnum,
  })
  public eventType!: EventTypeEnum;
  @Column()
  public eventDescription?: string;
  @Column()
  public userId!: string;
}

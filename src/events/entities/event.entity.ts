import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventTypeEnum } from './types/event.type.enum';
import { EventStatusEnum } from './types/event.status.enum';
import { User } from '../../users/entities/user.entity';

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
  userId!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}

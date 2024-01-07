import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum EventStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined'
}

export enum EventType {
   RemoteWork = 'RemoteWork',
   PaidLeave = 'PaidLeave'
}

@Entity({ name: 'entities' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column()
  date!: Date

  @Column({ default: EventStatus.Pending, enum: EventStatus })
  eventStatus?: EventStatus

  @Column({ enum: EventType })
  eventType!: EventType
  
  @Column({ default: null, nullable: true })
  eventDescription?: string
  
  @Column()
  userId!: string
}
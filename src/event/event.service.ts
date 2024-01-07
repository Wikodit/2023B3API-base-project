import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as dayjs from 'dayjs'
import { Repository } from 'typeorm'
import { EventCreateDto } from '../dto/event-create.dto'
import { Event as EventEntity, EventStatus, EventType } from '../entity/event.entity'
import { User } from '../entity/user.entity'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>
  ) {}

  // Unoptimized
  /**
   * Create new event.
   */
  public async create(dto: EventCreateDto, user: User): Promise<EventEntity> {
    const events = await this.findByUser(user)

    if (
      events.filter(e => dayjs(e.date).isSame(dto.date, 'week') && e.eventType === EventType.RemoteWork)
        .length >= 2
    )
      throw new UnauthorizedException("You can't have more than 2 days of remote work per week.")
    if (events.filter(e => dayjs(e.date).isSame(dto.date, 'days')).length > 0)
      throw new UnauthorizedException("You can't have more than 1 event per day.")

    return this.repository.save(
      this.repository.create({
        ...dto,
        userId: user.id,
        eventStatus: dto.eventType === EventType.RemoteWork ? EventStatus.Accepted : EventStatus.Pending
      })
    )
  }

  /**
   * Find all registered events.
   */
  public async findAll(): Promise<EventEntity[]> {
    return this.repository.find()
  }

  /**
   * Find all events created the same day.
   */
  public async findByDay(date: Date): Promise<EventEntity | null> {
    return this.repository.findOneBy({ date })
  }

  /**
   * Find all events registered for a specific user.
   */
  public async findByUser(user: User, type?: EventType): Promise<EventEntity[]> {
    return this.repository.findBy({ userId: user.id, eventType: type })
  }

  /**
   * Get the event matching to the given id otherwise return null.
   */
  public async findById(id: string): Promise<EventEntity | null> {
    return this.repository.findOneBy({ id })
  }

  public async tryUpdateStatus(uuid: string, status: EventStatus): Promise<EventEntity> {
    const event = await this.findById(uuid)
    if (!event) throw new NotFoundException('There is no event matching to the given uuid.')
    event.eventStatus = status
  
    return this.repository.save(event)
  }

  public static isSameDateDay(a: Date, b: Date): boolean {
    return a.getDay() === b.getDay() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
  }
}

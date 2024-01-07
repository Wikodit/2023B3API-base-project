import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { TransformInterceptor } from '../interceptor/transform.interceptor'
import { EventService } from './event.service'
import { Event as EventEntity, EventStatus } from '../entity/event.entity'
import { EventCreateDto } from '../dto/event-create.dto'
import { CurrentUser } from '../decorator/current-user.decorator'
import { User, UserRole } from '../entity/user.entity'
import { Roles } from '../decorator/roles.decorator'

@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(TransformInterceptor)
@Controller('/events')
export class EventController {
  constructor(private readonly events: EventService) {}

  @Post()
  public async post(@Body() dto: EventCreateDto, @CurrentUser() user: User): Promise<EventEntity> {
    return this.events.create(dto, user)
  }

  @Get()
  public async get(): Promise<EventEntity[]> {
    return this.events.findAll()
  }

  @Get('/:uuid')
  public async getById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<EventEntity> {
    const event = await this.events.findById(uuid)
    if (!event) throw new NotFoundException()

    return event
  }

  @Roles([UserRole.ADMIN, UserRole.PROJECT_MANAGER])
  @HttpCode(200)
  @Get('/:uuid/validate')
  public async validate(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<EventEntity> {
    return this.events.tryUpdateStatus(uuid, EventStatus.Accepted)
  }

  @Roles([UserRole.ADMIN, UserRole.PROJECT_MANAGER])
  @HttpCode(200)
  @Get('/:uuid/decline')
  public async decline(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<EventEntity> {
    return this.events.tryUpdateStatus(uuid, EventStatus.Accepted)
  }
}

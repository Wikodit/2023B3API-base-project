import { Module } from '@nestjs/common'
import { EventController } from './event.controller'
import { EventService } from './event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event as EventEntity } from '../entity/event.entity'

@Module({
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
  imports: [TypeOrmModule.forFeature([EventEntity])]
})
export class EventModule {}

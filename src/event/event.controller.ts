import { Controller, Get, Param } from '@nestjs/common';
import { EventService } from './event.service';
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/')
  getList() {
    return this.eventService.findAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.eventService.findById(id);
  }
}

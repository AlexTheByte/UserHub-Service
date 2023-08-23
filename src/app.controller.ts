import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events/events.service';
import { EventPattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

@Controller({ version: '1' })
export class AppController {
  constructor(private eventsService: EventsService) {}
  @Get('test')
  test() {
    this.eventsService.emitEvent('example.event', { test: 'test' });
    return { message: 'Event triggered' };
  }

  @EventPattern('example.event')
  async handleEvent(data: any) {
    console.log('Received event data:', data);
  }
}

import { Controller, Get } from '@nestjs/common';
import { CustomLoggerService } from './logger/logger.service';

@Controller({ version: '1' })
export class AppController {
  constructor(private readonly loggerService: CustomLoggerService) {}

  @Get()
  test() {
    this.loggerService.debug('test');
  }
}

import { Controller, Get } from '@nestjs/common';
import { CustomLoggerService } from './logger/logger.service';

@Controller({ version: '1' })
export class AppController {
  constructor(private readonly loggerService: CustomLoggerService) {
    loggerService.init(AppController.name);
  }

  @Get()
  test() {
    this.loggerService.debug('test');
  }
}

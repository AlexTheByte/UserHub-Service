import { Controller, Get } from '@nestjs/common';
// import { CustomLoggerService } from './logger/logger.service';
import { LoggerModule, CustomLoggerService } from '@travel-1/travel-sdk';

@Controller({ version: '1' })
export class AppController {
  constructor(private readonly loggerService: CustomLoggerService) {}

  @Get()
  test() {
    this.loggerService.info('test');
  }
}

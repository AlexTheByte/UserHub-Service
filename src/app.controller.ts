import { Controller, Get, Inject } from '@nestjs/common';
import CustomLoggerService from './logger.service';
// import { Queue } from 'bull';
// import { InjectQueue } from '@nestjs/bull';
// import { UserJobType } from 'src/enums/users-jobs-type.enums';
// import { TravelJobQueue } from './enums/travel-jobs-queue.enums';
// import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller({ version: '1' })
export class AppController {
  logger: CustomLoggerService;

  constructor() {
    this.logger = new CustomLoggerService(AppController.name);
  }

  @Get('test')
  test() {
    // this.usersJobsQueue.add(UserJobType.Creation, { test: 'test' });
    // this.client.emit('User:Created', { data: 'some data' });
    return { message: 'Job Sent' };
  }
}

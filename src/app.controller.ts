import { Controller, Get } from '@nestjs/common';
import CustomLoggerService from './logger.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UsersJobsType } from 'src/enums/users-jobs-type.enums';
import { TravelQueue } from './enums/travel-queue.enums';

@Controller({ version: '1' })
export class AppController {
  logger: CustomLoggerService;

  constructor(@InjectQueue(TravelQueue.Users) private readonly usersJobsQueue: Queue) {
    this.logger = new CustomLoggerService(AppController.name);
    this.usersJobsQueue.add(UsersJobsType.Creation, { test: 'test' });
  }

  @Get('test')
  test() {
    this.usersJobsQueue.add({ test: 'test' });
    return { message: 'Job Sent' };
  }
}

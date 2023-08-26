import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import CustomLoggerService from '../logger.service';
import { UsersJobsType } from 'src/enums/users-jobs-type.enums';
import { TravelJobQueue } from 'src/enums/travel-jobs-queue.enums';
import { UsersService } from './users.service';

@Processor(TravelJobQueue.Users)
export class UsersJobsConsumer {
  private readonly logger = new CustomLoggerService(UsersJobsConsumer.name);

  constructor(private readonly usersService: UsersService) {}

  @Process(UsersJobsType.Creation)
  async creation(job: Job) {
    this.usersService.create(job.data);

    this.logger.info(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);
  }

  @Process(UsersJobsType.Update)
  async update(job: Job) {
    // User update
    // const test = await this.usersService.findAll();

    this.logger.info(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);
  }
}

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import CustomLoggerService from '../logger.service';
import { UsersJobsType } from 'src/enums/users-jobs-type.enums';
import { TravelQueue } from 'src/enums/travel-queue.enums';
import { UsersService } from './users.service';

@Processor(TravelQueue.Users)
export class UsersJobsConsumer {
  private readonly logger = new CustomLoggerService(UsersJobsConsumer.name);

  constructor(private readonly usersService: UsersService) {}

  @Process(UsersJobsType.Creation)
  async creation(job: Job) {
    // User creation
    // const test = await this.usersService.findAll();

    this.logger.info(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);
  }

  @Process(UsersJobsType.Update)
  async update(job: Job) {
    // User update
    // const test = await this.usersService.findAll();

    this.logger.info(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);
  }
}

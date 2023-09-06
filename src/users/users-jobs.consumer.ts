import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { ICreateUser } from './interfaces/create-user.interface';
import * as _ from 'lodash';
import { Inject } from '@nestjs/common';
import { ICreateAuth } from 'src/auth/interfaces/create-auth.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomLoggerService } from 'src/logger/logger.service';
import { JobTypeUser } from '@travel-1/travel-sdk';
import { JobTravel } from '@travel-1/travel-sdk';
import { EventTravel } from '@travel-1/travel-sdk';
import { EventTypeUser } from '@travel-1/travel-sdk';

@Processor(JobTravel.User)
export class UsersJobsConsumer {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    @Inject('REDIS_EVENT_CLIENT') private readonly eventClient: ClientProxy,
    private readonly loggerService: CustomLoggerService,
  ) {}

  @Process(JobTypeUser.Create)
  async creation(job: Job<CreateUserDto>) {
    this.loggerService.debug(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);

    const userInfo: ICreateUser = _.pick(job.data, ['firstName', 'lastName']);
    const authInfo: ICreateAuth = _.pick(job.data, ['email', 'password']);

    try {
      const user = await this.usersService.create(userInfo);
      await this.authService.create(user, authInfo);

      this.eventClient.emit(`${EventTravel.User}:${EventTypeUser.Create}`, user);
    } catch (e) {
      this.loggerService.error(e.message);
      throw e;
    }
  }

  @Process(JobTypeUser.Update)
  async update(job: Job) {
    this.loggerService.info(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);
  }
}

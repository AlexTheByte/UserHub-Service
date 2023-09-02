import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { UserJobType } from 'src/enums/user-job-type.enums';
import { TravelJobQueue } from 'src/enums/travel-job-queue.enums';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { ICreateUser } from './interfaces/create-user.interface';
import * as _ from 'lodash';
import { Inject } from '@nestjs/common';
import { TravelEvent } from 'src/enums/travel-event.enums';
import { UserEventType } from 'src/enums/user-event-type.enums';
import { ICreateAuth } from 'src/auth/interfaces/create-auth.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomLoggerService } from 'src/logger/logger.service';

@Processor(TravelJobQueue.User)
export class UsersJobsConsumer {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    @Inject('REDIS_QUEUE_CLIENT') private readonly client: ClientProxy,
    private readonly loggerService: CustomLoggerService,
  ) {
    // loggerService.init(UsersJobsConsumer.name);
  }

  @Process(UserJobType.Create)
  async creation(job: Job<CreateUserDto>) {
    this.loggerService.debug(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);

    const userInfo: ICreateUser = _.pick(job.data, ['firstName', 'lastName']);
    const authInfo: ICreateAuth = _.pick(job.data, ['email', 'password']);

    try {
      const user = await this.usersService.create(userInfo);
      await this.authService.create(user, authInfo);

      this.client.emit(`${TravelEvent.User}:${UserEventType.Create}`, user);
    } catch (e) {
      this.loggerService.error(e.message);
      throw e;
    }
  }

  @Process(UserJobType.Update)
  async update(job: Job) {
    this.loggerService.info(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);
  }
}

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import CustomLoggerService from '../logger.service';
import { UserJobType } from 'src/enums/user-job-type.enums';
import { TravelJobQueue } from 'src/enums/travel-job-queue.enums';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from 'src/config/redis.configuration';
import { ICreateUser } from './interfaces/create-user.interface';
import { ICreateAuth } from 'src/auth/interfaces/create-auth.interface';
import * as _ from 'lodash';
import { TravelEvent } from 'src/enums/travel-event.enums';
import { UserEventType } from 'src/enums/user-event-type.enums';

@Processor(TravelJobQueue.User)
export class UsersJobsConsumer {
  private readonly logger = new CustomLoggerService(UsersJobsConsumer.name);

  client: ClientProxy;

  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService, private readonly authService: AuthService) {
    const redisConfig = this.configService.get<IRedisConfig>('redis');

    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: { ...redisConfig },
    });
  }

  @Process(UserJobType.Create)
  async creation(job: Job<CreateUserDto>) {
    this.logger.debug(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);

    const userInfo: ICreateUser = _.pick(job.data, ['firstName', 'lastName']);
    const authInfo: ICreateAuth = _.pick(job.data, ['email', 'password']);

    try {
      const user = await this.usersService.create(userInfo);
      await this.authService.create(user, authInfo);

      this.client.emit(`${TravelEvent.User}:${UserEventType.Create}`, user);
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  @Process(UserJobType.Update)
  async update(job: Job) {
    this.logger.info(`Processing job #${job.id} with data ${JSON.stringify(job.data)}`);
  }
}

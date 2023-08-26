import CustomLoggerService from '../logger.service';
import { EventPattern } from '@nestjs/microservices';

export class UsersEventsConsumer {
  private readonly logger = new CustomLoggerService(UsersEventsConsumer.name);

  // @EventPattern('User:Created')
  // async handleUserCreated(data: any) {
  //   this.logger.info(`Event data received : ${JSON.stringify(data)}`);
  // }
}

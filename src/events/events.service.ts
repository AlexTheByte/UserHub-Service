import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class EventsService {
  private eventClient: ClientProxy;

  constructor() {
    this.eventClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: +process.env.REDIS_PORT,
      },
    });
  }

  emitEvent(eventName: string, data: any) {
    this.eventClient.emit(eventName, data);
  }
}

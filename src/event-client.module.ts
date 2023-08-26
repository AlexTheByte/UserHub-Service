// clients.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const REDIS_MICROSERVICE = 'REDIS_MICROSERVICE';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: REDIS_MICROSERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        },
      },
    ]),
  ],
  exports: [REDIS_MICROSERVICE],
})
export class EventClientModule {}

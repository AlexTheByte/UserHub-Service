import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersJobsConsumer } from 'src/users/users-jobs.consumer';
import { BullModule } from '@nestjs/bull';
import { TravelJobQueue } from 'src/enums/travel-job-queue.enums';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from 'src/config/redis.configuration';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: TravelJobQueue.User,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'REDIS_QUEUE_CLIENT',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.REDIS,
            options: { ...configService.get<IRedisConfig>('redis') },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    AuthModule,
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersJobsConsumer],
  exports: [],
})
export class UsersModule {}

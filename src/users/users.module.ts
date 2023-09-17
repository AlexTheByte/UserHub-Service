import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersJobsConsumer } from 'src/users/users-jobs.consumer';
import { BullModule } from '@nestjs/bull';
import { JobTravel } from '@travel-1/travel-sdk';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IRedisConfig } from 'src/config/redis.configuration';
import { LoggerModule } from '@travel-1/travel-sdk';
import { AvatarsModule } from 'src/avatars/avatars.module';
import { UserRpcConsumer } from './users-rpc.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: JobTravel.User,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'REDIS_EVENT_CLIENT',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.REDIS,
            options: { ...configService.get<IRedisConfig>('redis') },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    AvatarsModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [UsersController, UserRpcConsumer],
  providers: [UsersService, UsersJobsConsumer],
  exports: [],
})
export class UsersModule {}

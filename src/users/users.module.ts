import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
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
    ClientsModule.registerAsync({
      // TODO : Voir comment mettre ça sous AppModule.ts puis faire l'envoi de mail pour l'update de password.
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
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}

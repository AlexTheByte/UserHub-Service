import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { validationSchema } from './config/validation-schema.configuration';
import { User } from './users/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { DbConfiguration, IDBConfig } from './config/db.configuration';
import { RedisConfiguration, IRedisConfig } from './config/redis.configuration';
import { ThrottleConfiguration, IThrottleConfig } from './config/throttle.configuration';
import { EncryptionConfiguration } from './config/encryption.configuration';
import { JwtConfiguration } from './config/jwt.configuration';
import { AvatarsModule } from './avatars/avatars.module';
import { FilerModule } from '@travel-1/travel-sdk';
import { LoggerModule } from '@travel-1/travel-sdk';
import { HostRpcConfiguration } from './config/host-rpc.configuration';
import { RpcReferencesConfiguration } from './config/rpc-references.configuration';
import { ReferencesModule } from './references/references.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [
        DbConfiguration,
        RedisConfiguration,
        ThrottleConfiguration,
        EncryptionConfiguration,
        JwtConfiguration,
        HostRpcConfiguration,
        RpcReferencesConfiguration,
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get<IDBConfig>('db'),
          type: 'mariadb',
          entities: [User, Auth],
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          ...configService.get<IRedisConfig>('redis'),
        },
        defaultJobOptions: {
          attempts: 10,
          removeOnFail: false,
          backoff: {
            type: 'fixed', // fixed or exponential
            delay: 1000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<IThrottleConfig>('throttle'),
      }),
      inject: [ConfigService],
    }),
    AvatarsModule,
    FilerModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    ReferencesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ConfigService,
  ],
})
export class AppModule {}

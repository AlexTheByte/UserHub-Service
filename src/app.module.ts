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
import dbConfiguration, { IDBConfig } from './config/db.configuration';
import redisConfiguration, { IRedisConfig } from './config/redis.configuration';
import throttleConfiguration, { IThrottleConfig } from './config/throttle.configuration';
import encryptionConfiguration from './config/encryption.configuration';
import jwtConfiguration from './config/jwt.configuration';
import { User } from './users/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';

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
        dbConfiguration,
        redisConfiguration,
        throttleConfiguration,
        encryptionConfiguration,
        jwtConfiguration,
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
          attempts: 10, // Nombre de réessayages max
          removeOnFail: false,
          backoff: {
            type: 'fixed', // Type de backoff (exponentiel dans cet exemple)
            delay: 1000, // Délai initial entre les réessayages en millisecondes
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
    AuthModule,
    UsersModule,
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

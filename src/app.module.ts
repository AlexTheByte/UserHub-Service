import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bull';
import { Auth } from './auth/entities/auth.entity';
import redisConfiguration, { IRedisConfig } from './config/redis.configuration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import dbConfiguration, { IDBConfig } from './config/db.configuration';
import { validationSchema } from './config/validation-schema.configuration';
import throttleConfiguration, { IThrottleConfig } from './config/throttle.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [dbConfiguration, redisConfiguration, throttleConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<IDBConfig>('db'),
        type: 'mariadb',
        entities: [User, Auth],
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: { ...configService.get<IRedisConfig>('redis') },
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

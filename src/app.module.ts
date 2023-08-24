import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bull';
import { Auth } from './auth/entities/auth.entity';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'staging', 'preprod', 'prod').exist(),
        DB_HOST: Joi.string().exist(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string().exist(),
        DB_PASSWORD: Joi.string().exist(),
        DB_NAME: Joi.string().exist(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Auth],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: 'users',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

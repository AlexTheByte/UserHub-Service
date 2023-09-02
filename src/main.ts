import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { IRedisConfig } from './config/redis.configuration';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';

function configVersioning(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
  });
}

function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Travel Users service')
    .setDescription('Travel Users service')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

function configMicroservices(app: INestApplication) {
  const redisConfig = app.get(ConfigService).get<IRedisConfig>('redis');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: { ...redisConfig },
  });

  app.startAllMicroservices();
}

function configHelmet(app: INestApplication) {
  app.use(helmet());
}

function configPublicAvatarDirectory(app) {
  app.use('/avatars', express.static(join(__dirname, '../storage/avatars', '')));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  configHelmet(app);
  configVersioning(app);
  configMicroservices(app);
  configSwagger(app);
  configPublicAvatarDirectory(app);

  await app.listen(3000);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

function configVersioning(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
  });
}

function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('Travel Users service').setDescription('Travel Users service').setVersion('0.1').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

function configMicroservices(app: INestApplication) {
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  });

  app.startAllMicroservices();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configVersioning(app);
  configMicroservices(app);
  configSwagger(app);

  await app.listen(3000);
}

bootstrap();

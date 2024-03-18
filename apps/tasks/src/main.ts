import { NestFactory } from '@nestjs/core';
import { TaskModule } from './task.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readPackageVersion } from '@app/common/utilities';

async function bootstrap() {
  const app = await NestFactory.create(TaskModule);
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('TASKS Service')
    .setDescription('The Tasks service API description')
    .setVersion(readPackageVersion())
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger/docs', app, document); // Setup Swagger at /api/docs path

  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  console.log('TASK SERVICE TCP PORT: ', configService.get('TCP_PORT'));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap().then(() =>
  console.log('The TASK service is bootstrapped and running'),
);

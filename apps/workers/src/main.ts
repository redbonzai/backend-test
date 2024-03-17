import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WorkersModule } from './workers.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(WorkersModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap().then(() =>
  console.log('The WORKERS service is bootstrapped and running'),
);

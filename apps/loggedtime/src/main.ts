import { NestFactory } from '@nestjs/core';
import { LoggedTimeModule } from './logged-time.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(LoggedTimeModule);
  app.setGlobalPrefix('api');
  const config = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: config.get('TCP_PORT'),
    },
  });
  console.log('LOGGED TIME SERVICE TCP PORT: ', config.get('TCP_PORT'));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(config.get('PORT'));
}
bootstrap().then(() =>
  console.log('The LOGGED TIME service is bootstrapped and running'),
);

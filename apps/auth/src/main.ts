import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readPackageVersion } from '@app/common/utilities';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('The Auth Service API Description')
    .setVersion(readPackageVersion())
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger/docs', app, document); // Setup Swagger at /api/docs path

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  console.log('AUTH SERVICE TCP PORT: ', configService.get('TCP_PORT'));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}

bootstrap().then(() => console.log('Auth service is bootstrapped amd running'));

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WorkersModule } from './workers.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readPackageVersion } from '@app/common/utilities';

async function bootstrap() {
  const app = await NestFactory.create(WorkersModule);
  app.setGlobalPrefix('api');

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Workers Service')
    .setDescription('The Workers Service API Description')
    .setVersion(readPackageVersion())
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger/docs', app, document); // Setup Swagger at /api/docs path

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap().then(() =>
  console.log('The WORKERS service is bootstrapped and running'),
);

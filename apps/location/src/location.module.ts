import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { DatabaseModule } from '@app/common/database';
import { LocationDocument, LocationSchema } from './models/location.schema';
import { LoggerModule } from '@app/common/logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@app/common/response';
import { LocationRepository } from './location.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: LocationDocument.name, schema: LocationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [LocationController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    LocationService,
    LocationRepository,
  ],
})
export class LocationModule {}

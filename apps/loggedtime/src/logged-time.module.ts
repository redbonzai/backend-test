import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggedTimeController } from './logged-time.controller';
import { LoggedTimeService } from './logged-time.service';
import { DatabaseModule } from '@app/common/database';
import { LoggerModule } from '@app/common/logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants';
import { LoggedTimeDocument, LoggedTimeSchema } from '@loggedtime/models';
import { LoggedTimeRepository } from '@loggedtime/loggedtime.repository';
import { ResponseInterceptor } from '@app/common/response';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserMiddleware } from '@loggedtime/middleware/user/user.middleware';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: LoggedTimeDocument.name, schema: LoggedTimeSchema },
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
  controllers: [LoggedTimeController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    LoggedTimeService,
    LoggedTimeRepository,
  ],
})
export class LoggedTimeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}

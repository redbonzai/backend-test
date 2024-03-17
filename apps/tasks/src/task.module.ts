import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DatabaseModule } from '@app/common/database';
import { LoggerModule } from '@app/common/logger';
import { AUTH_SERVICE } from '@app/common/constants';
import { ResponseInterceptor } from '@app/common/response';
import { LocationDocument, LocationSchema } from '@locations/models';
import { TaskDocument, TaskSchema } from '@tasks/models';
import { TaskRepository } from "@tasks/task.repository";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: TaskDocument.name, schema: TaskSchema },
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
  controllers: [TaskController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    TaskService,
    TaskRepository,
  ],
})
export class TaskModule {}

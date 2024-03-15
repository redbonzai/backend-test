import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import Joi from 'joi';
import { DatabaseModule } from '@app/common/database';
import { LoggerModule } from '@app/common/logger';
import { WorkerDocument, WorkerSchema } from './models/worker.schema';
import { AUTH_SERVICE } from '@app/common/constants';
import { UsersModule } from '../../auth/src/users/users.module';
import { WorkersController } from './workers.controller';
import { ResponseInterceptor } from '@app/common/response';
import { WorkersService } from './workers.service';
import { UsersRepository } from '../../auth/src/users/users.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: WorkerDocument.name, schema: WorkerSchema },
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
        ROLES_HOST: Joi.string().required(),
        ROLES_PORT: Joi.number().required(),
        PERMISSIONS_HOST: Joi.string().required(),
        PERMISSIONS_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
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
    UsersModule,
  ],
  controllers: [WorkersController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    WorkersService,
    ReservationsRepository,
    UsersRepository,
  ],
})
export class WorkersModule {}

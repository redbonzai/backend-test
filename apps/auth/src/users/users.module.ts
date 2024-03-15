import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/database';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDocument, UserSchema } from '@auth/users/models';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
  ],
  exports: [
    UsersService,
    MongooseModule,
  ],
})
export class UsersModule {}

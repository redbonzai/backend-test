import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDocument, UserSchema } from '@auth/users/models';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from '@roles/roles.module';
import { RoleDocument, RoleSchema } from '@roles/models/role.schema';
import { RolesRepository } from '@roles/roles.repository';
import {
  PermissionDocument,
  PermissionSchema,
} from '@permissions/models/permission.schema';
import { PermissionsRepository } from '@permissions/permissions.repository';

@Module({
  imports: [
    RolesModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: RoleDocument.name, schema: RoleSchema },
      { name: PermissionDocument.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    RolesRepository,
    PermissionsRepository,
  ],
  exports: [
    UsersService,
    MongooseModule,
    RolesRepository,
    PermissionsRepository,
  ],
})
export class UsersModule {}

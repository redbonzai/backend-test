import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { UserDocument } from '@auth/users/models';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, Types } from 'mongoose';
import { RoleDocument } from '@roles/models/role.schema';
import { User } from './interfaces';
import { Permission } from '@permissions/interfaces';
import { Role } from '@roles/interfaces/role.interface';
import { RolesRepository } from '@roles/roles.repository';
import { PermissionsRepository } from '@permissions/permissions.repository';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);
  private readonly userModel: Model<UserDocument>;
  private readonly roleModel: Model<RoleDocument>;
  private rolesRepository: RolesRepository;
  private permissionsRepo: PermissionsRepository;

  constructor(
    @InjectModel(UserDocument.name) userModel: Model<UserDocument>,
    @InjectModel(RoleDocument.name) roleModel: Model<RoleDocument>,
  ) {
    super(userModel);
    this.userModel = userModel;
    this.roleModel = roleModel;
  }

  async addReservationToUser(
    userId: string,
    reservationId: string,
  ): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const reservationObjectId = new mongoose.Types.ObjectId(reservationId);

    const updateResult = await this.userModel.updateOne(
      { _id: userObjectId },
      { $addToSet: { reservationIds: reservationObjectId } },
    );

    if (updateResult.matchedCount === 0) {
      console.log(`No user found with ID: ${userId}`);
    } else if (updateResult.modifiedCount === 0) {
      console.log(
        `Reservation ID ${reservationId} already exists in user ${userId}`,
      );
    } else {
      console.log('Reservation successfully added to user');
    }
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const user: User = await this.userModel.findById(userId).populate({
      path: 'roles',
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.roles.map((role: Role) => role);
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user: User = await this.userModel.findById(userId).populate({
      path: 'roles',
      populate: { path: 'permissions' },
    });

    console.log('FOUND USER TO GET PERMISSIONS FROM: ', user);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Ensure TypeScript knows the type of 'user'
    // Extract permissions from user roles
    const permissions: string[] = user.roles.reduce((acc, role) => {
      const rolePermissions = role.permissions.map(
        (permission) => permission.name,
      );
      console.log('ROLE PERMISSIONS: ', rolePermissions);
      console.log('ACC: ', acc);
      return [...acc, ...rolePermissions];
    }, []);

    console.log('Permissions: ', permissions);

    return permissions;
  }

  // async rolesAndPermissions(): Promise<User[]> {
  //   // Find all users and populate their roles and permissions
  //   const users = await this.userModel
  //     .find({})
  //     .populate({
  //       path: 'roles', // Path to the roles in the user document
  //       populate: {
  //         path: 'permissions', // Path to the permissions in the role document
  //         select: 'name', // Select to only include the permission names
  //       },
  //       select: 'name', // Select to only include the role names
  //     })
  //     .exec();
  //
  //   // @ts-ignore
  //   return users.map((user) => ({
  //     ...user.toObject(),
  //     roles: user.roles.map((role) => ({
  //       ...role,
  //       permissions: role.permissions.map((permission) => permission.name),
  //     })),
  //   }));
  // }

  async rolesAndPermissions(userId: string): Promise<any> {
    const user: User = await this.userModel.findById(userId).populate({
      path: 'roles',
      populate: { path: 'permissions' },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      roles: user.roles.map((role: Role) => role.name),
      permissions: user.roles.flatMap((role) =>
        role.permissions.map((permission: Permission) => permission.name),
      ),
    };
  }

  async allUsersWithRolesAndPermissions(): Promise<UserDocument[]> {
    try {
      // Populate roles and then within each role, populate permissions
      const users = await this.userModel.find({}).populate({
        path: 'roles',
        populate: {
          path: 'permissions',
          select: 'name permission',
        },
      });
      // .exec();

      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }

      return users;
    } catch (error) {
      throw new NotFoundException('Failed to retrieve users');
    }
  }
  async syncUserRoles(
    userId: Types.ObjectId,
    roleNames: string[],
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    this.ensureExists(user, `User with ID ${userId} not found`);

    const roles = await this.rolesRepository.firstOrCreateRoleNames(roleNames);
    this.ensureRolesFound(roles, roleNames);

    user.roles = roles.map((role: Role) => role._id);
    await user.save();

    return this.fetchUpdatedUser(userId);
  }

  async syncPermissionsOnRoleId(
    userId: Types.ObjectId,
    roleId: Types.ObjectId,
    permissions: string[],
  ): Promise<UserDocument> {
    const role = await this.roleModel.findById(roleId);
    this.ensureExists(role, `Role with ID ${roleId} not found`);

    role.permissions =
      await this.permissionsRepo.permissionIdsByPermissionNames(permissions);
    await role.save();

    return this.fetchUpdatedUser(userId, true);
  }

  private ensureExists(document: any, errorMessage: string): void {
    if (!document) {
      throw new NotFoundException(errorMessage);
    }
  }

  private ensureRolesFound(roles: Role[], roleNames: string[]): void {
    if (roles.length !== roleNames.length) {
      throw new NotFoundException('One or more roles not found');
    }
  }

  private async fetchUpdatedUser(
    userId: Types.ObjectId,
    populatePermissions: boolean = false,
  ): Promise<UserDocument> {
    let query = this.userModel.findById(userId).populate('roles');
    if (populatePermissions) {
      query = query.populate({ path: 'roles', populate: 'permissions' });
    }
    const updatedUser = await query;
    this.ensureExists(updatedUser, `User with ID ${userId} not found`);
    return updatedUser;
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database';
import { UserDocument } from '@auth/users/models';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);
  private readonly userModel: Model<UserDocument>;

  constructor(
    @InjectModel(UserDocument.name) userModel: Model<UserDocument>,
  ) {
    super(userModel);
    this.userModel = userModel;
  }

  private ensureExists(document: any, errorMessage: string): void {
    if (!document) {
      throw new NotFoundException(errorMessage);
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

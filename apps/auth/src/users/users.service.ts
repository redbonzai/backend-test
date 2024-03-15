import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from '@auth/users/models';
import { RolesRepository } from '@roles/roles.repository';
import { Types } from 'mongoose';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';
import { CreatedUserValidationException } from '@auth/users/exceptions/created-user-validation.exception';
import { ErrorType } from '@app/common/enums';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Convert role strings to ObjectId's
    const roleIds = await this.rolesRepository.getRoleIdsFromRoleNames(
      createUserDto.roles,
    );

    console.log('ROLE IDS ', roleIds);

    const createdUser = await this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      roles: roleIds,
      permissions: [],
    });
    console.log('CREATED USER', createdUser);
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async getCurrentUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: GetUserDto, userDto: UpdateUserDto): Promise<UserDocument> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }

    // Perform the update
    return await this.usersRepository.findOneAndUpdate(
      { _id },
      { $set: userDto },
    );
  }

  async validateCreateUser(createUserDto: CreateUserDto) {
    if (
      !(await this.userExists(createUserDto)) &&
      createUserDto.hasOwnProperty('roles')
    ) {
      return true;
    }

    throw new CreatedUserValidationException(
      'User must have at least one role OR User already exists',
      ErrorType.USER_MUST_HAVE_AT_LEAST_ONE_ROLE,
      HttpStatus.BAD_REQUEST,
    );
  }

  async userExists(createUserDto: CreateUserDto) {
    console.log('Checking if user exists', createUserDto);
    const user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    console.log('User EXISTS:', user);
    return user !== null;
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async addReservationToUser(userId: string, resId: string): Promise<void> {
    return await this.usersRepository.addReservationToUser(userId, resId);
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    return await this.usersRepository.getUserPermissions(userId);
  }

  async getUserRolesAndPermissions(userId: string): Promise<string[]> {
    return await this.usersRepository.getUserRolesAndPermissions(userId);
  }

  async updateUserRoles(
    userId: Types.ObjectId,
    roles: string[],
  ): Promise<UserDocument> {
    // get all roles and permissions,
    // user's roles to existing roles
    return await this.usersRepository.syncUserRoles(userId, roles);
  }

  async updateUserPermissions(
    userId: Types.ObjectId,
    roleId: Types.ObjectId,
    permissionNames: string[],
  ): Promise<UserDocument> {
    // get all roles and permissions,
    // sync the permissions with the roles
    return await this.usersRepository.syncPermissionsOnRoleId(
      userId,
      roleId,
      permissionNames,
    );
  }
}

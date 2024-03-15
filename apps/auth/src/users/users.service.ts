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
import { Types } from 'mongoose';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';
import { CreatedUserValidationException } from '@auth/users/exceptions/created-user-validation.exception';
import { ErrorType } from '@app/common/enums';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,

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
}

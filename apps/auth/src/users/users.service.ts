import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from '@auth/users/models';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
    });
    return createdUser;
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
    if (!(await this.userExists(createUserDto))) {
      return true;
    }
  }

  async userExists(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.find({
      email: createUserDto.email,
    });
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

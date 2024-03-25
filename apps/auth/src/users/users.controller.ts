import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '@auth/users/decorators';
import { identifierToDTO } from '@app/common/utilities';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserDocument } from '@auth/users/models';
import { UsersService } from './users.service';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from '@auth/users/dto/update-user.dto';
import { Types } from 'mongoose';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDocument,
  })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.validateCreateUser(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: UserDocument,
    isArray: true,
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Details of the current user',
    type: UserDocument,
  })
  async getCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Details of the specified user',
    type: UserDocument,
  })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserDocument,
  })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() user: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.update(id, user);
  }
}

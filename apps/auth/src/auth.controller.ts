import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CurrentUser } from '@auth/users/decorators';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDocument } from '@auth/users/models';
import { UsersService } from './users/users.service';
import { GetUserDto } from './users/dto/get-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDocument> {
    await this.authService.login(user, response);
    // response.send(user);
    const getUserDto: GetUserDto = user._id;
    return this.usersService.getCurrentUser(getUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() payload: any) {
    return payload.user;
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (request.cookies?.Authentication || request.headers?.authentication) {
      await this.authService.logout(response);
    }
    return {
      message: 'success',
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from '@auth/users/models';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: UserDocument, response: Response) {
    try {
      const tokenPayload: TokenPayload = {
        userId: user._id,
      };

      const expires = new Date();
      expires.setSeconds(
        expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
      );

      const token = this.jwtService.sign(tokenPayload);
      response.cookie('Authentication', token, {
        httpOnly: true,
        expires,
      });

      return token;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async logout(response: Response): Promise<{ message: string }> {
    response.clearCookie('Authentication');
    return {
      message: 'Authentication successfully cleared',
    };
  }
}

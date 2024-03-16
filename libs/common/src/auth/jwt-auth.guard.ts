import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UserDto } from '@app/common';
import { AUTH_SERVICE } from '@app/common/constants/services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    if (!jwt) {
      return false;
    }

    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    console.log('ROLES IN JWT-AUTH.GUARD: ', roles);

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res: UserDto) => {
          for (const role of roles) {
            if (!res.roles.includes(role)) {
              this.logger.error('INSUFFICIENT PERMISSIONS');
              throw new UnauthorizedException('INSUFFICIENT PERMISSIONS');
            }
          }
          context.switchToHttp().getRequest().user = res;
        }), // return true if we can authenticate the user.
        map(() => true), // returns true on successful response from auth ms.
        catchError((error) => {
          console.error('ERROR IN JWT-AUTH.GUARD', error);
          this.logger.error('ERROR IN JWT-AUTH.GUARD');
          return of(false);
        }), // returns false on error from auth ms.
      );

    // function jwtError(error) {
    //   console.error('ERROR IN JWT-AUTH.GUARD: ', error);
    //   this.logger.error(error);
    //   return of(false); // returns false on error from auth ms.
    // }
  }
}

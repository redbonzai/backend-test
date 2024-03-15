import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// retrieve the current JWT token from the request
export const JwtToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.Authentication || request.headers?.authentication;
  },
);

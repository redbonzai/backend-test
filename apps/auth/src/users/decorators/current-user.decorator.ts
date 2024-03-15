import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '@auth/users/models';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const user = getCurrentUserByContext(context);
    console.log('CURRENT USER: ', user);
    return user;
  },
);

import { IJwtPayload } from '../interfaces/auth.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractUserId = createParamDecorator(
  (data: keyof IJwtPayload = 'id', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('req', request.user);
    if (!data) return request.user;
    return request.user.userId;
  },
);

import { IJwtPayload } from '../interfaces/auth.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractUserId = createParamDecorator(
  (data: keyof IJwtPayload = 'userId', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!data) return request.user;
    return request.user.userId;
  },
);

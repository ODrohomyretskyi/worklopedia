import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestContext } from '../dto/request-context.dto';
import { createRequestContext } from '../util/create-request-context.util';

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();

    return createRequestContext(request);
  },
);

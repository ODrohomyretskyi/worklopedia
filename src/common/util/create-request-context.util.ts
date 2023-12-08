import { Request } from 'express';

import { FORWARDED_FOR_TOKEN_HEADER } from '../constants';
import { RequestContext } from '../dto/request-context.dto';

export function createRequestContext(request: Request | any): RequestContext {
  const forwarderForTokenHeader = request?.headers[FORWARDED_FOR_TOKEN_HEADER];
  return new RequestContext(request.url, forwarderForTokenHeader || request.ip);
}

import { Request } from 'express';

import {
  FORWARDED_FOR_TOKEN_HEADER,
  REQUEST_ID_TOKEN_HEADER,
} from '../constants';
import { RequestContext } from '../dto/request-context.dto';

export function createRequestContext(request: Request | any): RequestContext {
  const ctx = new RequestContext();
  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER);
  ctx.url = request.url;
  const forwarderForTokenHeader = request.header(FORWARDED_FOR_TOKEN_HEADER);
  ctx.ip = forwarderForTokenHeader || request.ip;

  return ctx;
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../../common/interfaces/auth.interface';

import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.ExtractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('APP_JWT_SECRET'),
    });
  }

  private static ExtractJWT(req: Request) {
    if (req.cookies) {
      console.log(req.cookies['refresh']);
      return req.cookies['refresh'];
    }
  }

  async validate(payload: IJwtPayload) {
    return { userId: payload.id, sub: payload?.email };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(protected readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.getOrThrow('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('LINKEDIN_CALLBACK_URL'),
      scope: ['profile', 'openid', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    return done(null, profile);
  }
}

import { makeReq } from './axios.service';
import {
  ILinkedinGetAccess,
  ILinkedinProfile,
} from '../interfaces/linkedin.interface';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const linkedInService = {
  getUserInfo: (accessToken: string) =>
    makeReq<ILinkedinProfile>(`https://api.linkedin.com/v2/userinfo`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }),
  getAccessToken: (code: string) =>
    makeReq<ILinkedinGetAccess>(
      `https://www.linkedin.com/oauth/v2/accessToken`,
      {
        method: 'POST',
        params: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: configService.get('LINKEDIN_CALLBACK_URL'),
          client_id: configService.get('LINKEDIN_CLIENT_ID'),
          client_secret: configService.get('LINKEDIN_CLIENT_SECRET'),
        },
      },
    ),
};

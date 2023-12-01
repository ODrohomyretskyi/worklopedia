export interface ILinkedinProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  email: string;
  email_verified: boolean;
}

export interface ILinkedinGetAccess {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

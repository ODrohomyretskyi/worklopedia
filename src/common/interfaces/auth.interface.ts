export interface IJwtPayload {
  id: string;
  email: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

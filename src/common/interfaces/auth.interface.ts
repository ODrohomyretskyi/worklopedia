export interface IJwtPayload {
  id: string;
  email: string;
}

export type ITokens = {
  accessToken: string;
  refreshToken: string;
};

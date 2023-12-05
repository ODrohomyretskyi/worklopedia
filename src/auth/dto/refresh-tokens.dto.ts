import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class AuthRefreshTokensDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}

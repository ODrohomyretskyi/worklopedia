import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class TokensDto {
  @ApiProperty({ name: 'accessToken', type: String })
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;

  @ApiProperty({ name: 'refreshToken', type: String })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}

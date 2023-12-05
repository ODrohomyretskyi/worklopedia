import { User } from '../../users/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from './tokens.dto';

export class SignInDto {
  @ApiProperty({
    name: 'user',
    nullable: false,
    example: '{id: 1, first_name: John, ...etc}',
    type: () => User,
  })
  @IsNotEmpty()
  user: User;

  @ApiProperty({
    name: 'tokens',
    nullable: false,
    example: '{accessToken: anyToken, refreshToken: anyToken}',
    type: () => TokensDto,
  })
  @IsNotEmpty()
  tokens: TokensDto;
}

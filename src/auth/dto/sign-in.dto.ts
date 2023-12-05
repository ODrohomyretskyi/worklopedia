import { User } from '../../users/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { ITokens } from '../../common/interfaces/auth.interface';

export class SignInDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  tokens: ITokens;
}

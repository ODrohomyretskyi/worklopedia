import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ILinkedinProfile } from '../common/interfaces/linkedin.interface';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AppLogger } from '../common/app-logger/app-logger.service';
import { RequestContext } from '../common/dto/request-context.dto';
import { IJwtPayload, ITokens } from '../common/interfaces/auth.interface';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { linkedInService } from '../common/services/linkedin.service';
import { errorMessages } from '../common/constants/errors';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  private appLogger = new AppLogger(AuthService.name);

  constructor(
    protected readonly userService: UsersService,
    protected readonly configService: ConfigService,
    @InjectRepository(Tokens)
    protected readonly tokenRepository: Repository<Tokens>,
    protected readonly jwtService: JwtService,
  ) {}

  public async signIn(
    ctx: RequestContext,
    {
      email,
      email_verified,
      given_name,
      family_name,
      picture,
    }: ILinkedinProfile,
  ): Promise<SignInDto> {
    this.appLogger.log(ctx, `${this.signIn.name} was called`);

    this.appLogger.debug(ctx, `calling userService.findOneByEmail`);
    const currentUser = await this.userService.findOneByEmail(email);

    if (currentUser) {
      this.appLogger.debug(ctx, `calling clearTokens method`);
      await this.clearTokens(currentUser.id);

      const payload: IJwtPayload = {
        id: currentUser.id,
        email: currentUser.email,
      };

      this.appLogger.debug(ctx, `calling generateTokens method`);
      const tokens: ITokens = await this.generateTokens(currentUser, payload);

      return {
        user: currentUser,
        tokens,
      };
    }

    const createData: CreateUserDto = {
      email: email,
      avatar: picture,
      email_verified,
      first_name: given_name,
      last_name: family_name,
    };

    this.appLogger.debug(ctx, `calling userService.create`);
    const newUser: User = await this.userService.create(createData);

    const payload: IJwtPayload = { id: newUser.id, email: newUser.email };

    this.appLogger.debug(ctx, `calling generateTokens method`);
    const tokens: ITokens = await this.generateTokens(newUser, payload);

    return {
      user: newUser,
      tokens,
    };
  }

  async refreshTokens(
    ctx: RequestContext,
    refreshToken: string,
  ): Promise<TokensDto> {
    this.appLogger.log(ctx, `${this.refreshTokens.name} was called`);

    this.appLogger.debug(ctx, `calling ${JwtService.name}.verify`);
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('APP_REFRESH_SECRET'),
    });

    if (!decoded) {
      throw new BadRequestException(errorMessages.INCORRECT_REQUEST);
    }

    this.appLogger.debug(ctx, `calling ${UsersService.name}.findById`);
    const currentUser = await this.userService.findOneById(decoded.id);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }
    await this.clearTokens(currentUser.id);

    return this.generateTokens(currentUser, {
      id: currentUser.id,
      email: currentUser.email,
    });
  }

  public async clearTokens(userId: string): Promise<void> {
    const tokens = await this.tokenRepository.find({
      where: { user: { id: userId } },
    });

    await this.tokenRepository.remove(tokens);
  }

  public async getLinkedInProfile(code: string): Promise<ILinkedinProfile> {
    const tokenResponse = await linkedInService.getAccessToken(code);

    const { access_token: accessToken } = tokenResponse;

    return await linkedInService.getUserInfo(accessToken);
  }

  //----Utils----
  private async generateTokens(user: User, payload): Promise<TokensDto> {
    const tokens: TokensDto = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_JWT_SECRET'),
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };

    await this.tokenRepository
      .save({
        user,
        ...tokens,
      })
      .catch(() => {
        throw new Error('Error durring tokens generate');
      });

    return tokens;
  }
}

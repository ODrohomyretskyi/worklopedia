import { Injectable } from '@nestjs/common';
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
import { IJwtPayload } from '../common/interfaces/auth.interface';

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
  ) {
    this.appLogger.log(ctx, `${this.signIn.name} was called`);

    this.appLogger.log(ctx, `calling userService.findOneByEmail`);
    const currentUser = await this.userService.findOneByEmail(email);

    if (currentUser) {
      const payload: IJwtPayload = {
        id: currentUser.id,
        email: currentUser.email,
      };

      return {
        accessToken: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('APP_JWT_SECRET'),
          expiresIn: '1d',
        }),
        refreshToken: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('APP_REFRESH_SECRET'),
          expiresIn: '7d',
        }),
      };
    }

    const createData = {
      email: email,
      avatar: picture,
      email_verified,
      first_name: given_name,
      last_name: family_name,
    } as CreateUserDto;

    const newUser = await this.userService.create(createData);

    const payload: IJwtPayload = { id: newUser.id, email: newUser.email };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_JWT_SECRET'),
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }
}

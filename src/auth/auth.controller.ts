import {
  Controller,
  Get,
  Param,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { linkedInService } from '../common/services/linkedin.service';
import { ReqContext } from '../common/decorators/req-context.decorator';
import { RequestContext } from '../common/dto/request-context.dto';
import { AppLogger } from '../common/app-logger/app-logger.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ILinkedinProfile } from '../common/interfaces/linkedin.interface';

@Controller('auth')
export class AuthController {
  private appLogger = new AppLogger(AuthController.name);
  constructor(
    protected readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {}

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {}

  @Get('linkedin/callback')
  async linkedinCallback(
    @ReqContext() ctx: RequestContext,
    @Query('code') code: string,
  ) {
    try {
      console.log(code);

      const tokenResponse = await linkedInService.getAccessToken(code);

      if (!tokenResponse) throw new Error('token response not valid');

      const { access_token: accessToken } = tokenResponse;

      const userInfo: ILinkedinProfile =
        await linkedInService.getUserInfo(accessToken);

      return await this.authService.signIn(ctx, userInfo);
    } catch (error) {
      this.appLogger.error(ctx, error.response.data.error);
      throw new UnauthorizedException();
    }
  }

  @Get('logout/:id')
  @UseGuards(JwtAuthGuard)
  async logOut(@Param('id') id: string) {}
}

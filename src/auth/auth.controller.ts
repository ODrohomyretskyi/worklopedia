import {
  ConflictException,
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
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';
import { SignInDto } from './dto/sign-in.dto';

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
  ): Promise<SignInDto> {
    try {
      const userInfo = await this.authService.getLinkedInProfile(code);

      return await this.authService.signIn(ctx, userInfo);
    } catch (e) {
      const errorText = e?.response?.data?.error
        ? e.response.data.error
        : e?.message
          ? e.message
          : 'Something went wrong';

      this.appLogger.error(ctx, errorText);
      throw new UnauthorizedException(errorText);
    }
  }

  @Get('logout/:id')
  @UseGuards(JwtAuthGuard)
  async logOut(
    @ReqContext() ctx: RequestContext,
    @ExtractUserId('id') id: string,
  ): Promise<void> {
    try {
      await this.authService.clearTokens(id);
    } catch (e) {
      const errorText = 'message' in e ? e.message : 'Something went wrong';
      this.appLogger.error(ctx, errorText);
      throw new ConflictException(e);
    }
  }
}

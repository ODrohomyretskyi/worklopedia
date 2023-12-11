import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ReqContext } from '../common/decorators/req-context.decorator';
import { RequestContext } from '../common/dto/request-context.dto';
import { AppLogger } from '../common/app-logger/app-logger.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { FastifyReply } from 'fastify';
import { AuthRefreshTokensDto } from './dto/refresh-tokens.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private appLogger = new AppLogger(AuthController.name);
  private linkedInUri: string = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.configService.get(
    'LINKEDIN_CLIENT_ID',
  )}&redirect_uri=${encodeURIComponent(
    this.configService.get('LINKEDIN_CALLBACK_URL'),
  )}&scope=profile%20email%20openid`;
  constructor(
    protected readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {}
  @ApiOperation({ summary: 'Sign-in/up with LinkedIn' })
  @ApiNoContentResponse({ description: 'No content' })
  @Get('linkedin')
  async linkedinLogin(@Res() res: FastifyReply): Promise<any> {
    return res.redirect(302, this.linkedInUri);
  }

  @ApiOperation({ summary: 'LinkedIn callback' })
  @ApiResponse({
    description: 'The user successfully signed-up/in',
  })
  @Get('linkedin/callback')
  @Public()
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

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    description: 'The user successfully logged-out',
  })
  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logOut(
    @ReqContext() ctx: RequestContext,
    @Res({ passthrough: true }) res: FastifyReply,
    @ExtractUserId('id') id: string,
  ): Promise<void> {
    try {
      await this.authService.clearTokens(id);
      res.clearCookie('refresh', {
        httpOnly: true,
        secure: true,
      });

      return res.status(200).send();
    } catch (e) {
      const errorText = 'message' in e ? e.message : 'Something went wrong';
      this.appLogger.error(ctx, errorText);
      throw new ConflictException(e);
    }
  }

  @ApiResponse({ description: 'Request for refresh your tokens' })
  @Post('refresh')
  async refreshTokens(
    @ReqContext() ctx: RequestContext,
    @Body() { refreshToken }: AuthRefreshTokensDto,
  ): Promise<any> {
    return await this.authService.refreshTokens(ctx, refreshToken);
  }
}

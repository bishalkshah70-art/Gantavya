import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private cookieOptions() {
    const production = this.config.get('NODE_ENV') === 'production';
    const secure =
      this.config.get('COOKIE_SECURE') === 'true' || production;

    return {
      httpOnly: true,
      secure,
      sameSite: 'lax' as const,
      path: '/api/auth',
    };
  }

  private setCookies(
    res: Response,
    tokens: {
      accessToken: string;
      refreshToken: string;
    },
  ) {
    res.cookie('gantavya_access', tokens.accessToken, {
      ...this.cookieOptions(),
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('gantavya_refresh', tokens.refreshToken, {
      ...this.cookieOptions(),
      maxAge:
        Number(this.config.get('REFRESH_TOKEN_DAYS') || 7) *
        86400000,
    });
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateLogin(dto);
    const tokens = await this.auth.issueTokens(user);

    this.setCookies(res, tokens);

    return {
      message: 'Welcome to Gantavya',
      user,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.gantavya_refresh;

    if (!token) {
      res.clearCookie('gantavya_access', this.cookieOptions());
      res.clearCookie('gantavya_refresh', this.cookieOptions());

      return {
        message: 'No active refresh session',
      };
    }

    const tokens = await this.auth.refresh(token);

    this.setCookies(res, tokens);

    return {
      message: 'Session refreshed',
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(req.cookies?.gantavya_refresh);

    res.clearCookie('gantavya_access', this.cookieOptions());
    res.clearCookie('gantavya_refresh', this.cookieOptions());

    return {
      message: 'Logged out successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @Req() req: Request & { user: { id: string } },
  ) {
    return {
      user: await this.auth.getUser(req.user.id),
    };
  }
}

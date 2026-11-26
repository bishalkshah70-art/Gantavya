import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SAFE_USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  isVerified: true,
  createdAt: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshDays(): number {
    return Number(this.config.get('REFRESH_TOKEN_DAYS') || 7);
  }

  async register(dto: RegisterDto) {
    const fullName = dto.fullName.trim();
    const email = dto.email.trim().toLowerCase();

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash,
          isVerified: true,
          emailVerified: true,
        },
        select: SAFE_USER_SELECT,
      });

      return {
        message: 'Account created successfully. Please sign in.',
        user,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }

      throw error;
    }
  }

  async validateLogin(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (
      !user ||
      !(await bcrypt.compare(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException(
        'Email or password is incorrect',
      );
    }

    const {
      passwordHash,
      phoneNumber,
      emailVerified,
      phoneVerified,
      ...safeUser
    } = user;

    return safeUser;
  }

  async issueTokens(user: {
    id: string;
    email: string;
    role: string;
  }) {
    const accessSecret =
      this.config.get<string>('JWT_ACCESS_SECRET');

    const refreshSecret =
      this.config.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret || !refreshSecret) {
      throw new Error(
        'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be configured',
      );
    }

    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        typ: 'access',
      },
      {
        secret: accessSecret,
        expiresIn: this.config.get('ACCESS_TOKEN_TTL') || '15m',
      },
    );

    const rawRefresh = randomBytes(48).toString('base64url');

    const refreshToken = await this.jwt.signAsync(
      {
        sub: user.id,
        jti: rawRefresh,
        typ: 'refresh',
      },
      {
        secret: refreshSecret,
        expiresIn: `${this.refreshDays()}d`,
      },
    );

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(
          Date.now() + this.refreshDays() * 86400000,
        ),
      },
    });

    return { accessToken, refreshToken };
  }

  async refresh(oldToken: string) {
    const secret =
      this.config.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    let payload: any;

    try {
      payload = await this.jwt.verifyAsync(oldToken, { secret });
    } catch {
      throw new UnauthorizedException(
        'Refresh session expired. Please log in again.',
      );
    }

    if (payload.typ !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = this.hashToken(oldToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (
      !stored ||
      stored.userId !== payload.sub ||
      stored.expiresAt < new Date()
    ) {
      throw new UnauthorizedException(
        'Refresh session is no longer valid',
      );
    }

    await this.prisma.refreshToken.delete({
      where: { id: stored.id },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return this.issueTokens(user);
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return;

    await this.prisma.refreshToken.deleteMany({
      where: {
        tokenHash: this.hashToken(refreshToken),
      },
    });
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: SAFE_USER_SELECT,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}

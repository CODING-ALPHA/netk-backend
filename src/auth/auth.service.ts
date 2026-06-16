import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly resend: Resend;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private generateTokens(userId: string, email: string, role: string = 'user') {
    const accessToken = this.jwt.sign(
      { sub: userId, email, role },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' },
    );
    const refreshToken = this.jwt.sign(
      { sub: userId, email, role },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }

  async signup(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      user.role ?? 'user',
    );
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      user.role ?? 'user',
    );
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user?.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const match = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    const { accessToken } = this.generateTokens(
      user.id,
      user.email,
      user.role ?? 'user',
    );
    return { accessToken };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = randomUUID();
      const expiry = new Date(Date.now() + 3_600_000);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordResetToken: token, passwordResetExpiry: expiry },
      });

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
      await this.resend.emails.send({
        from: 'NetK <noreply@netk.app>',
        to: email,
        subject: 'Reset your NetK password',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
            <h2 style="color:#0D1117;margin-bottom:8px;">Reset your NetK password</h2>
            <p style="color:#374151;margin-bottom:24px;">
              You requested a password reset. Click the button below to set a new password.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;padding:12px 24px;background:#2DD4BF;color:#0D1117;
                      border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
              Reset Password
            </a>
            <p style="margin-top:24px;color:#6B7280;font-size:13px;">
              This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    }

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetToken || !user.passwordResetExpiry) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    if (new Date() > user.passwordResetExpiry) {
      throw new BadRequestException('Reset link has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }
}

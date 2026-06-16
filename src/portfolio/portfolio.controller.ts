import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { SetSlugDto } from './dto/set-slug.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // IMPORTANT: /me and /me/stats must be declared before /:slug to prevent
  // NestJS from matching "me" as a slug parameter.

  @Get('me')
  getMyPortfolio(@Request() req: any) {
    return this.portfolioService.getMyPortfolio(req.user.userId);
  }

  @Get('me/stats')
  getMyStats(@Request() req: any) {
    return this.portfolioService.getMyStats(req.user.userId);
  }

  @Patch('visibility')
  async updateVisibility(
    @Request() req: any,
    @Body() dto: UpdateVisibilityDto,
  ) {
    await this.portfolioService.updateVisibility(req.user.userId, dto);
    const message =
      dto.visibility === 'public'
        ? 'Your portfolio is now public'
        : 'Your portfolio is now private';
    return { visibility: dto.visibility, message };
  }

  @Patch('slug')
  async setSlug(@Request() req: any, @Body() dto: SetSlugDto) {
    const user = await this.portfolioService.setSlug(req.user.userId, dto);
    const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:3000';
    return {
      slug: dto.slug,
      publicUrl: `${clientUrl}/portfolio/${dto.slug}`,
    };
  }

  @Public()
  @Get('slug/check/:slug')
  checkSlug(@Param('slug') slug: string) {
    return this.portfolioService.checkSlug(slug);
  }

  @Public()
  @Get(':slug')
  getPublicPortfolio(@Param('slug') slug: string, @Request() req: any) {
    const forwarded = req.headers['x-forwarded-for'];
    let viewerIp: string | undefined;
    if (forwarded) {
      viewerIp = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0].trim();
    } else {
      viewerIp = req.ip as string | undefined;
    }
    return this.portfolioService.getPublicPortfolio(slug, viewerIp);
  }
}

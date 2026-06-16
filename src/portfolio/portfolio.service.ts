import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetSlugDto } from './dto/set-slug.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import {
  ArtifactSummary,
  GroupedArtifacts,
  PortfolioData,
  PortfolioStats,
  PortfolioUser,
} from './interfaces/portfolio.interface';
import { Artifact as PrismaArtifact, User as PrismaUser } from '@prisma/client';

function toArtifactSummary(doc: PrismaArtifact): ArtifactSummary {
  return {
    id: doc.id,
    title: doc.title,
    tags: doc.tags,
    evidenceLinks: doc.evidenceLinks,
    fileUrls: doc.fileUrls,
    textResponse: doc.textResponse ?? undefined,
    createdAt: doc.createdAt.getTime(),
    taskId: doc.taskId,
  };
}

function toPortfolioUser(user: PrismaUser): PortfolioUser {
  return {
    id: user.id,
    region: user.region ?? undefined,
    experienceLevel: user.experienceLevel ?? undefined,
    careerInterests: user.careerInterests,
    portfolioSlug: user.portfolioSlug ?? undefined,
    portfolioVisibility: user.portfolioVisibility ?? 'private',
  };
}

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  private async groupArtifacts(
    artifacts: ArtifactSummary[],
  ): Promise<GroupedArtifacts[]> {
    if (artifacts.length === 0) return [];

    const pathSlugMap = new Map<string, ArtifactSummary[]>();

    for (const artifact of artifacts) {
      const pathName = artifact.tags[0];
      if (!pathName) continue;
      const pathSlug = pathName.toLowerCase().replace(/ /g, '-');
      if (!pathSlugMap.has(pathSlug)) pathSlugMap.set(pathSlug, []);
      pathSlugMap.get(pathSlug)!.push(artifact);
    }

    if (pathSlugMap.size === 0) return [];

    const uniquePathSlugs = [...pathSlugMap.keys()];

    const pathDocs = await Promise.all(
      uniquePathSlugs.map((slug) =>
        this.prisma.careerPath.findUnique({
          where: { slug },
          select: { name: true },
        }),
      ),
    );

    return uniquePathSlugs
      .map((pathSlug, i) => ({
        pathSlug,
        pathName: pathDocs[i]?.name ?? pathSlug,
        artifacts: pathSlugMap.get(pathSlug)!,
      }))
      .sort((a, b) => b.artifacts.length - a.artifacts.length);
  }

  private async buildStats(userId: string): Promise<PortfolioStats> {
    const [latestArtifact, totalArtifacts, submissionsCount, totalViews, allProgress] =
      await Promise.all([
        this.prisma.artifact.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
        this.prisma.artifact.count({ where: { userId } }),
        this.prisma.submission.count({ where: { userId } }),
        this.prisma.portfolioView.count({ where: { portfolioUserId: userId } }),
        this.prisma.userPathProgress.findMany({ where: { userId } }),
      ]);

    const pathsCompleted = allProgress.filter(
      (p) => p.completedStages.length === 5,
    ).length;

    return {
      totalArtifacts,
      submissionsCount,
      totalViews,
      pathsCompleted,
      lastUpdated: latestArtifact ? latestArtifact.createdAt.getTime() : null,
    };
  }

  async getMyPortfolio(userId: string): Promise<PortfolioData> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Portfolio not found');

    const [artifacts, stats] = await Promise.all([
      this.prisma.artifact.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.buildStats(userId),
    ]);

    const artifactSummaries = artifacts.map(toArtifactSummary);
    const groupedArtifacts = await this.groupArtifacts(artifactSummaries);

    return {
      user: toPortfolioUser(user),
      artifacts: artifactSummaries,
      groupedArtifacts,
      stats,
    };
  }

  async getPublicPortfolio(
    slug: string,
    viewerIp?: string,
  ): Promise<PortfolioData> {
    const user = await this.prisma.user.findUnique({
      where: { portfolioSlug: slug },
    });

    if (!user || user.portfolioVisibility !== 'public') {
      throw new NotFoundException('Portfolio not found');
    }

    this.prisma.portfolioView
      .create({
        data: {
          portfolioUserId: user.id,
          ...(viewerIp ? { viewerIp } : {}),
        },
      })
      .catch(() => {});

    const [artifacts, stats] = await Promise.all([
      this.prisma.artifact.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      this.buildStats(user.id),
    ]);

    const artifactSummaries = artifacts.map(toArtifactSummary);
    const groupedArtifacts = await this.groupArtifacts(artifactSummaries);

    return {
      user: toPortfolioUser(user),
      artifacts: artifactSummaries,
      groupedArtifacts,
      stats,
    };
  }

  async updateVisibility(userId: string, dto: UpdateVisibilityDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { portfolioVisibility: dto.visibility },
    });
  }

  async setSlug(userId: string, dto: SetSlugDto) {
    const taken = await this.prisma.user.findFirst({
      where: { portfolioSlug: dto.slug, NOT: { id: userId } },
    });

    if (taken) {
      throw new ConflictException(
        'This slug is already taken. Please choose a different one.',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { portfolioSlug: dto.slug },
    });
  }

  async checkSlug(slug: string): Promise<{ available: boolean; slug: string }> {
    const taken = await this.prisma.user.findFirst({
      where: { portfolioSlug: slug },
    });
    return { available: !taken, slug };
  }

  async getMyStats(userId: string): Promise<PortfolioStats> {
    return this.buildStats(userId);
  }
}

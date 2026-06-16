import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteStageDto } from './dto/complete-stage.dto';
import { SelectPathDto } from './dto/select-path.dto';
import {
  CareerPath,
  PathWithProgress,
  RoadmapStage,
  UserPathProgress,
} from './interfaces/path.interface';
import {
  CareerPath as PrismaCareerPath,
  RoadmapStage as PrismaRoadmapStage,
  UserPathProgress as PrismaUserPathProgress,
} from '@prisma/client';

function toCareerPath(doc: PrismaCareerPath): CareerPath {
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    description: doc.description,
    tags: doc.tags,
  };
}

function toRoadmapStage(doc: PrismaRoadmapStage): RoadmapStage {
  return {
    id: doc.id,
    pathSlug: doc.pathSlug,
    stageNumber: doc.stageNumber,
    title: doc.title,
    outcomes: doc.outcomes,
    resources: doc.resources as any[],
  };
}

function toProgress(doc: PrismaUserPathProgress): UserPathProgress {
  return {
    id: doc.id,
    userId: doc.userId,
    pathSlug: doc.pathSlug,
    selectedAt: doc.selectedAt.getTime(),
    completedStages: doc.completedStages,
    isActive: doc.isActive,
  };
}

@Injectable()
export class PathsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPaths(): Promise<CareerPath[]> {
    const paths = await this.prisma.careerPath.findMany();
    return paths.map(toCareerPath);
  }

  async getPathWithRoadmap(
    slug: string,
  ): Promise<{ path: CareerPath; stages: RoadmapStage[] }> {
    const path = await this.prisma.careerPath.findUnique({ where: { slug } });
    if (!path) throw new NotFoundException('Career path not found');

    const stages = await this.prisma.roadmapStage.findMany({
      where: { pathSlug: slug },
      orderBy: { stageNumber: 'asc' },
    });

    return { path: toCareerPath(path), stages: stages.map(toRoadmapStage) };
  }

  async selectPath(
    userId: string,
    dto: SelectPathDto,
  ): Promise<UserPathProgress> {
    await this.prisma.userPathProgress.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    const progress = await this.prisma.userPathProgress.create({
      data: {
        userId,
        pathSlug: dto.pathSlug,
        completedStages: [],
        isActive: true,
      },
    });

    return toProgress(progress);
  }

  async getMyPath(userId: string): Promise<PathWithProgress> {
    const progress = await this.prisma.userPathProgress.findFirst({
      where: { userId, isActive: true },
    });
    if (!progress) {
      throw new NotFoundException('You have not selected a path yet');
    }

    const [path, stages] = await Promise.all([
      this.prisma.careerPath.findUnique({ where: { slug: progress.pathSlug } }),
      this.prisma.roadmapStage.findMany({
        where: { pathSlug: progress.pathSlug },
        orderBy: { stageNumber: 'asc' },
      }),
    ]);

    if (!path) throw new NotFoundException('Career path not found');

    const completionPercent = Math.round(
      (progress.completedStages.length / 5) * 100,
    );

    return {
      path: toCareerPath(path),
      stages: stages.map(toRoadmapStage),
      progress: toProgress(progress),
      completionPercent,
    };
  }

  async completeStage(
    userId: string,
    pathSlug: string,
    dto: CompleteStageDto,
  ): Promise<UserPathProgress> {
    const active = await this.prisma.userPathProgress.findFirst({
      where: { userId, isActive: true },
    });

    if (!active) {
      throw new BadRequestException('You have not selected a path yet');
    }

    if (active.pathSlug !== pathSlug) {
      throw new BadRequestException('This is not your active path');
    }

    if (active.completedStages.includes(dto.stageNumber)) {
      return toProgress(active);
    }

    const updated = await this.prisma.userPathProgress.update({
      where: { id: active.id },
      data: { completedStages: { push: dto.stageNumber } },
    });

    return toProgress(updated);
  }
}

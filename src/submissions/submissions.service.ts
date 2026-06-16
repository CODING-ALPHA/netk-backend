import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Submission } from './interfaces/submission.interface';
import { Submission as PrismaSubmission } from '@prisma/client';

function toSubmission(doc: PrismaSubmission): Submission {
  return {
    id: doc.id,
    taskId: doc.taskId,
    userId: doc.userId,
    evidenceLinks: doc.evidenceLinks,
    fileUrls: doc.fileUrls,
    textResponse: doc.textResponse ?? undefined,
    status: doc.status,
    reviewerNotes: doc.reviewerNotes ?? undefined,
    statusHistory: doc.statusHistory as {
      status: string;
      note?: string;
      changedAt: number;
    }[],
    submittedAt: doc.submittedAt.getTime(),
    updatedAt: doc.updatedAt.getTime(),
  };
}

function slugToReadableTag(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubmission(
    userId: string,
    dto: CreateSubmissionDto,
  ): Promise<Submission> {
    const existing = await this.prisma.submission.findFirst({
      where: { userId, taskId: dto.taskId },
    });

    if (existing && existing.status !== 'rejected') {
      throw new ConflictException('You have already submitted this task');
    }

    const task = await this.prisma.task.findUnique({
      where: { id: dto.taskId },
    });

    if (!task || task.status === 'archived') {
      throw new NotFoundException('Task not found or no longer available');
    }

    const now = new Date();
    const submission = await this.prisma.submission.create({
      data: {
        taskId: dto.taskId,
        userId,
        evidenceLinks: dto.evidenceLinks ?? [],
        fileUrls: dto.fileUrls ?? [],
        textResponse: dto.textResponse,
        status: 'submitted',
        statusHistory: [{ status: 'submitted', changedAt: now.getTime() }],
      },
    });

    return toSubmission(submission);
  }

  async getMySubmissions(userId: string): Promise<Submission[]> {
    const docs = await this.prisma.submission.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
    });
    return docs.map(toSubmission);
  }

  async getSubmissionById(
    submissionId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<Submission> {
    const doc = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!doc) throw new NotFoundException('Submission not found');

    if (!isAdmin && doc.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return toSubmission(doc);
  }

  async updateStatus(
    submissionId: string,
    dto: UpdateStatusDto,
  ): Promise<Submission> {
    const existing = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!existing) throw new NotFoundException('Submission not found');

    const now = new Date();
    const currentHistory = existing.statusHistory as {
      status: string;
      note?: string;
      changedAt: number;
    }[];
    const historyEntry = {
      status: dto.status,
      changedAt: now.getTime(),
      ...(dto.note !== undefined && { note: dto.note }),
    };

    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: dto.status,
        statusHistory: [...currentHistory, historyEntry],
        ...(dto.note !== undefined && { reviewerNotes: dto.note }),
      },
    });

    if (dto.status === 'accepted') {
      const task = await this.prisma.task.findUnique({
        where: { id: existing.taskId },
      });

      if (task) {
        const tags = [
          slugToReadableTag(task.pathSlug),
          `Stage ${task.stageNumber}`,
        ];

        await this.prisma.artifact.create({
          data: {
            submissionId,
            taskId: existing.taskId,
            userId: existing.userId,
            title: task.title,
            tags,
            evidenceLinks: existing.evidenceLinks,
            fileUrls: existing.fileUrls,
            textResponse: existing.textResponse,
          },
        });
      }
    }

    return toSubmission(updated);
  }

  async getPendingSubmissions(): Promise<Submission[]> {
    const docs = await this.prisma.submission.findMany({
      where: { status: { in: ['submitted', 'under_review'] } },
      orderBy: { submittedAt: 'asc' },
    });
    return docs.map(toSubmission);
  }
}

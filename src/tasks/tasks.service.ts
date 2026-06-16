import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from './interfaces/task.interface';
import { Task as PrismaTask } from '@prisma/client';

function toTask(doc: PrismaTask): Task {
  return {
    id: doc.id,
    pathSlug: doc.pathSlug,
    stageNumber: doc.stageNumber,
    title: doc.title,
    description: doc.description,
    deliverables: doc.deliverables,
    acceptanceCriteria: doc.acceptanceCriteria,
    difficulty: doc.difficulty,
    status: doc.status,
    createdAt: doc.createdAt.getTime(),
  };
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTasks(filters: {
    pathSlug?: string;
    stageNumber?: number;
    difficulty?: number;
    status?: string;
  }): Promise<Task[]> {
    const docs = await this.prisma.task.findMany({
      where: {
        ...(filters.pathSlug && { pathSlug: filters.pathSlug }),
        ...(filters.stageNumber !== undefined && {
          stageNumber: filters.stageNumber,
        }),
        ...(filters.difficulty !== undefined && {
          difficulty: filters.difficulty,
        }),
        ...(filters.status && { status: filters.status }),
      },
    });
    return docs.map(toTask);
  }

  async getTaskById(taskId: string): Promise<Task> {
    const doc = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!doc) throw new NotFoundException('Task not found');
    return toTask(doc);
  }

  async getTasksByStage(pathSlug: string, stageNumber: number): Promise<Task[]> {
    const docs = await this.prisma.task.findMany({
      where: { pathSlug, stageNumber },
    });
    return docs.map(toTask);
  }
}

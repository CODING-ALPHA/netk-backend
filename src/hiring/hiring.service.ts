import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleOpening } from '../companies/interfaces/company.interface';
import { CreateRoleOpeningDto } from './dto/create-role-opening.dto';
import { UpdateRoleOpeningDto } from './dto/update-role-opening.dto';
import { CreateShortlistDto } from './dto/create-shortlist.dto';
import { SendContactRequestDto } from './dto/send-contact-request.dto';
import { SearchTalentDto } from './dto/search-talent.dto';
import { RespondContactRequestDto } from './dto/respond-contact-request.dto';
import {
  ContactRequest,
  ShortlistEntry,
  TalentResult,
} from './interfaces/hiring.interface';
import {
  RoleOpening as PrismaRoleOpening,
  Shortlist as PrismaShortlist,
  ContactRequest as PrismaContactRequest,
} from '@prisma/client';

function toRoleOpening(r: PrismaRoleOpening): RoleOpening {
  return {
    id: r.id,
    companyId: r.companyId,
    title: r.title,
    description: r.description,
    tags: r.tags,
    pathSlugs: r.pathSlugs,
    experienceLevel: r.experienceLevel ?? undefined,
    region: r.region ?? undefined,
    status: r.status,
    createdAt: r.createdAt.getTime(),
    updatedAt: r.updatedAt.getTime(),
  };
}

function toShortlistEntry(s: PrismaShortlist): ShortlistEntry {
  return {
    id: s.id,
    companyId: s.companyId,
    userId: s.userId,
    roleOpeningId: s.roleOpeningId ?? undefined,
    note: s.note ?? undefined,
    createdAt: s.createdAt.getTime(),
  };
}

function toContactRequest(c: PrismaContactRequest): ContactRequest {
  return {
    id: c.id,
    companyId: c.companyId,
    userId: c.userId,
    roleOpeningId: c.roleOpeningId ?? undefined,
    message: c.message,
    status: c.status,
    statusHistory: c.statusHistory as { status: string; changedAt: number }[],
    sentAt: c.sentAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
  };
}

@Injectable()
export class HiringService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Role Openings ──────────────────────────────────────────────────────────

  async createRoleOpening(
    companyId: string,
    dto: CreateRoleOpeningDto,
  ): Promise<RoleOpening> {
    const role = await this.prisma.roleOpening.create({
      data: {
        companyId,
        title: dto.title,
        description: dto.description,
        tags: dto.tags,
        pathSlugs: dto.pathSlugs,
        experienceLevel: dto.experienceLevel,
        region: dto.region,
      },
    });
    return toRoleOpening(role);
  }

  async updateRoleOpening(
    companyId: string,
    roleOpeningId: string,
    dto: UpdateRoleOpeningDto,
  ): Promise<RoleOpening> {
    const role = await this.prisma.roleOpening.findUnique({
      where: { id: roleOpeningId },
    });

    if (!role || role.companyId !== companyId) {
      throw new NotFoundException('Role opening not found');
    }

    const updated = await this.prisma.roleOpening.update({
      where: { id: roleOpeningId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.pathSlugs !== undefined && { pathSlugs: dto.pathSlugs }),
        ...(dto.experienceLevel !== undefined && {
          experienceLevel: dto.experienceLevel,
        }),
        ...(dto.region !== undefined && { region: dto.region }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });

    return toRoleOpening(updated);
  }

  async publishRoleOpening(
    companyId: string,
    roleOpeningId: string,
  ): Promise<RoleOpening> {
    const role = await this.prisma.roleOpening.findUnique({
      where: { id: roleOpeningId },
    });

    if (!role || role.companyId !== companyId) {
      throw new NotFoundException('Role opening not found');
    }

    const updated = await this.prisma.roleOpening.update({
      where: { id: roleOpeningId },
      data: { status: 'open' },
    });

    return toRoleOpening(updated);
  }

  async closeRoleOpening(
    companyId: string,
    roleOpeningId: string,
  ): Promise<RoleOpening> {
    const role = await this.prisma.roleOpening.findUnique({
      where: { id: roleOpeningId },
    });

    if (!role || role.companyId !== companyId) {
      throw new NotFoundException('Role opening not found');
    }

    const updated = await this.prisma.roleOpening.update({
      where: { id: roleOpeningId },
      data: { status: 'closed' },
    });

    return toRoleOpening(updated);
  }

  async getMyRoleOpenings(companyId: string): Promise<RoleOpening[]> {
    const roles = await this.prisma.roleOpening.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return roles.map(toRoleOpening);
  }

  async getOpenRoleOpenings(): Promise<RoleOpening[]> {
    const roles = await this.prisma.roleOpening.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'desc' },
    });
    return roles.map(toRoleOpening);
  }

  // ── Talent Search ──────────────────────────────────────────────────────────

  async searchTalent(dto: SearchTalentDto): Promise<TalentResult[]> {
    const users = await this.prisma.user.findMany({
      where: {
        portfolioVisibility: 'public',
        ...(dto.experienceLevel && { experienceLevel: dto.experienceLevel }),
        ...(dto.region && { region: dto.region }),
        ...(dto.tags?.length && { careerInterests: { hasSome: dto.tags } }),
      },
      include: {
        artifacts: { select: { id: true } },
        pathProgress: { where: { isActive: true } },
      },
      take: 50,
    });

    const results: TalentResult[] = [];

    for (const user of users) {
      const activeProgress = user.pathProgress[0] ?? null;
      const artifactCount = user.artifacts.length;
      const completedStages = activeProgress?.completedStages.length ?? 0;
      const activePathSlug = activeProgress?.pathSlug;

      if (dto.minArtifacts !== undefined && artifactCount < dto.minArtifacts) {
        continue;
      }
      if (
        dto.minStagesCompleted !== undefined &&
        completedStages < dto.minStagesCompleted
      ) {
        continue;
      }
      if (
        dto.pathSlugs?.length &&
        (!activePathSlug || !dto.pathSlugs.includes(activePathSlug))
      ) {
        continue;
      }

      results.push({
        userId: user.id,
        region: user.region ?? undefined,
        experienceLevel: user.experienceLevel ?? undefined,
        careerInterests: user.careerInterests,
        portfolioSlug: user.portfolioSlug ?? undefined,
        artifactCount,
        completedStages,
        activePathSlug,
      });
    }

    return results;
  }

  // ── Shortlist ──────────────────────────────────────────────────────────────

  async shortlistCandidate(
    companyId: string,
    dto: CreateShortlistDto,
  ): Promise<ShortlistEntry> {
    const candidate = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!candidate || candidate.portfolioVisibility !== 'public') {
      throw new NotFoundException('Candidate not found');
    }

    const existing = await this.prisma.shortlist.findFirst({
      where: {
        companyId,
        userId: dto.userId,
        roleOpeningId: dto.roleOpeningId ?? null,
      },
    });

    if (existing) throw new ConflictException('Candidate already shortlisted');

    const entry = await this.prisma.shortlist.create({
      data: {
        companyId,
        userId: dto.userId,
        roleOpeningId: dto.roleOpeningId,
        note: dto.note,
      },
    });

    return toShortlistEntry(entry);
  }

  async removeFromShortlist(
    companyId: string,
    shortlistId: string,
  ): Promise<{ message: string }> {
    const entry = await this.prisma.shortlist.findUnique({
      where: { id: shortlistId },
    });

    if (!entry || entry.companyId !== companyId) {
      throw new NotFoundException('Shortlist entry not found');
    }

    await this.prisma.shortlist.delete({ where: { id: shortlistId } });
    return { message: 'Removed from shortlist' };
  }

  async getMyShortlist(companyId: string): Promise<ShortlistEntry[]> {
    const entries = await this.prisma.shortlist.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return entries.map(toShortlistEntry);
  }

  // ── Contact Requests ───────────────────────────────────────────────────────

  async sendContactRequest(
    companyId: string,
    dto: SendContactRequestDto,
  ): Promise<ContactRequest> {
    const existing = await this.prisma.contactRequest.findFirst({
      where: { companyId, userId: dto.userId, status: 'pending' },
    });

    if (existing) {
      throw new ConflictException(
        'A contact request is already pending for this candidate',
      );
    }

    const now = new Date();
    const request = await this.prisma.contactRequest.create({
      data: {
        companyId,
        userId: dto.userId,
        roleOpeningId: dto.roleOpeningId,
        message: dto.message,
        status: 'pending',
        statusHistory: [{ status: 'pending', changedAt: now.getTime() }],
      },
    });

    return toContactRequest(request);
  }

  async getMyContactRequests(companyId: string): Promise<ContactRequest[]> {
    const requests = await this.prisma.contactRequest.findMany({
      where: { companyId },
      orderBy: { sentAt: 'desc' },
    });
    return requests.map(toContactRequest);
  }

  async getMyIncomingRequests(userId: string): Promise<ContactRequest[]> {
    const requests = await this.prisma.contactRequest.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
    });
    return requests.map(toContactRequest);
  }

  async respondToContactRequest(
    userId: string,
    contactRequestId: string,
    dto: RespondContactRequestDto,
  ): Promise<ContactRequest> {
    const request = await this.prisma.contactRequest.findUnique({
      where: { id: contactRequestId },
    });

    if (!request) throw new NotFoundException('Contact request not found');

    if (request.userId !== userId) {
      throw new ForbiddenException('This request is not for you');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This request has already been responded to');
    }

    const now = new Date();
    const currentHistory = request.statusHistory as {
      status: string;
      changedAt: number;
    }[];

    const updated = await this.prisma.contactRequest.update({
      where: { id: contactRequestId },
      data: {
        status: dto.status,
        statusHistory: [
          ...currentHistory,
          { status: dto.status, changedAt: now.getTime() },
        ],
      },
    });

    return toContactRequest(updated);
  }
}

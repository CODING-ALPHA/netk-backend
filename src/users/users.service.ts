import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

type PublicProfile = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  region?: string;
  experienceLevel?: string;
  careerInterests: string[];
  role?: string;
  portfolioVisibility?: string;
  portfolioSlug?: string;
  ikigaiProfile: boolean;
  createdAt: number;
};

function toPublicProfile(
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    region: string | null;
    experienceLevel: string | null;
    careerInterests: string[];
    role: string | null;
    portfolioVisibility: string | null;
    portfolioSlug: string | null;
    createdAt: Date;
  },
  hasIkigaiProfile: boolean,
): PublicProfile {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    bio: user.bio ?? undefined,
    region: user.region ?? undefined,
    experienceLevel: user.experienceLevel ?? undefined,
    careerInterests: user.careerInterests,
    role: user.role ?? undefined,
    portfolioVisibility: user.portfolioVisibility ?? undefined,
    portfolioSlug: user.portfolioSlug ?? undefined,
    ikigaiProfile: hasIkigaiProfile,
    createdAt: user.createdAt.getTime(),
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<PublicProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { ikigaiProfiles: { take: 1, orderBy: { createdAt: 'desc' } } },
    });
    if (!user) throw new NotFoundException('User not found');
    return toPublicProfile(user, user.ikigaiProfiles.length > 0);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<PublicProfile> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.region !== undefined && { region: dto.region }),
        ...(dto.experienceLevel !== undefined && {
          experienceLevel: dto.experienceLevel,
        }),
        ...(dto.careerInterests !== undefined && {
          careerInterests: dto.careerInterests,
        }),
      },
      include: { ikigaiProfiles: { take: 1, orderBy: { createdAt: 'desc' } } },
    });
    return toPublicProfile(user, user.ikigaiProfiles.length > 0);
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './interfaces/company.interface';
import { Company as PrismaCompany } from '@prisma/client';

function toCompany(c: PrismaCompany): Company {
  return {
    id: c.id,
    userId: c.userId,
    name: c.name,
    description: c.description,
    website: c.website ?? undefined,
    industry: c.industry ?? undefined,
    size: c.size ?? undefined,
    verifiedStatus: c.verifiedStatus,
    createdAt: c.createdAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
  };
}

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(userId: string, dto: CreateCompanyDto): Promise<Company> {
    const existing = await this.prisma.company.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('You already have a company profile');

    const company = await this.prisma.company.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        website: dto.website,
        industry: dto.industry,
        size: dto.size,
      },
    });

    return toCompany(company);
  }

  async updateCompany(userId: string, dto: UpdateCompanyDto): Promise<Company> {
    const existing = await this.prisma.company.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('Company profile not found');

    const company = await this.prisma.company.update({
      where: { id: existing.id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.industry !== undefined && { industry: dto.industry }),
        ...(dto.size !== undefined && { size: dto.size }),
      },
    });

    return toCompany(company);
  }

  async getMyCompany(userId: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { userId } });
    if (!company) throw new NotFoundException('Company profile not found');
    return toCompany(company);
  }
}

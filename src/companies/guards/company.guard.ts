import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.userId;

    if (!userId) {
      throw new ForbiddenException('Authentication required');
    }

    const company = await this.prisma.company.findUnique({ where: { userId } });

    if (!company) {
      throw new ForbiddenException('You must create a company profile first');
    }

    request.company = company;
    return true;
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  createCompany(@Request() req: any, @Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(req.user.userId, dto);
  }

  @Get('me')
  getMyCompany(@Request() req: any) {
    return this.companiesService.getMyCompany(req.user.userId);
  }

  @Patch('me')
  updateCompany(@Request() req: any, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.updateCompany(req.user.userId, dto);
  }

  @Get('admin/all')
  getAllCompaniesAdmin(@Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Admin only');
    }
    return this.companiesService.getAllCompanies();
  }
}

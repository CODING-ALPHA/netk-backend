import {
  Body,
  Controller,
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
}

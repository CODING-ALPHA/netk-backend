import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyGuard } from './guards/company.guard';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyGuard],
  exports: [CompanyGuard],
})
export class CompaniesModule {}

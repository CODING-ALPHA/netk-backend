import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CompanyGuard } from '../companies/guards/company.guard';
import { CreateRoleOpeningDto } from './dto/create-role-opening.dto';
import { UpdateRoleOpeningDto } from './dto/update-role-opening.dto';
import { CreateShortlistDto } from './dto/create-shortlist.dto';
import { SendContactRequestDto } from './dto/send-contact-request.dto';
import { SearchTalentDto } from './dto/search-talent.dto';
import { RespondContactRequestDto } from './dto/respond-contact-request.dto';
import { HiringService } from './hiring.service';

@Controller('hiring')
export class HiringController {
  constructor(private readonly hiringService: HiringService) {}

  // ── Public: open role openings ─────────────────────────────────────────────

  @Public()
  @Get('roles/open')
  getOpenRoleOpenings() {
    return this.hiringService.getOpenRoleOpenings();
  }

  @Public()
  @Get('roles/open/:id')
  getOpenRoleOpeningById(@Param('id') id: string) {
    return this.hiringService.getOpenRoleOpeningById(id);
  }

  // ── Admin: Role openings ───────────────────────────────────────────────────

  @Get('admin/roles')
  getAllRolesAdmin(@Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Admin only');
    }
    return this.hiringService.getAllRolesAdmin();
  }

  @Post('admin/roles')
  createRoleOpeningAdmin(
    @Request() req: any,
    @Body() dto: CreateRoleOpeningDto & { companyId: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Admin only');
    }
    return this.hiringService.createRoleOpeningAdmin(dto);
  }

  // ── Role openings (company side) ───────────────────────────────────────────

  @UseGuards(CompanyGuard)
  @Post('roles')
  createRoleOpening(@Request() req: any, @Body() dto: CreateRoleOpeningDto) {
    return this.hiringService.createRoleOpening(req.company.id, dto);
  }

  @UseGuards(CompanyGuard)
  @Get('roles')
  getMyRoleOpenings(@Request() req: any) {
    return this.hiringService.getMyRoleOpenings(req.company.id);
  }

  @UseGuards(CompanyGuard)
  @Patch('roles/:id')
  updateRoleOpening(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateRoleOpeningDto,
  ) {
    return this.hiringService.updateRoleOpening(req.company.id, id, dto);
  }

  @UseGuards(CompanyGuard)
  @Patch('roles/:id/publish')
  publishRoleOpening(@Request() req: any, @Param('id') id: string) {
    return this.hiringService.publishRoleOpening(req.company.id, id);
  }

  @UseGuards(CompanyGuard)
  @Patch('roles/:id/close')
  closeRoleOpening(@Request() req: any, @Param('id') id: string) {
    return this.hiringService.closeRoleOpening(req.company.id, id);
  }

  // ── Talent search ──────────────────────────────────────────────────────────

  @UseGuards(CompanyGuard)
  @Get('talent/search')
  searchTalent(@Query() dto: SearchTalentDto) {
    return this.hiringService.searchTalent(dto);
  }

  // ── Shortlist ──────────────────────────────────────────────────────────────

  @UseGuards(CompanyGuard)
  @Post('shortlist')
  shortlistCandidate(@Request() req: any, @Body() dto: CreateShortlistDto) {
    return this.hiringService.shortlistCandidate(req.company.id, dto);
  }

  @UseGuards(CompanyGuard)
  @Get('shortlist')
  getMyShortlist(@Request() req: any) {
    return this.hiringService.getMyShortlist(req.company.id);
  }

  @UseGuards(CompanyGuard)
  @Delete('shortlist/:id')
  removeFromShortlist(@Request() req: any, @Param('id') id: string) {
    return this.hiringService.removeFromShortlist(req.company.id, id);
  }

  // ── Contact requests (company sends) ──────────────────────────────────────

  @UseGuards(CompanyGuard)
  @Post('contact')
  sendContactRequest(@Request() req: any, @Body() dto: SendContactRequestDto) {
    return this.hiringService.sendContactRequest(req.company.id, dto);
  }

  @UseGuards(CompanyGuard)
  @Get('contact/sent')
  getMyContactRequests(@Request() req: any) {
    return this.hiringService.getMyContactRequests(req.company.id);
  }

  // ── Contact requests (user receives) ──────────────────────────────────────

  @Get('contact/inbox')
  getMyIncomingRequests(@Request() req: any) {
    return this.hiringService.getMyIncomingRequests(req.user.userId);
  }

  @Patch('contact/:id/respond')
  respondToContactRequest(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: RespondContactRequestDto,
  ) {
    return this.hiringService.respondToContactRequest(req.user.userId, id, dto);
  }
}

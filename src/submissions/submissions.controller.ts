import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  createSubmission(@Request() req: any, @Body() dto: CreateSubmissionDto) {
    return this.submissionsService.createSubmission(req.user.userId, dto);
  }

  @Get('me')
  getMySubmissions(@Request() req: any) {
    return this.submissionsService.getMySubmissions(req.user.userId);
  }

  @Get('admin/pending')
  getPendingSubmissions(@Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Admin only');
    }
    return this.submissionsService.getPendingSubmissions();
  }

  @Get(':id')
  getSubmissionById(@Request() req: any, @Param('id') id: string) {
    const isAdmin = req.user.role === 'admin';
    return this.submissionsService.getSubmissionById(
      id,
      req.user.userId,
      isAdmin,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Admin only');
    }
    return this.submissionsService.updateStatus(id, dto);
  }
}

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { AssessmentService } from './assessment.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Public()
  @Get('questions')
  getQuestions() {
    return this.assessmentService.getQuestions();
  }

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  submitAssessment(@Request() req: any, @Body() dto: SubmitAssessmentDto) {
    return this.assessmentService.submitAssessment(req.user.userId, dto);
  }

  @Get('latest')
  getLatest(@Request() req: any) {
    return this.assessmentService.getLatestAssessment(req.user.userId);
  }

  @Get('history')
  getHistory(@Request() req: any) {
    return this.assessmentService.getAssessmentHistory(req.user.userId);
  }
}

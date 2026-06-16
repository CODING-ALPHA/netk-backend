import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CompleteStageDto } from './dto/complete-stage.dto';
import { SelectPathDto } from './dto/select-path.dto';
import { PathsService } from './paths.service';

@Controller('paths')
export class PathsController {
  constructor(private readonly pathsService: PathsService) {}

  @Public()
  @Get()
  getAllPaths() {
    return this.pathsService.getAllPaths();
  }

  @Public()
  @Get(':slug')
  getPath(@Param('slug') slug: string) {
    return this.pathsService.getPathWithRoadmap(slug);
  }

  @Post('select')
  @HttpCode(HttpStatus.CREATED)
  selectPath(@Request() req: any, @Body() dto: SelectPathDto) {
    return this.pathsService.selectPath(req.user.userId, dto);
  }

  @Get('me/active')
  getMyPath(@Request() req: any) {
    return this.pathsService.getMyPath(req.user.userId);
  }

  @Patch(':slug/stage/:stageNumber/complete')
  completeStage(
    @Request() req: any,
    @Param('slug') slug: string,
    @Param('stageNumber', ParseIntPipe) stageNumber: number,
    ) {
    const dto: CompleteStageDto = { stageNumber };
    return this.pathsService.completeStage(req.user.userId, slug, dto);
  }
}

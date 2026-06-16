import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Public()
  @Get()
  getAllTasks(
    @Query('pathSlug') pathSlug?: string,
    @Query('stageNumber') stageNumber?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    const filters: {
      pathSlug?: string;
      stageNumber?: number;
      difficulty?: number;
    } = {};

    if (pathSlug) filters.pathSlug = pathSlug;
    if (stageNumber) filters.stageNumber = parseInt(stageNumber, 10);
    if (difficulty) filters.difficulty = parseInt(difficulty, 10);

    return this.tasksService.getAllTasks(filters);
  }

  @Public()
  @Get('stage/:pathSlug/:stageNumber')
  getTasksByStage(
    @Param('pathSlug') pathSlug: string,
    @Param('stageNumber', ParseIntPipe) stageNumber: number,
  ) {
    return this.tasksService.getTasksByStage(pathSlug, stageNumber);
  }

  @Public()
  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }
}

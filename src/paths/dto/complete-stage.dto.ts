import { IsInt, Max, Min } from 'class-validator';

export class CompleteStageDto {
  @IsInt()
  @Min(1)
  @Max(5)
  stageNumber: number;
}

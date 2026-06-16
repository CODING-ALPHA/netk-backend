import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['under_review', 'accepted', 'needs_changes', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

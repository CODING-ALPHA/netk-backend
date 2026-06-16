import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateRoleOpeningDto } from './create-role-opening.dto';

export class UpdateRoleOpeningDto extends PartialType(CreateRoleOpeningDto) {
  @IsOptional()
  @IsIn(['open', 'closed', 'draft'])
  status?: string;
}

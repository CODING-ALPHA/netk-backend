import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateVisibilityDto {
  @IsNotEmpty()
  @IsIn(['public', 'private'])
  visibility: string;
}

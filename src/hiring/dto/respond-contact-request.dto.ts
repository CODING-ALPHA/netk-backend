import { IsIn, IsNotEmpty } from 'class-validator';

export class RespondContactRequestDto {
  @IsNotEmpty()
  @IsIn(['accepted', 'declined'])
  status: string;
}

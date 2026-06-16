import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SendContactRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  roleOpeningId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  message: string;
}

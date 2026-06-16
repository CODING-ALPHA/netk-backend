import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateShortlistDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  roleOpeningId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;
}

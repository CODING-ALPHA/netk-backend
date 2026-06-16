import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const VALID_REGIONS = [
  'West Africa',
  'East Africa',
  'Europe',
  'North America',
  'South Asia',
  'Southeast Asia',
  'Latin America',
  'Middle East',
] as const;

const VALID_EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
] as const;

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @IsIn(VALID_REGIONS, { message: 'Invalid region' })
  region?: string;

  @IsOptional()
  @IsString()
  @IsIn(VALID_EXPERIENCE_LEVELS, { message: 'Invalid experience level' })
  experienceLevel?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one career interest is required' })
  careerInterests?: string[];
}

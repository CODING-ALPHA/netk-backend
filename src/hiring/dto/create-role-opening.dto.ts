import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const VALID_PATH_SLUGS = [
  'product-design',
  'frontend-engineering',
  'data-analysis',
  'product-management',
  'content-strategy',
];

export class CreateRoleOpeningDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @ArrayMaxSize(5)
  @IsIn(VALID_PATH_SLUGS, { each: true })
  pathSlugs: string[];

  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced'])
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  region?: string;
}

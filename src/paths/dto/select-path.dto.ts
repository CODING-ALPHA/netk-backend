import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const VALID_SLUGS = [
  'product-design',
  'frontend-engineering',
  'data-analysis',
  'product-management',
  'content-strategy',
] as const;

export class SelectPathDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_SLUGS, {
    message: `pathSlug must be one of: ${VALID_SLUGS.join(', ')}`,
  })
  pathSlug: string;
}

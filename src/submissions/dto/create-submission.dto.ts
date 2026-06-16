import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsUrl,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneEvidence', async: false })
class AtLeastOneEvidenceConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments) {
    const obj = args.object as CreateSubmissionDto;
    const hasLinks =
      Array.isArray(obj.evidenceLinks) && obj.evidenceLinks.length > 0;
    const hasFiles = Array.isArray(obj.fileUrls) && obj.fileUrls.length > 0;
    const hasText =
      typeof obj.textResponse === 'string' && obj.textResponse.trim().length > 0;
    return hasLinks || hasFiles || hasText;
  }

  defaultMessage() {
    return 'At least one form of evidence is required: evidenceLinks, fileUrls, or textResponse';
  }
}

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  evidenceLinks?: string[];

  @IsOptional()
  @IsArray()
  fileUrls?: string[];

  @IsOptional()
  @IsString()
  textResponse?: string;

  @Validate(AtLeastOneEvidenceConstraint)
  _validate?: string;
}

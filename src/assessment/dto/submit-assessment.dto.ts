import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class LoveAnswerEntryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^love_/, { message: 'questionId must belong to the love section (prefix: love_)' })
  questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  answer: number;
}

class StrengthsAnswerEntryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^strengths_/, { message: 'questionId must belong to the strengths section (prefix: strengths_)' })
  questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  answer: number;
}

class WorldNeedsAnswerEntryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^worldNeeds_/, { message: 'questionId must belong to the worldNeeds section (prefix: worldNeeds_)' })
  questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  answer: number;
}

class PaidSkillsAnswerEntryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^paidSkills_/, { message: 'questionId must belong to the paidSkills section (prefix: paidSkills_)' })
  questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  answer: number;
}

export class SectionAnswersDto {
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => LoveAnswerEntryDto)
  love: LoveAnswerEntryDto[];

  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => StrengthsAnswerEntryDto)
  strengths: StrengthsAnswerEntryDto[];

  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => WorldNeedsAnswerEntryDto)
  worldNeeds: WorldNeedsAnswerEntryDto[];

  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => PaidSkillsAnswerEntryDto)
  paidSkills: PaidSkillsAnswerEntryDto[];
}

export class SubmitAssessmentDto {
  @ValidateNested()
  @Type(() => SectionAnswersDto)
  answers: SectionAnswersDto;
}

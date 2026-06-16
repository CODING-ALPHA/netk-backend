import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';
import { CAREER_PATHS } from './data/career-paths.data';
import { QUESTIONS } from './data/questions.data';
import { SectionAnswersDto, SubmitAssessmentDto } from './dto/submit-assessment.dto';
import {
  IkigaiProfile,
  Recommendation,
  SectionAnswers,
  SectionScores,
} from './interfaces/assessment.interface';
import { IkigaiProfile as PrismaIkigaiProfile } from '@prisma/client';

function toProfile(doc: PrismaIkigaiProfile): IkigaiProfile {
  return {
    id: doc.id,
    userId: doc.userId,
    answers: doc.answers as unknown as SectionAnswers,
    scores: doc.scores as unknown as SectionScores,
    recommendations: doc.recommendations as unknown as Recommendation[],
    version: doc.version,
    createdAt: doc.createdAt.getTime(),
  };
}

@Injectable()
export class AssessmentService {
  private readonly gemini: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor(private readonly prisma: PrismaService) {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.gemini = client.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  getQuestions() {
    return { sections: QUESTIONS };
  }

  private calculateScores(answers: SectionAnswersDto): SectionScores {
    const sumSection = (entries: { answer: number }[]) =>
      entries.reduce((acc, e) => acc + e.answer, 0);

    const MAX = 25;
    return {
      love: Math.round((sumSection(answers.love) / MAX) * 100),
      strengths: Math.round((sumSection(answers.strengths) / MAX) * 100),
      worldNeeds: Math.round((sumSection(answers.worldNeeds) / MAX) * 100),
      paidSkills: Math.round((sumSection(answers.paidSkills) / MAX) * 100),
    };
  }

  private async getRecommendations(
    scores: SectionScores,
  ): Promise<Recommendation[]> {
    const pathList = CAREER_PATHS.map(
      (p) => `- ${p.id}: ${p.name} — ${p.description}`,
    ).join('\n');

    const userMessage =
      `Scores: love=${scores.love}, strengths=${scores.strengths}, ` +
      `worldNeeds=${scores.worldNeeds}, paidSkills=${scores.paidSkills}\n\n` +
      `Available paths:\n${pathList}\n\n` +
      `Return the top 3 paths as a JSON array.`;

    const systemPrompt =
      'You are a career advisor specialising in the Ikigai framework. ' +
      'You will be given assessment scores across four dimensions scored ' +
      '0 to 100. Based on these scores, recommend exactly 3 career paths ' +
      'from the provided list. Return your response as a JSON array only. ' +
      'No explanation, no markdown, no preamble. Just the raw JSON array. ' +
      'Each item must have: pathId (string), pathName (string), ' +
      'confidence (number 0-100), reasoning (string, 2 sentences max).';

    const result = await this.gemini.generateContent(
      `${systemPrompt}\n\n${userMessage}`,
    );

    const rawText = result.response.text();

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    try {
      return JSON.parse(cleaned) as Recommendation[];
    } catch (err) {
      console.error('Failed to parse Gemini recommendations:', rawText, err);
      throw new InternalServerErrorException(
        'Failed to generate recommendations. Please try again.',
      );
    }
  }

  async submitAssessment(
    userId: string,
    dto: SubmitAssessmentDto,
  ): Promise<IkigaiProfile> {
    let scores: SectionScores;
    let recommendations: Recommendation[];

    try {
      scores = this.calculateScores(dto.answers);
    } catch (err) {
      console.error('Score calculation error:', err);
      throw new InternalServerErrorException(
        'Failed to process assessment. Please try again.',
      );
    }

    try {
      recommendations = await this.getRecommendations(scores);
    } catch (err) {
      if (err instanceof InternalServerErrorException) throw err;
      console.error('Gemini API error:', err);
      throw new InternalServerErrorException(
        'Failed to generate recommendations. Please try again.',
      );
    }

    try {
      const version = await this.prisma.ikigaiProfile.count({ where: { userId } });
      const profile = await this.prisma.ikigaiProfile.create({
        data: {
          userId,
          answers: dto.answers as object,
          scores: scores as object,
          recommendations: recommendations as object[],
          version: version + 1,
        },
      });
      return toProfile(profile);
    } catch (err) {
      console.error('Prisma create error:', err);
      throw new InternalServerErrorException(
        'Failed to save assessment. Please try again.',
      );
    }
  }

  async getLatestAssessment(userId: string): Promise<IkigaiProfile> {
    const profile = await this.prisma.ikigaiProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!profile) throw new NotFoundException('No assessment found for this user');
    return toProfile(profile);
  }

  async getAssessmentHistory(userId: string): Promise<IkigaiProfile[]> {
    const profiles = await this.prisma.ikigaiProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return profiles.map(toProfile);
  }
}

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

  async getQuestions() {
    const prompt =
      'Generate 20 career assessment questions using the Ikigai framework. ' +
      'Divide them into exactly 4 sections (5 questions per section) corresponding to these IDs:\n' +
      '- "love": Passion (What you love / activities that excite you)\n' +
      '- "strengths": Strengths (What you are good at / skills that come naturally)\n' +
      '- "worldNeeds": Mission (What the world needs / problems you care about solving)\n' +
      '- "paidSkills": Vocation (What you can be paid for / skills with commercial value)\n\n' +
      'Each question must be a short, first-person statement (e.g. "I enjoy solving complex problems"). ' +
      'Return your response as a JSON object matching this structure:\n' +
      '{\n' +
      '  "sections": [\n' +
      '    {\n' +
      '      "id": "love" | "strengths" | "worldNeeds" | "paidSkills",\n' +
      '      "label": "string",\n' +
      '      "description": "string",\n' +
      '      "questions": [\n' +
      '        { "id": "love_1" | "strengths_1" | "worldNeeds_1" | "paidSkills_1" (must be prefixed by section id and underscore), "text": "string" }\n' +
      '      ]\n' +
      '    }\n' +
      '  ]\n' +
      '}\n' +
      'Output ONLY valid JSON, with no markdown code blocks or extra text.';

    try {
      const result = await this.gemini.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      
      const data = JSON.parse(cleaned);
      if (data && Array.isArray(data.sections)) {
        data.sections = data.sections.map((section: any) => {
          if (section && typeof section.id === 'string' && Array.isArray(section.questions)) {
            const prefix = section.id + '_';
            section.questions = section.questions.map((q: any, idx: number) => {
              let newId = q?.id;
              if (typeof newId !== 'string' || !newId.startsWith(prefix)) {
                newId = `${prefix}${idx + 1}`;
              }
              return {
                ...q,
                id: newId,
              };
            });
          }
          return section;
        });
      }
      return data;
    } catch (err) {
      console.error('Failed to generate questions via Gemini, falling back to static questions:', err);
      return { sections: QUESTIONS };
    }
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
      `Generate the step-by-step chain-of-thought analysis and output the final JSON recommendations object.`;

    const systemPrompt =
      'You are a career advisor specialising in the Ikigai framework. ' +
      'Analyze the user\'s scores across the four dimensions. ' +
      'First, perform a step-by-step chain-of-thought analysis of how these scores align with various career paths. ' +
      'Then, recommend exactly 3 career paths from the provided list. ' +
      'Return your response as a JSON object matching this structure:\n' +
      '{\n' +
      '  "chainOfThought": "A detailed step-by-step reasoning explaining how you analyzed the scores,",\n' +
      '  "recommendations": [\n' +
      '    { "pathId": "string", "pathName": "string", "confidence": number, "reasoning": "2 sentences max" }\n' +
      '  ]\n' +
      '}\n' +
      'Output ONLY valid JSON, with no markdown code blocks or extra text.';

    const result = await this.gemini.generateContent(
      `${systemPrompt}\n\n${userMessage}`,
    );

    const rawText = result.response.text();

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      return parsed.recommendations as Recommendation[];
    } catch (err) {
      console.error('Failed to parse Gemini recommendations:', rawText, err);
      throw new InternalServerErrorException(
        'Failed to generate recommendations. Please try again.',
      );
    }
  }

  private getFallbackRecommendations(scores: SectionScores): Recommendation[] {
    const dimensions = [
      { id: 'love', score: scores.love },
      { id: 'strengths', score: scores.strengths },
      { id: 'worldNeeds', score: scores.worldNeeds },
      { id: 'paidSkills', score: scores.paidSkills },
    ];
    dimensions.sort((a, b) => b.score - a.score);
    const topDimension = dimensions[0].id;

    let recommendations: Recommendation[] = [];
    if (topDimension === 'love') {
      recommendations = [
        {
          pathId: 'product-design',
          pathName: 'Product Design',
          confidence: 85,
          reasoning: 'Your strong score in what you love points to creative digital design.',
        },
        {
          pathId: 'content-strategy',
          pathName: 'Content Strategy',
          confidence: 80,
          reasoning: 'Your passion for activities that excite you aligns well with building brand content and strategy.',
        },
        {
          pathId: 'digital-marketing',
          pathName: 'Digital Marketing',
          confidence: 75,
          reasoning: 'Creative growth and user engagement paths are highly suited for your profile.',
        },
      ];
    } else if (topDimension === 'strengths') {
      recommendations = [
        {
          pathId: 'frontend-engineering',
          pathName: 'Frontend Engineering',
          confidence: 90,
          reasoning: 'Your high strength score indicates potential in constructing visual web interfaces and software.',
        },
        {
          pathId: 'backend-engineering',
          pathName: 'Backend Engineering',
          confidence: 85,
          reasoning: 'Technical strengths are highly transferable to building database structures and server APIs.',
        },
        {
          pathId: 'machine-learning-engineering',
          pathName: 'Machine Learning Engineering',
          confidence: 80,
          reasoning: 'Analytical and technical strengths fit perfectly with machine learning systems development.',
        },
      ];
    } else if (topDimension === 'worldNeeds') {
      recommendations = [
        {
          pathId: 'product-management',
          pathName: 'Product Management',
          confidence: 85,
          reasoning: 'Your desire to solve user and organisational problems is ideal for managing product roadmaps.',
        },
        {
          pathId: 'cybersecurity',
          pathName: 'Cybersecurity',
          confidence: 80,
          reasoning: 'Focusing on security and protecting systems fits well with addressing critical digital needs.',
        },
        {
          pathId: 'cloud-engineering',
          pathName: 'Cloud Engineering',
          confidence: 75,
          reasoning: 'Deploying scalable platforms serves key technological requirements globally.',
        },
      ];
    } else { // paidSkills
      recommendations = [
        {
          pathId: 'data-analysis',
          pathName: 'Data Analysis',
          confidence: 88,
          reasoning: 'Commercial skills align heavily with data insights and business intelligence paths.',
        },
        {
          pathId: 'product-management',
          pathName: 'Product Management',
          confidence: 82,
          reasoning: 'Bridging tech skills and business value supports strategic product direction roles.',
        },
        {
          pathId: 'frontend-engineering',
          pathName: 'Frontend Engineering',
          confidence: 78,
          reasoning: 'Developing frontend assets matches high-demand commercial market opportunities.',
        },
      ];
    }
    return recommendations;
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
      console.warn('Failed to fetch recommendations from Gemini, using deterministic fallback recommendations:', err);
      recommendations = this.getFallbackRecommendations(scores);
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

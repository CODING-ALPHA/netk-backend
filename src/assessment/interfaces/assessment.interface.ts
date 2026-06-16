export interface AnswerEntry {
  questionId: string;
  answer: number;
}

export interface SectionAnswers {
  love: AnswerEntry[];
  strengths: AnswerEntry[];
  worldNeeds: AnswerEntry[];
  paidSkills: AnswerEntry[];
}

export interface SectionScores {
  love: number;
  strengths: number;
  worldNeeds: number;
  paidSkills: number;
}

export interface Recommendation {
  pathId: string;
  pathName: string;
  confidence: number;
  reasoning: string;
}

export interface IkigaiProfile {
  id: string;
  userId: string;
  answers: SectionAnswers;
  scores: SectionScores;
  recommendations: Recommendation[];
  version: number;
  createdAt: number;
}

export interface ShortlistEntry {
  id: string;
  companyId: string;
  userId: string;
  roleOpeningId?: string;
  note?: string;
  createdAt: number;
}

export interface ContactRequest {
  id: string;
  companyId: string;
  userId: string;
  roleOpeningId?: string;
  message: string;
  status: string;
  statusHistory: { status: string; changedAt: number }[];
  sentAt: number;
  updatedAt: number;
}

export interface TalentResult {
  userId: string;
  region?: string;
  experienceLevel?: string;
  careerInterests?: string[];
  portfolioSlug?: string;
  artifactCount: number;
  completedStages: number;
  activePathSlug?: string;
}

export interface ArtifactSummary {
  id: string;
  title: string;
  tags: string[];
  evidenceLinks: string[];
  fileUrls: string[];
  textResponse?: string;
  createdAt: number;
  taskId: string;
}

export interface PortfolioUser {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  region?: string;
  experienceLevel?: string;
  careerInterests?: string[];
  portfolioSlug?: string;
  portfolioVisibility: string;
}

export interface GroupedArtifacts {
  pathSlug: string;
  pathName: string;
  artifacts: ArtifactSummary[];
}

export interface PortfolioStats {
  totalArtifacts: number;
  submissionsCount: number;
  totalViews: number;
  pathsCompleted: number;
  lastUpdated: number | null;
}

export interface PortfolioData {
  user: PortfolioUser;
  artifacts: ArtifactSummary[];
  groupedArtifacts: GroupedArtifacts[];
  stats: PortfolioStats;
  activePath?: { title: string; slug: string } | null;
}

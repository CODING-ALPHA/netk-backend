export interface Resource {
  title: string;
  url: string;
  type: string;
}

export interface CareerPath {
  id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
}

export interface RoadmapStage {
  id: string;
  pathSlug: string;
  stageNumber: number;
  title: string;
  outcomes: string[];
  resources: Resource[];
}

export interface UserPathProgress {
  id: string;
  userId: string;
  pathSlug: string;
  selectedAt: number;
  completedStages: number[];
  isActive: boolean;
}

export interface PathWithProgress {
  path: CareerPath;
  stages: RoadmapStage[];
  progress: UserPathProgress | null;
  completionPercent: number;
}

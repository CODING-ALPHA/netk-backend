export interface Task {
  id: string;
  pathSlug: string;
  stageNumber: number;
  title: string;
  description: string;
  deliverables: string[];
  acceptanceCriteria: string[];
  difficulty: number;
  status: string;
  createdAt: number;
}

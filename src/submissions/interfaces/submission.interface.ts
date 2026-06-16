export interface StatusHistoryEntry {
  status: string;
  note?: string;
  changedAt: number;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string;
  evidenceLinks: string[];
  fileUrls: string[];
  textResponse?: string;
  status: string;
  reviewerNotes?: string;
  statusHistory: StatusHistoryEntry[];
  submittedAt: number;
  updatedAt: number;
}

export interface Artifact {
  id: string;
  submissionId: string;
  taskId: string;
  userId: string;
  title: string;
  tags: string[];
  evidenceLinks: string[];
  fileUrls: string[];
  textResponse?: string;
  createdAt: number;
}

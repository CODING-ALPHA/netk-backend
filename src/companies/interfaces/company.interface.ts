export interface Company {
  id: string;
  userId: string;
  name: string;
  description: string;
  website?: string;
  industry?: string;
  size?: string;
  verifiedStatus: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface RoleOpening {
  id: string;
  companyId: string;
  title: string;
  description: string;
  tags: string[];
  pathSlugs: string[];
  experienceLevel?: string;
  region?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

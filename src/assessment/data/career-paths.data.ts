export interface CareerPath {
  id: string;
  name: string;
  description: string;
}

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'product-design',
    name: 'Product Design',
    description: 'Design digital products that solve real user problems',
  },
  {
    id: 'frontend-engineering',
    name: 'Frontend Engineering',
    description: 'Build the interfaces users interact with on the web',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Turn raw data into insights that drive business decisions',
  },
  {
    id: 'product-management',
    name: 'Product Management',
    description: 'Define what gets built and why, bridging tech and business',
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy',
    description: 'Shape how brands communicate and connect with audiences',
  },
];

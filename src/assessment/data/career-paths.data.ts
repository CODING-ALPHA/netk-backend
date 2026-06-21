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
  {
    id: 'backend-engineering',
    name: 'Backend Engineering',
    description: 'Build robust APIs, database structures, and server logic',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Protect digital systems, networks, and data from cyber threats',
  },
  {
    id: 'cloud-engineering',
    name: 'Cloud Engineering',
    description: 'Design, deploy, and manage scalable cloud infrastructure',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Drive user acquisition, growth, and brand visibility online',
  },
  {
    id: 'machine-learning-engineering',
    name: 'Machine Learning Engineering',
    description: 'Design, build, and deploy machine learning models to production',
  },
];

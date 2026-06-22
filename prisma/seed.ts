import { TASKS_PART_1 } from './tasks-part1';
import { TASKS_PART_2 } from './tasks-part2';
import { TASKS_PART_3 } from './tasks-part3';
import { TASKS_PART_4 } from './tasks-part4';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const CAREER_PATHS = [
  { slug: 'product-design', name: 'Product Design', description: 'Design digital products that solve real user problems', tags: ['Design', 'UX', 'Figma', 'Research', 'Prototyping'] },
  { slug: 'frontend-engineering', name: 'Frontend Engineering', description: 'Build the interfaces users interact with on the web', tags: ['React', 'JavaScript', 'CSS', 'TypeScript', 'Web'] },
  { slug: 'data-analysis', name: 'Data Analysis', description: 'Turn raw data into insights that drive business decisions', tags: ['SQL', 'Python', 'Excel', 'Visualisation', 'Statistics'] },
  { slug: 'product-management', name: 'Product Management', description: 'Define what gets built and why, bridging tech and business', tags: ['Strategy', 'Roadmapping', 'Stakeholders', 'Agile', 'Metrics'] },
  { slug: 'content-strategy', name: 'Content Strategy', description: 'Shape how brands communicate and connect with audiences', tags: ['Writing', 'SEO', 'Brand', 'Editorial', 'Distribution'] },
  { slug: 'backend-engineering', name: 'Backend Engineering', description: 'Build robust APIs, database structures, and server logic', tags: ['Node.js', 'SQL', 'APIs', 'Docker', 'System Design'] },
  { slug: 'cybersecurity', name: 'Cybersecurity', description: 'Protect digital systems, networks, and data from cyber threats', tags: ['Linux', 'Networking', 'Security', 'Penetration Testing', 'IAM'] },
  { slug: 'cloud-engineering', name: 'Cloud Engineering', description: 'Design, deploy, and manage scalable cloud infrastructure', tags: ['AWS', 'Terraform', 'CI/CD', 'Docker', 'Kubernetes'] },
  { slug: 'digital-marketing', name: 'Digital Marketing', description: 'Drive user acquisition, growth, and brand visibility online', tags: ['SEO', 'Analytics', 'SEM', 'Social Media', 'Copywriting'] },
  { slug: 'machine-learning-engineering', name: 'Machine Learning Engineering', description: 'Design, build, and deploy machine learning models to production', tags: ['Python', 'PyTorch', 'scikit-learn', 'MLOps', 'Data Science'] },
];

const ROADMAP_STAGES = [
  // ── Product Design ──
  {
    pathSlug: 'product-design',
    stageNumber: 1,
    title: 'Design Fundamentals & Visual Principles',
    outcomes: [
      'Understand the Gestalt principles (proximity, similarity, closure, continuity) and apply them to layouts',
      'Build fluency in typography: type scales, line height, kerning, and pairing fonts for hierarchy',
      'Apply colour theory: hue, saturation, contrast ratios, and building accessible palettes',
      'Distinguish UI from UX and understand how they collaborate in a product team',
      'Navigate Figma confidently: frames, groups, constraints, alignment, and basic styles',
      'Deconstruct existing apps by identifying layout grids, spacing systems, and visual hierarchy'
    ],
    resources: [
      { title: 'roadmap.sh UX Design Roadmap', url: 'https://roadmap.sh/ux-design', type: 'course' },
      { title: 'Figma Getting Started Guide', url: 'https://help.figma.com/hc/en-us/categories/360002042914-Get-started', type: 'article' },
      { title: 'Interaction Design Foundation – Gestalt Principles', url: 'https://www.interaction-design.org/literature/topics/gestalt-principles', type: 'article' },
      { title: 'Google Fonts Knowledge – Typography', url: 'https://fonts.google.com/knowledge', type: 'article' }
    ]
  },
  {
    pathSlug: 'product-design',
    stageNumber: 2,
    title: 'Figma Mastery & Component-Driven Design',
    outcomes: [
      'Build reusable components using Figma variants, properties, and boolean states',
      'Implement Auto Layout for flexible, responsive frames that adapt to content',
      'Create and manage shared Figma libraries across multiple design files',
      'Use Figma variables and tokens for consistent colour, spacing, and typography themes',
      'Apply 8-point grid systems and spacing scales to design structured layouts',
      'Produce developer-ready specs using Figma Dev Mode with accurate measurements and assets'
    ],
    resources: [
      { title: 'Figma Component Best Practices', url: 'https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma', type: 'article' },
      { title: 'Auto Layout in Figma – Official Guide', url: 'https://help.figma.com/hc/en-us/articles/5731482952599-Using-auto-layout', type: 'article' },
      { title: 'Figma Variables & Design Tokens', url: 'https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma', type: 'article' },
      { title: 'Refactoring UI – Book by Adam Wathan & Steve Schoger', url: 'https://refactoringui.com/', type: 'book' }
    ]
  },
  {
    pathSlug: 'product-design',
    stageNumber: 3,
    title: 'UX Research & Information Architecture',
    outcomes: [
      'Plan and conduct user interviews with structured discussion guides to surface latent needs',
      'Create user personas grounded in real research data (not assumptions)',
      'Map end-to-end user journeys, highlighting pain points, emotions, and opportunities',
      'Build empathy maps and affinity diagrams to synthesise qualitative research findings',
      'Design information architecture using card sorting and tree testing techniques',
      'Write clear problem statements and "How Might We" questions to frame design briefs'
    ],
    resources: [
      { title: 'Nielsen Norman Group – UX Research Methods', url: 'https://www.nngroup.com/articles/which-ux-research-methods/', type: 'article' },
      { title: 'Maze Guide to User Research', url: 'https://maze.co/guides/ux-research/', type: 'article' },
      { title: 'UX Collective – Affinity Mapping', url: 'https://uxdesign.cc/affinity-diagrams-how-to-cluster-insights-7e0b29b99b19', type: 'article' },
      { title: 'Optimal Workshop Card Sorting Tool', url: 'https://www.optimalworkshop.com/optimalsort', type: 'tool' }
    ]
  },
  {
    pathSlug: 'product-design',
    stageNumber: 4,
    title: 'Interaction Design, Prototyping & Usability Testing',
    outcomes: [
      'Create low-fidelity wireframes and user flows before committing to high-fidelity design',
      'Build fully interactive Figma prototypes using Smart Animate and component states',
      'Design micro-interactions: hover states, loading skeletons, and transition feedback',
      'Write a usability test script with moderated and unmoderated testing approaches',
      'Facilitate usability testing sessions and document friction points with severity ratings',
      'Iterate designs based on test findings and present before/after comparisons clearly'
    ],
    resources: [
      { title: 'Figma – Guide to Prototyping', url: 'https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma', type: 'article' },
      { title: 'Maze – Usability Testing Guide', url: 'https://maze.co/guides/usability-testing/', type: 'article' },
      { title: 'NNG – Usability 101', url: 'https://www.nngroup.com/articles/usability-101-introduction-to-usability/', type: 'article' },
      { title: 'UX Tools – Wireframing Best Practices', url: 'https://uxtools.co/blog/wireframing/', type: 'article' }
    ]
  },
  {
    pathSlug: 'product-design',
    stageNumber: 5,
    title: 'Design Systems, Accessibility & Developer Handoff',
    outcomes: [
      'Build a production-ready design system in Figma with documented component usage guidelines',
      'Implement WCAG 2.1 AA accessibility standards: contrast ratios, focus states, and touch targets',
      'Design for keyboard navigation and screen reader compatibility',
      'Create a comprehensive design token structure (colour, spacing, typography, shadow)',
      'Deliver annotated design specifications and redlines for engineering implementation',
      'Conduct design critiques and present work to stakeholders with clear rationale'
    ],
    resources: [
      { title: 'WebAIM – WCAG 2 Checklist', url: 'https://webaim.org/standards/wcag/checklist', type: 'article' },
      { title: 'Figma Dev Mode – Handoff Guide', url: 'https://help.figma.com/hc/en-us/articles/15024419065623-Guide-to-Dev-Mode', type: 'article' },
      { title: 'Adele – Design System Repository', url: 'https://adele.uxpin.com/', type: 'tool' },
      { title: 'Design Systems Handbook – InVision', url: 'https://www.designbetter.co/design-systems-handbook', type: 'book' }
    ]
  },

  // ── Frontend Engineering ──
  {
    pathSlug: 'frontend-engineering',
    stageNumber: 1,
    title: 'HTML, CSS & The Web Platform',
    outcomes: [
      'Write semantic HTML5 using appropriate elements (article, section, nav, main, aside)',
      'Understand the browser rendering pipeline: DOM, CSSOM, layout, paint, and composite',
      'Build responsive layouts with CSS Flexbox and CSS Grid',
      'Implement responsive design using media queries, fluid units (rem, em, vw, vh), and mobile-first methodology',
      'Apply CSS custom properties (variables), specificity rules, and the cascade',
      'Use browser DevTools to debug layout issues, inspect computed styles, and audit accessibility'
    ],
    resources: [
      { title: 'MDN Web Docs – HTML & CSS', url: 'https://developer.mozilla.org/en-US/docs/Web', type: 'article' },
      { title: 'roadmap.sh Frontend Roadmap', url: 'https://roadmap.sh/frontend', type: 'course' },
      { title: 'CSS Tricks – A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article' },
      { title: 'web.dev – Learn CSS', url: 'https://web.dev/learn/css/', type: 'course' }
    ]
  },
  {
    pathSlug: 'frontend-engineering',
    stageNumber: 2,
    title: 'JavaScript Fundamentals & ES6+',
    outcomes: [
      'Understand JavaScript data types, scope, closures, and the prototype chain',
      'Work with ES6+ features: arrow functions, destructuring, spread/rest, optional chaining, and modules',
      'Manipulate the DOM: selecting elements, creating nodes, handling events, and updating attributes',
      'Handle asynchronous operations using callbacks, Promises, async/await, and the Fetch API',
      'Understand the JavaScript event loop, call stack, microtasks, and macrotasks',
      'Write clean code using linters (ESLint), formatters (Prettier), and basic Git workflows'
    ],
    resources: [
      { title: 'javascript.info – Modern JavaScript Tutorial', url: 'https://javascript.info/', type: 'book' },
      { title: 'Eloquent JavaScript – Free Online Book', url: 'https://eloquentjavascript.net/', type: 'book' },
      { title: 'MDN – Asynchronous JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous', type: 'article' },
      { title: 'The Odin Project – JavaScript Path', url: 'https://www.theodinproject.com/paths/full-stack-javascript', type: 'course' }
    ]
  },
  {
    pathSlug: 'frontend-engineering',
    stageNumber: 3,
    title: 'React & Modern Frontend Frameworks',
    outcomes: [
      'Build component-based UIs in React using JSX, props, and controlled components',
      'Manage local state with useState and side effects with useEffect, useRef, and useLayoutEffect',
      'Lift state, use prop drilling alternatives (Context API), and understand when to reach for global state',
      'Fetch and display data from REST APIs with proper loading, error, and empty states',
      'Apply TailwindCSS utility classes or CSS Modules for component-scoped styling',
      'Set up and scaffold React projects using Vite and manage dependencies with npm/pnpm'
    ],
    resources: [
      { title: 'React Official Documentation', url: 'https://react.dev/', type: 'course' },
      { title: 'TailwindCSS Documentation', url: 'https://tailwindcss.com/docs', type: 'article' },
      { title: 'Vite – Getting Started', url: 'https://vite.dev/guide/', type: 'tool' },
      { title: 'Josh Comeau – Joy of React Course', url: 'https://www.joyofreact.com/', type: 'course' }
    ]
  },
  {
    pathSlug: 'frontend-engineering',
    stageNumber: 4,
    title: 'TypeScript, Testing & Accessibility',
    outcomes: [
      'Add static typing to React applications using TypeScript interfaces, types, and generics',
      'Write unit tests for components and utility functions using Vitest and React Testing Library',
      'Test user interactions end-to-end using Playwright or Cypress',
      'Implement ARIA roles, semantic HTML, and keyboard navigation for accessibility compliance',
      'Use React Router or TanStack Router for client-side routing with protected routes',
      'Manage server state efficiently using TanStack Query (React Query) for caching and synchronisation'
    ],
    resources: [
      { title: 'TypeScript Handbook – Official Docs', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'article' },
      { title: 'React Testing Library – Official Docs', url: 'https://testing-library.com/docs/react-testing-library/intro/', type: 'article' },
      { title: 'Playwright – End-to-End Testing', url: 'https://playwright.dev/docs/intro', type: 'article' },
      { title: 'TanStack Query – Documentation', url: 'https://tanstack.com/query/latest/docs/framework/react/overview', type: 'article' }
    ]
  },
  {
    pathSlug: 'frontend-engineering',
    stageNumber: 5,
    title: 'Next.js, Performance Optimisation & Deployment',
    outcomes: [
      'Build full-stack applications with Next.js App Router, Server Components, and Server Actions',
      'Understand rendering strategies: SSR, SSG, ISR, and when to choose each',
      'Optimise Core Web Vitals: LCP, CLS, FID using code splitting, lazy loading, and image optimisation',
      'Analyse and reduce JavaScript bundle sizes using Webpack Bundle Analyzer or Rollup visualisers',
      'Configure CI/CD pipelines with GitHub Actions for automated testing and deployment to Vercel',
      'Implement security best practices: Content Security Policy headers, input sanitisation, and HTTPS'
    ],
    resources: [
      { title: 'Next.js App Router Documentation', url: 'https://nextjs.org/docs', type: 'course' },
      { title: 'web.dev – Core Web Vitals', url: 'https://web.dev/vitals/', type: 'article' },
      { title: 'Google Lighthouse – Performance Auditing', url: 'https://developer.chrome.com/docs/lighthouse/overview/', type: 'tool' },
      { title: 'GitHub Actions – CI/CD Docs', url: 'https://docs.github.com/en/actions', type: 'article' }
    ]
  },

  // ── Data Analysis ──
  {
    pathSlug: 'data-analysis',
    stageNumber: 1,
    title: 'Spreadsheets, Statistics & Data Thinking',
    outcomes: [
      'Clean messy datasets: remove duplicates, fix formatting, handle missing values in Excel/Google Sheets',
      'Write spreadsheet formulas: VLOOKUP, INDEX-MATCH, SUMIF, COUNTIF, and nested IFs',
      'Build pivot tables and pivot charts to summarise data across multiple dimensions',
      'Understand descriptive statistics: mean, median, mode, standard deviation, and percentiles',
      'Identify data types (nominal, ordinal, interval, ratio) and choose appropriate visualisation types',
      'Create clean charts (bar, line, scatter, histogram) following data visualisation best practices'
    ],
    resources: [
      { title: 'roadmap.sh Data Analyst Roadmap', url: 'https://roadmap.sh/data-analyst', type: 'course' },
      { title: 'Excel Data Analysis Support Guide', url: 'https://support.microsoft.com/en-us/excel', type: 'article' },
      { title: 'Storytelling with Data – Cole Nussbaumer Knaflic', url: 'https://www.storytellingwithdata.com/', type: 'book' },
      { title: 'Khan Academy – Statistics & Probability', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' }
    ]
  },
  {
    pathSlug: 'data-analysis',
    stageNumber: 2,
    title: 'SQL & Relational Database Querying',
    outcomes: [
      'Write SELECT queries with WHERE, ORDER BY, GROUP BY, and HAVING clauses',
      'Join multiple tables using INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN',
      'Use aggregate functions: COUNT, SUM, AVG, MIN, MAX with conditional filters',
      'Write subqueries and Common Table Expressions (CTEs) for readable, modular query logic',
      'Apply window functions: ROW_NUMBER, RANK, LEAD, LAG, and running totals with OVER/PARTITION BY',
      'Profile query performance using EXPLAIN ANALYZE and add indexes to optimise slow queries'
    ],
    resources: [
      { title: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'course' },
      { title: 'PostgreSQL Official Docs', url: 'https://www.postgresql.org/docs/', type: 'article' },
      { title: 'SQLZoo – Interactive SQL Exercises', url: 'https://sqlzoo.net/wiki/SQL_Tutorial', type: 'course' },
      { title: 'Select Star SQL – Free Online Book', url: 'https://selectstarsql.com/', type: 'book' }
    ]
  },
  {
    pathSlug: 'data-analysis',
    stageNumber: 3,
    title: 'Python for Data Analysis (Pandas, NumPy & EDA)',
    outcomes: [
      'Load, inspect, and manipulate DataFrames using pandas (read_csv, merge, groupby, pivot_table)',
      'Handle missing data: detect nulls, impute values, and drop incomplete rows/columns',
      'Perform exploratory data analysis (EDA) to surface distributions, correlations, and outliers',
      'Use NumPy for vectorised arithmetic, array slicing, and broadcasting operations',
      'Create statistical visualisations with Matplotlib and Seaborn (histograms, heatmaps, box plots)',
      'Write reproducible analysis in Jupyter Notebooks with clear markdown documentation'
    ],
    resources: [
      { title: 'Pandas Official Tutorial – 10 Minutes to pandas', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', type: 'article' },
      { title: 'Kaggle – Learn Python & Data Analysis', url: 'https://www.kaggle.com/learn', type: 'course' },
      { title: 'Seaborn Tutorial & Gallery', url: 'https://seaborn.pydata.org/tutorial.html', type: 'article' },
      { title: 'Python Data Science Handbook – Jake VanderPlas (free online)', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'book' }
    ]
  },
  {
    pathSlug: 'data-analysis',
    stageNumber: 4,
    title: 'Business Intelligence & Interactive Dashboards',
    outcomes: [
      'Connect BI tools to live database sources and CSV files for automated data refresh',
      'Build interactive Tableau or Power BI dashboards with filters, parameters, and drill-downs',
      'Design KPI dashboards following information hierarchy: headline metric → breakdown → trend',
      'Write DAX formulas (Power BI) or calculated fields (Tableau) for custom business metrics',
      'Perform cohort analysis to measure user retention and revenue by acquisition period',
      'Present data stories to non-technical stakeholders, linking data insights to business actions'
    ],
    resources: [
      { title: 'Tableau Public Learning Resources', url: 'https://public.tableau.com/en-us/s/resources', type: 'course' },
      { title: 'Microsoft Power BI Documentation', url: 'https://learn.microsoft.com/en-us/power-bi/', type: 'course' },
      { title: 'dbt Labs – Analytics Engineering Guide', url: 'https://www.getdbt.com/analytics-engineering', type: 'article' },
      { title: 'Looker Studio (Google Data Studio) Help', url: 'https://support.google.com/looker-studio', type: 'article' }
    ]
  },
  {
    pathSlug: 'data-analysis',
    stageNumber: 5,
    title: 'ETL Pipelines, Advanced Analytics & Reporting',
    outcomes: [
      'Build automated ETL pipelines in Python that extract from APIs, transform data, and load into databases',
      'Schedule and orchestrate data workflows using tools like Apache Airflow or GitHub Actions cron jobs',
      'Apply A/B testing principles: hypothesis formulation, sample sizing, and statistical significance (p-values)',
      'Implement basic predictive models (linear regression, time series forecasting) to support business decisions',
      'Write executive-level analytical reports communicating findings, confidence, and recommendations',
      'Version-control SQL and Python analysis code using Git and document pipelines for team handoff'
    ],
    resources: [
      { title: 'dbt Core – GitHub Repository & Docs', url: 'https://github.com/dbt-labs/dbt-core', type: 'tool' },
      { title: 'Apache Airflow Documentation', url: 'https://airflow.apache.org/docs/', type: 'article' },
      { title: 'StatQuest – Statistics for Data Science (YouTube)', url: 'https://www.youtube.com/@statquest', type: 'course' },
      { title: 'Towards Data Science – ETL Best Practices', url: 'https://towardsdatascience.com/', type: 'article' }
    ]
  },

  // ── Product Management ──
  {
    pathSlug: 'product-management',
    stageNumber: 1,
    title: 'Product Thinking & Customer Discovery',
    outcomes: [
      'Understand the difference between outputs (features) and outcomes (user/business value)',
      'Apply Jobs-to-be-Done (JTBD) theory to frame customer problems',
      'Conduct structured user interviews: recruit participants, write discussion guides, and moderate sessions',
      'Deconstruct existing products: identify target users, core loops, monetisation, and retention hooks',
      'Synthesise qualitative research into themes and prioritised customer pain points',
      'Draft user stories using the "As a… I want to… So that…" format with clear acceptance criteria'
    ],
    resources: [
      { title: 'roadmap.sh Product Manager Roadmap', url: 'https://roadmap.sh/product-manager', type: 'course' },
      { title: 'JTBD – Competing Against Luck (Clayton Christensen)', url: 'https://www.amazon.com/Competing-Against-Luck-Innovation-Customer/dp/0062435612', type: 'book' },
      { title: 'Lenny\'s Newsletter – Product Management', url: 'https://www.lennysnewsletter.com/', type: 'article' },
      { title: 'Mind the Product Blog', url: 'https://www.mindtheproduct.com/', type: 'article' }
    ]
  },
  {
    pathSlug: 'product-management',
    stageNumber: 2,
    title: 'Strategy, Prioritisation & OKR Setting',
    outcomes: [
      'Define a product vision and connect it to company strategy using a north star metric',
      'Apply RICE (Reach, Impact, Confidence, Effort) scoring to rank feature candidates objectively',
      'Use the Kano Model to categorise features as baseline, performance, or delighters',
      'Formulate product OKRs (Objectives and Key Results) aligned to business goals per quarter',
      'Create an opportunity solution tree to map problems to potential solutions systematically',
      'Manage stakeholder expectations by communicating trade-offs and what is not being built'
    ],
    resources: [
      { title: 'SVPG – Marty Cagan Articles', url: 'https://www.svpg.com/articles/', type: 'article' },
      { title: 'Intercom – Continuous Discovery Habits (Teresa Torres)', url: 'https://www.producttalk.org/', type: 'article' },
      { title: 'Productboard – Prioritisation Guide', url: 'https://www.productboard.com/blog/prioritization-frameworks/', type: 'article' },
      { title: 'Measure What Matters – John Doerr (OKRs)', url: 'https://www.whatmatters.com/', type: 'book' }
    ]
  },
  {
    pathSlug: 'product-management',
    stageNumber: 3,
    title: 'Product Requirements & Roadmap Planning',
    outcomes: [
      'Write a complete Product Requirements Document (PRD) covering problem, solution, constraints, and metrics',
      'Map user flows and edge cases before handing off to design and engineering',
      'Build a public-facing or internal product roadmap using outcome-based themes (not feature lists)',
      'Run effective sprint planning, backlog grooming, and sprint retrospectives in Agile/Scrum',
      'Write technical bug reports and feature tickets with clear reproduction steps and acceptance criteria',
      'Collaborate with designers on wireframes and with engineers on technical feasibility assessments'
    ],
    resources: [
      { title: 'Atlassian – PRD Template', url: 'https://www.atlassian.com/software/confluence/templates/product-requirements-document', type: 'tool' },
      { title: 'Reforge – Product Strategy Articles', url: 'https://www.reforge.com/blog', type: 'article' },
      { title: 'Linear – Issue Tracking for Product Teams', url: 'https://linear.app/docs', type: 'tool' },
      { title: 'Shape Up – Basecamp\'s Product Process (free book)', url: 'https://basecamp.com/shapeup', type: 'book' }
    ]
  },
  {
    pathSlug: 'product-management',
    stageNumber: 4,
    title: 'Metrics, Analytics & Experimentation',
    outcomes: [
      'Define and instrument product analytics events (tracking clicks, funnel steps, and feature usage)',
      'Set up and interpret dashboards in Mixpanel, Amplitude, or PostHog for retention and activation',
      'Design A/B experiments: write a hypothesis, calculate sample size, and choose a success metric',
      'Analyse funnel drop-off using cohort analysis, session recordings, and heatmaps',
      'Track North Star metrics alongside guardrail metrics to prevent unintended side effects',
      'Communicate experiment results accurately, distinguishing statistical significance from practical significance'
    ],
    resources: [
      { title: 'Mixpanel – Product Analytics Hub', url: 'https://mixpanel.com/blog/', type: 'article' },
      { title: 'Amplitude – Analytics Academy', url: 'https://academy.amplitude.com/', type: 'course' },
      { title: 'Optimizely – A/B Testing Guide', url: 'https://www.optimizely.com/optimization-glossary/ab-testing/', type: 'article' },
      { title: 'PostHog – Product Analytics Docs', url: 'https://posthog.com/docs', type: 'article' }
    ]
  },
  {
    pathSlug: 'product-management',
    stageNumber: 5,
    title: 'Go-To-Market, Growth & Product Leadership',
    outcomes: [
      'Build a Go-To-Market (GTM) plan covering positioning, pricing tiers, channels, and launch sequencing',
      'Write positioning statements and value propositions that differentiate the product in a market',
      'Define customer segments and identify the ideal customer profile (ICP) for B2B or B2C products',
      'Track SaaS business metrics: MRR, ARR, churn rate, CAC, LTV, and payback period',
      'Develop a post-launch feedback loop using NPS surveys, support tickets, and user interviews',
      'Build a product portfolio strategy: decide what to build, buy, or partner for over an 18-month horizon'
    ],
    resources: [
      { title: 'Reforge – Growth & Retention Courses', url: 'https://www.reforge.com/', type: 'course' },
      { title: 'April Dunford – Obviously Awesome (Positioning)', url: 'https://www.aprildunford.com/obviously-awesome', type: 'book' },
      { title: 'Y Combinator – Startup Product Lessons', url: 'https://www.ycombinator.com/library', type: 'article' },
      { title: 'SaaStr – SaaS Metrics & GTM Articles', url: 'https://www.saastr.com/', type: 'article' }
    ]
  },

  // ── Content Strategy ──
  {
    pathSlug: 'content-strategy',
    stageNumber: 1,
    title: 'Writing Fundamentals & UX Copy',
    outcomes: [
      'Apply Plain Language principles: active voice, short sentences, and scannable structure',
      'Differentiate content types: UX copy, marketing copy, editorial content, and technical documentation',
      'Write clear microcopy for UI states: empty states, error messages, onboarding prompts, and CTAs',
      'Understand how tone of voice differs across contexts (customer support vs. marketing vs. in-app)',
      'Critique and rewrite confusing interface copy from real apps, documenting your reasoning',
      'Use readability tools (Hemingway App, Grammarly) to assess and improve writing clarity scores'
    ],
    resources: [
      { title: 'Mailchimp Content Style Guide', url: 'https://styleguide.mailchimp.com/', type: 'book' },
      { title: 'A List Apart – Content Strategy Articles', url: 'https://alistapart.com/topic/content-strategy/', type: 'article' },
      { title: 'Google Material Design – Writing Guidelines', url: 'https://m3.material.io/foundations/content-design/overview', type: 'article' },
      { title: 'Torrey Podmajersky – Strategic Writing for UX', url: 'https://www.oreilly.com/library/view/strategic-writing-for/9781492049395/', type: 'book' }
    ]
  },
  {
    pathSlug: 'content-strategy',
    stageNumber: 2,
    title: 'Content Auditing & Brand Voice Definition',
    outcomes: [
      'Conduct a content inventory: catalogue all assets by URL, format, author, date, and channel',
      'Score content quality using criteria: accuracy, relevance, clarity, SEO, and conversion value',
      'Identify content gaps by mapping existing assets against user needs and funnel stages',
      'Define a brand voice guide with personality traits, tone descriptors, and do/don\'t writing examples',
      'Build a content governance model covering ownership, review cycles, and publishing standards',
      'Recommend content consolidation, updates, or deletion based on audit findings'
    ],
    resources: [
      { title: 'Content Strategy for the Web – Kristina Halvorson', url: 'https://www.contentstrategy.com/', type: 'book' },
      { title: 'GatherContent – Content Audit Guide', url: 'https://gathercontent.com/blog/content-audit', type: 'article' },
      { title: 'Hotjar – Content Gap Analysis', url: 'https://www.hotjar.com/blog/content-gap-analysis/', type: 'article' },
      { title: 'Airtable – Content Audit Template', url: 'https://www.airtable.com/templates/content-calendar', type: 'tool' }
    ]
  },
  {
    pathSlug: 'content-strategy',
    stageNumber: 3,
    title: 'SEO Strategy & Keyword Research',
    outcomes: [
      'Understand how search engines crawl, index, and rank content using algorithms',
      'Perform keyword research: identify search volume, keyword difficulty, and user intent (informational, navigational, transactional)',
      'Map keywords to content topics across funnel stages (TOFU, MOFU, BOFU)',
      'Write SEO-optimised titles (under 60 chars), meta descriptions (under 160 chars), and H1/H2 structures',
      'Perform on-page optimisation: internal linking, image alt text, schema markup, and canonical tags',
      'Analyse competitor content gaps using tools like Ahrefs or Semrush to find ranking opportunities'
    ],
    resources: [
      { title: 'Moz – Beginner\'s Guide to SEO', url: 'https://moz.com/beginners-guide-to-seo', type: 'book' },
      { title: 'Semrush – Keyword Research Guide', url: 'https://www.semrush.com/blog/keyword-research-guide/', type: 'article' },
      { title: 'Ahrefs – SEO Learning Hub', url: 'https://ahrefs.com/seo', type: 'course' },
      { title: 'Google Search Central – SEO Starter Guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide', type: 'article' }
    ]
  },
  {
    pathSlug: 'content-strategy',
    stageNumber: 4,
    title: 'Editorial Planning & Content Production',
    outcomes: [
      'Build a multi-channel editorial calendar covering blog, social, email, and video content',
      'Write long-form SEO content (1,500–3,000 words) structured with clear headers and supporting visuals',
      'Create content briefs that guide writers on angle, target keyword, word count, and internal links',
      'Develop a content repurposing workflow: turn one pillar piece into social posts, newsletters, and clips',
      'Manage a content production pipeline using project tools (Notion, Airtable, Trello)',
      'Measure content performance: organic traffic, time on page, bounce rate, and backlinks earned'
    ],
    resources: [
      { title: 'HubSpot – Content Marketing Certification', url: 'https://academy.hubspot.com/courses/content-marketing', type: 'course' },
      { title: 'Copyblogger – Long-form Writing Guide', url: 'https://copyblogger.com/blog/', type: 'article' },
      { title: 'Notion – Editorial Calendar Template', url: 'https://www.notion.so/templates/editorial-calendar', type: 'tool' },
      { title: 'Siege Media – Content Brief Template', url: 'https://www.siegemedia.com/strategy/content-brief', type: 'article' }
    ]
  },
  {
    pathSlug: 'content-strategy',
    stageNumber: 5,
    title: 'Email Campaigns, Growth Funnels & Content Ops',
    outcomes: [
      'Design and launch email newsletter campaigns with onboarding sequences and drip automations',
      'Write high-converting email subject lines, preview text, and CTAs for different audience segments',
      'Map content assets across the full acquisition funnel (awareness → consideration → conversion → retention)',
      'Build lead magnet content (ebooks, templates, webinars) for top-of-funnel audience growth',
      'Track email metrics: open rate, click-through rate, unsubscribe rate, and conversion rate',
      'Create a content operations playbook documenting workflows, style guides, and tool stack for a team'
    ],
    resources: [
      { title: 'Substack – Creator Resources', url: 'https://substack.com/resources', type: 'article' },
      { title: 'Mailchimp – Email Marketing Guide', url: 'https://mailchimp.com/resources/email-marketing-field-guide/', type: 'book' },
      { title: 'ConvertKit – Creator Marketing Resources', url: 'https://convertkit.com/resources', type: 'article' },
      { title: 'Really Good Emails – Email Design Inspiration', url: 'https://reallygoodemails.com/', type: 'tool' }
    ]
  },

  // ── Backend Engineering ──
  {
    pathSlug: 'backend-engineering',
    stageNumber: 1,
    title: 'Servers, APIs & HTTP Fundamentals',
    outcomes: [
      'Understand the HTTP request/response cycle: methods (GET, POST, PUT, PATCH, DELETE), status codes, and headers',
      'Build a RESTful API using Node.js and Express with proper route organisation and middleware',
      'Validate incoming request data using libraries like Zod or Joi to prevent bad inputs',
      'Handle async errors gracefully with try/catch, global error middleware, and meaningful error responses',
      'Structure backend projects with separation of concerns: routes, controllers, services, and repositories',
      'Test API endpoints manually using Postman and document them with OpenAPI/Swagger specifications'
    ],
    resources: [
      { title: 'roadmap.sh Backend Roadmap', url: 'https://roadmap.sh/backend', type: 'course' },
      { title: 'Express.js Official Guide', url: 'https://expressjs.com/en/guide/routing.html', type: 'article' },
      { title: 'REST API Design Best Practices – Microsoft', url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design', type: 'article' },
      { title: 'Postman Learning Centre', url: 'https://learning.postman.com/', type: 'course' }
    ]
  },
  {
    pathSlug: 'backend-engineering',
    stageNumber: 2,
    title: 'Relational Databases & Data Modelling',
    outcomes: [
      'Design normalised database schemas in 3rd Normal Form (3NF) with ERDs',
      'Define tables with appropriate primary keys, foreign keys, and constraints (UNIQUE, NOT NULL, CHECK)',
      'Write complex SQL queries: multi-table JOINs, CTEs, subqueries, and window functions',
      'Use an ORM (Prisma or TypeORM) to define models, run migrations, and query databases type-safely',
      'Add indexes to frequently queried columns and use EXPLAIN ANALYZE to diagnose slow queries',
      'Understand transactions, ACID properties, and how to use database locks to prevent race conditions'
    ],
    resources: [
      { title: 'PostgreSQL Official Docs', url: 'https://www.postgresql.org/docs/', type: 'article' },
      { title: 'Prisma ORM Documentation', url: 'https://www.prisma.io/docs', type: 'article' },
      { title: 'Use The Index Luke – SQL Indexing & Tuning', url: 'https://use-the-index-luke.com/', type: 'book' },
      { title: 'dbdiagram.io – ERD Design Tool', url: 'https://dbdiagram.io/', type: 'tool' }
    ]
  },
  {
    pathSlug: 'backend-engineering',
    stageNumber: 3,
    title: 'Authentication, Security & Authorisation',
    outcomes: [
      'Implement user authentication with JWT (access and refresh tokens) and secure cookie strategies',
      'Hash and verify passwords using bcrypt with appropriate salt rounds',
      'Apply role-based access control (RBAC) to restrict routes by user permissions',
      'Protect APIs against OWASP Top 10 vulnerabilities: SQL injection, XSS, CSRF, and rate limiting',
      'Use environment variables and secrets management to prevent credentials leaking into source code',
      'Implement OAuth 2.0 / OpenID Connect for third-party login (Google, GitHub) using Passport.js or Auth.js'
    ],
    resources: [
      { title: 'JWT.io – Introduction to JSON Web Tokens', url: 'https://jwt.io/introduction', type: 'article' },
      { title: 'OWASP API Security Top 10', url: 'https://owasp.org/www-project-api-security/', type: 'article' },
      { title: 'Auth0 – Identity & Security Articles', url: 'https://auth0.com/blog/', type: 'article' },
      { title: 'Helmet.js – Secure Express Apps', url: 'https://helmetjs.github.io/', type: 'tool' }
    ]
  },
  {
    pathSlug: 'backend-engineering',
    stageNumber: 4,
    title: 'Containerisation, DevOps & Cloud Deployment',
    outcomes: [
      'Write Dockerfiles for Node.js applications using multi-stage builds to minimise image size',
      'Orchestrate multi-service apps with Docker Compose (app server, database, Redis)',
      'Configure environment-specific settings using .env files, health checks, and volume mounts',
      'Set up CI/CD pipelines with GitHub Actions to run tests, build images, and deploy on push',
      'Deploy backend services to cloud providers: Railway, Render, AWS EC2, or Google Cloud Run',
      'Monitor server health using logging (Winston/Pino) and uptime checks (BetterStack, UptimeRobot)'
    ],
    resources: [
      { title: 'Docker Official Documentation', url: 'https://docs.docker.com/', type: 'article' },
      { title: 'Docker Compose – Getting Started', url: 'https://docs.docker.com/compose/', type: 'article' },
      { title: 'GitHub Actions Workflow Docs', url: 'https://docs.github.com/en/actions', type: 'article' },
      { title: 'Twelve-Factor App – Backend Best Practices', url: 'https://12factor.net/', type: 'article' }
    ]
  },
  {
    pathSlug: 'backend-engineering',
    stageNumber: 5,
    title: 'Scalability, Caching, Queues & System Design',
    outcomes: [
      'Implement Redis caching strategies (cache-aside, write-through) to reduce database load',
      'Build background job queues with BullMQ or RabbitMQ to process tasks asynchronously',
      'Design event-driven architectures using pub/sub patterns for decoupled service communication',
      'Apply horizontal scaling concepts: stateless services, session storage in Redis, and load balancers',
      'Understand CAP theorem, eventual consistency, and trade-offs in distributed system design',
      'Conduct load tests with k6 or Artillery to measure throughput, latency, and error rates under stress'
    ],
    resources: [
      { title: 'BullMQ – Queue Documentation', url: 'https://docs.bullmq.io/', type: 'article' },
      { title: 'Redis Caching Patterns Guide', url: 'https://redis.io/docs/manual/client-side-caching/', type: 'article' },
      { title: 'System Design Primer – GitHub', url: 'https://github.com/donnemartin/system-design-primer', type: 'book' },
      { title: 'k6 Load Testing Documentation', url: 'https://k6.io/docs/', type: 'article' }
    ]
  },

  // ── Cybersecurity ──
  {
    pathSlug: 'cybersecurity',
    stageNumber: 1,
    title: 'Linux Administration & Networking Fundamentals',
    outcomes: [
      'Navigate and administer Linux using the command line: file permissions, user management, and cron jobs',
      'Understand the OSI model and TCP/IP stack: how packets travel through networks',
      'Configure UFW firewall rules to allow and block specific ports and IP ranges',
      'Secure SSH access: disable root login, use key-based authentication, and change default ports',
      'Capture and analyse network traffic using Wireshark or tcpdump',
      'Understand the CIA Triad (Confidentiality, Integrity, Availability) and apply it to threat modelling'
    ],
    resources: [
      { title: 'roadmap.sh Cyber Security Roadmap', url: 'https://roadmap.sh/cyber-security', type: 'course' },
      { title: 'Linux Journey – Interactive Linux Learning', url: 'https://linuxjourney.com/', type: 'course' },
      { title: 'Nmap Official Reference Guide', url: 'https://nmap.org/book/man.html', type: 'article' },
      { title: 'TryHackMe – Pre-Security Path', url: 'https://tryhackme.com/path/outline/presecurity', type: 'course' }
    ]
  },
  {
    pathSlug: 'cybersecurity',
    stageNumber: 2,
    title: 'Web Security & OWASP Vulnerabilities',
    outcomes: [
      'Understand and demonstrate OWASP Top 10 vulnerabilities: SQLi, XSS, CSRF, IDOR, and SSRF',
      'Use Burp Suite to intercept, modify, and replay HTTP requests during web security testing',
      'Identify and exploit Insecure Direct Object References (IDOR) and broken access control',
      'Understand how HTTPS, TLS handshake, and certificate validation protect web communications',
      'Perform reconnaissance using passive OSINT tools: Shodan, theHarvester, and Google Dorks',
      'Write and test security headers: CSP, HSTS, X-Frame-Options, and Referrer-Policy'
    ],
    resources: [
      { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', type: 'course' },
      { title: 'OWASP Top 10 – Official Guide', url: 'https://owasp.org/www-project-top-ten/', type: 'article' },
      { title: 'TryHackMe – Web Fundamentals Path', url: 'https://tryhackme.com/path/outline/web', type: 'course' },
      { title: 'Hack The Box – Web Security Challenges', url: 'https://www.hackthebox.com/', type: 'tool' }
    ]
  },
  {
    pathSlug: 'cybersecurity',
    stageNumber: 3,
    title: 'Penetration Testing & Ethical Hacking',
    outcomes: [
      'Conduct structured penetration tests following the PTES (Penetration Testing Execution Standard) methodology',
      'Perform network enumeration using Nmap, Gobuster, and Nikto to identify attack surfaces',
      'Exploit vulnerable machines on TryHackMe or HackTheBox using known CVEs and manual techniques',
      'Use Metasploit Framework for controlled exploitation and post-exploitation reconnaissance',
      'Write professional penetration test reports with executive summaries and technical remediation steps',
      'Understand privilege escalation techniques (Linux/Windows) and how defenders can prevent them'
    ],
    resources: [
      { title: 'TryHackMe – Jr Penetration Tester Path', url: 'https://tryhackme.com/path/outline/jrpenetrationtester', type: 'course' },
      { title: 'Metasploit Unleashed – Free Online Course', url: 'https://www.offensive-security.com/metasploit-unleashed/', type: 'course' },
      { title: 'HackTricks – Penetration Testing Techniques', url: 'https://book.hacktricks.xyz/', type: 'book' },
      { title: 'Snyk Vulnerability Database', url: 'https://security.snyk.io/', type: 'tool' }
    ]
  },
  {
    pathSlug: 'cybersecurity',
    stageNumber: 4,
    title: 'Cloud Security, IAM & Secure Coding',
    outcomes: [
      'Design AWS IAM policies following the Principle of Least Privilege with resource-level restrictions',
      'Configure S3 bucket policies, VPC security groups, and NACLs to enforce network isolation',
      'Perform static code analysis (SAST) using SonarQube or Semgrep to detect vulnerabilities in source code',
      'Audit dependencies for known CVEs using Snyk, OWASP Dependency-Check, or GitHub Dependabot',
      'Understand Zero Trust Architecture: verify every request, never trust by network location alone',
      'Implement secrets management using AWS Secrets Manager, HashiCorp Vault, or GitHub Secrets'
    ],
    resources: [
      { title: 'AWS IAM Best Practices', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', type: 'article' },
      { title: 'OWASP – Secure Coding Practices Checklist', url: 'https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/', type: 'article' },
      { title: 'SonarQube – Code Quality & Security', url: 'https://docs.sonarqube.org/', type: 'tool' },
      { title: 'CloudSecDocs – Cloud Security Reference', url: 'https://cloudsecdocs.com/', type: 'article' }
    ]
  },
  {
    pathSlug: 'cybersecurity',
    stageNumber: 5,
    title: 'Incident Response, Forensics & Security Operations',
    outcomes: [
      'Follow the NIST Incident Response lifecycle: Preparation, Detection, Containment, Eradication, Recovery',
      'Analyse access logs, auth logs, and network captures to reconstruct attacker timelines',
      'Perform digital forensics: preserve evidence integrity, analyse file system artefacts, and recover deleted data',
      'Set up a SIEM (Splunk or Wazuh) to aggregate logs, write detection rules, and trigger alerts',
      'Design and document runbooks for common incident types (ransomware, data breach, DDoS)',
      'Understand regulatory compliance frameworks: ISO 27001, SOC 2, GDPR, and their security implications'
    ],
    resources: [
      { title: 'Splunk – Incident Response Guide', url: 'https://www.splunk.com/en_us/blog/learn/incident-response.html', type: 'article' },
      { title: 'Wireshark Network Analysis Documentation', url: 'https://www.wireshark.org/docs/', type: 'article' },
      { title: 'NIST Computer Security Incident Handling Guide', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf', type: 'article' },
      { title: 'Blue Team Labs Online – SOC Practice', url: 'https://blueteamlabs.online/', type: 'tool' }
    ]
  },

  // ── Cloud Engineering ──
  {
    pathSlug: 'cloud-engineering',
    stageNumber: 1,
    title: 'Cloud Fundamentals & Core AWS Services',
    outcomes: [
      'Understand cloud computing models: IaaS, PaaS, SaaS, and when to use each',
      'Navigate the AWS Console and understand the shared responsibility model',
      'Launch and configure EC2 instances: instance types, security groups, and key pairs',
      'Store files in S3: create buckets, configure access policies, and enable static website hosting',
      'Configure DNS using Route 53 and attach SSL/TLS certificates via AWS Certificate Manager',
      'Set up a CloudFront CDN distribution to cache and serve S3 assets globally with HTTPS'
    ],
    resources: [
      { title: 'roadmap.sh DevOps Roadmap', url: 'https://roadmap.sh/devops', type: 'course' },
      { title: 'AWS Getting Started – S3 & CloudFront Guide', url: 'https://aws.amazon.com/getting-started/guides/setup-s3-cloudfront/', type: 'article' },
      { title: 'AWS Skill Builder – Cloud Practitioner', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials', type: 'course' },
      { title: 'Cloudflare Fundamentals Documentation', url: 'https://developers.cloudflare.com/fundamentals/', type: 'article' }
    ]
  },
  {
    pathSlug: 'cloud-engineering',
    stageNumber: 2,
    title: 'Networking, Security & Identity in the Cloud',
    outcomes: [
      'Design VPCs with public and private subnets, route tables, Internet Gateways, and NAT Gateways',
      'Configure Security Groups as stateful firewalls and NACLs as stateless subnet-level controls',
      'Implement IAM roles, policies, and instance profiles following the Least Privilege principle',
      'Understand VPC peering, VPN connections, and AWS PrivateLink for private service connectivity',
      'Enable AWS CloudTrail and CloudWatch to audit API calls and monitor resource metrics',
      'Use AWS Secrets Manager or Parameter Store to manage sensitive credentials at runtime'
    ],
    resources: [
      { title: 'AWS VPC Documentation', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/', type: 'article' },
      { title: 'AWS IAM Best Practices', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', type: 'article' },
      { title: 'A Cloud Guru – AWS Solutions Architect', url: 'https://acloudguru.com/course/aws-certified-solutions-architect-associate', type: 'course' },
      { title: 'AWS Security Reference Architecture', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/', type: 'article' }
    ]
  },
  {
    pathSlug: 'cloud-engineering',
    stageNumber: 3,
    title: 'Infrastructure as Code with Terraform',
    outcomes: [
      'Write Terraform configurations using providers, resources, variables, outputs, and locals',
      'Manage Terraform state using remote backends (S3 + DynamoDB for locking)',
      'Organise infrastructure code into reusable modules with clear input/output contracts',
      'Apply Terraform workspaces or separate directories to manage dev, staging, and production environments',
      'Use data sources and dynamic blocks to make configurations flexible and DRY',
      'Validate and review infrastructure changes with terraform plan before applying to production'
    ],
    resources: [
      { title: 'HashiCorp Terraform Documentation', url: 'https://developer.hashicorp.com/terraform/docs', type: 'article' },
      { title: 'Terraform Registry – Modules Library', url: 'https://registry.terraform.io/', type: 'tool' },
      { title: 'Terraform Up & Running – Yevgeniy Brikman', url: 'https://www.terraformupandrunning.com/', type: 'book' },
      { title: 'Gruntwork – Terraform Best Practices', url: 'https://gruntwork.io/guides/', type: 'article' }
    ]
  },
  {
    pathSlug: 'cloud-engineering',
    stageNumber: 4,
    title: 'CI/CD Pipelines & GitOps',
    outcomes: [
      'Build multi-stage GitHub Actions workflows: lint → test → build → deploy with environment gates',
      'Cache dependencies and Docker layer builds in CI to reduce pipeline run times',
      'Implement GitOps principles: declarative infrastructure, PR-based deployments, and audit trails',
      'Set up branch protection rules and require CI checks to pass before merging to main',
      'Deploy containerised applications automatically on merge using Terraform or platform APIs',
      'Configure deployment notifications, rollback triggers, and post-deploy smoke tests in pipelines'
    ],
    resources: [
      { title: 'GitHub Actions Official Documentation', url: 'https://docs.github.com/en/actions', type: 'article' },
      { title: 'GitLab CI/CD Documentation', url: 'https://docs.gitlab.com/ee/ci/', type: 'article' },
      { title: 'ArgoCD – GitOps for Kubernetes', url: 'https://argo-cd.readthedocs.io/en/stable/', type: 'article' },
      { title: 'CI/CD Best Practices – GitLab', url: 'https://about.gitlab.com/topics/ci-cd/', type: 'article' }
    ]
  },
  {
    pathSlug: 'cloud-engineering',
    stageNumber: 5,
    title: 'Kubernetes, Auto-Scaling & Production Reliability',
    outcomes: [
      'Understand Kubernetes architecture: control plane, nodes, pods, deployments, services, and ingress',
      'Write Kubernetes manifest YAML files for deployments, ConfigMaps, Secrets, and PersistentVolumes',
      'Configure Horizontal Pod Autoscalers (HPA) and Cluster Autoscalers for dynamic scaling',
      'Deploy applications to a managed Kubernetes cluster (EKS, GKE, or AKS) using kubectl and Helm charts',
      'Implement observability with Prometheus metrics, Grafana dashboards, and structured log aggregation',
      'Design disaster recovery strategies: multi-AZ deployments, RTO/RPO targets, and backup policies'
    ],
    resources: [
      { title: 'Kubernetes Official Tutorials', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', type: 'course' },
      { title: 'AWS Auto Scaling & Load Balancing Docs', url: 'https://docs.aws.amazon.com/autoscaling/', type: 'article' },
      { title: 'Helm – Kubernetes Package Manager', url: 'https://helm.sh/docs/', type: 'article' },
      { title: 'The DevOps Handbook – Kim, Humble, Willis', url: 'https://itrevolution.com/product/the-devops-handbook/', type: 'book' }
    ]
  },

  // ── Digital Marketing ──
  {
    pathSlug: 'digital-marketing',
    stageNumber: 1,
    title: 'Marketing Fundamentals & Audience Strategy',
    outcomes: [
      'Understand the marketing funnel: Awareness, Interest, Desire, Action (AIDA)',
      'Define target audience personas using demographics, psychographics, and behavioural data',
      'Identify primary and secondary marketing channels: organic, paid, email, social, and partnerships',
      'Write compelling ad headlines and body copy using proven frameworks: PAS, AIDA, and 4Cs',
      'Analyse a brand\'s existing digital presence: website, SEO, social media, and ad spend',
      'Understand brand positioning and how to craft value propositions that differentiate in a market'
    ],
    resources: [
      { title: 'HubSpot Digital Marketing Certification', url: 'https://academy.hubspot.com/courses/digital-marketing', type: 'course' },
      { title: 'Copyblogger – Copywriting 101', url: 'https://copyblogger.com/copywriting-101/', type: 'article' },
      { title: 'Meta Blueprint – Advertising Fundamentals', url: 'https://www.facebook.com/business/learn', type: 'course' },
      { title: 'Seth Godin – This is Marketing', url: 'https://seths.blog/', type: 'book' }
    ]
  },
  {
    pathSlug: 'digital-marketing',
    stageNumber: 2,
    title: 'SEO & Organic Content Marketing',
    outcomes: [
      'Conduct keyword research to identify high-intent, low-competition ranking opportunities',
      'Map keywords to content topics across funnel stages and create a content cluster strategy',
      'Optimise pages for on-page SEO: title tags, meta descriptions, H1-H3 structure, and internal linking',
      'Build high-quality backlinks through digital PR, guest posting, and content partnerships',
      'Analyse organic search performance using Google Search Console: impressions, clicks, CTR, and position',
      'Understand technical SEO: site speed, Core Web Vitals, mobile-friendliness, and crawl errors'
    ],
    resources: [
      { title: 'Moz – Beginner\'s Guide to SEO', url: 'https://moz.com/beginners-guide-to-seo', type: 'book' },
      { title: 'Ahrefs SEO Learning Hub', url: 'https://ahrefs.com/seo', type: 'course' },
      { title: 'Google Search Central – SEO Starter Guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide', type: 'article' },
      { title: 'Semrush – Keyword Research Guide', url: 'https://www.semrush.com/blog/keyword-research-guide/', type: 'article' }
    ]
  },
  {
    pathSlug: 'digital-marketing',
    stageNumber: 3,
    title: 'Paid Media: Google Ads & Social Advertising',
    outcomes: [
      'Set up and structure Google Search campaigns: keyword match types, ad groups, and quality scores',
      'Write responsive search ads (RSAs) with headlines and descriptions matching different intent signals',
      'Configure audience targeting in Meta Ads: Custom Audiences, Lookalike Audiences, and interest targeting',
      'Manage bidding strategies: CPC, CPA, ROAS, and maximise conversions with automated bidding',
      'Set up conversion tracking in Google Ads and Meta Ads using pixel events and server-side tracking',
      'Analyse campaign performance: CTR, CPC, CPM, CPA, ROAS, and optimise underperforming ad sets'
    ],
    resources: [
      { title: 'Google Skillshop – Google Ads Certification', url: 'https://skillshop.google.com/', type: 'course' },
      { title: 'Meta Blueprint – Advertising Courses', url: 'https://www.facebook.com/business/learn', type: 'course' },
      { title: 'Semrush – SEM Basics Tutorial', url: 'https://www.semrush.com/blog/sem-basics/', type: 'article' },
      { title: 'WordStream – PPC University', url: 'https://www.wordstream.com/ppc-university', type: 'course' }
    ]
  },
  {
    pathSlug: 'digital-marketing',
    stageNumber: 4,
    title: 'Email Marketing, Automation & CRO',
    outcomes: [
      'Build segmented email lists and design onboarding sequences for new subscribers',
      'Write personalised email campaigns with dynamic content blocks for different audience segments',
      'Set up automated drip sequences: welcome series, re-engagement, and cart abandonment flows',
      'Design and run A/B tests on email subject lines, CTAs, and landing page variants',
      'Optimise landing pages for conversion: headline, social proof, CTA placement, and form friction',
      'Track and improve email KPIs: open rate, CTR, conversion rate, and list growth rate'
    ],
    resources: [
      { title: 'Mailchimp – Email Marketing Field Guide', url: 'https://mailchimp.com/resources/email-marketing-field-guide/', type: 'book' },
      { title: 'Klaviyo – Email & SMS Marketing Guides', url: 'https://www.klaviyo.com/marketing-resources', type: 'article' },
      { title: 'ConversionXL – CRO Research & Articles', url: 'https://cxl.com/blog/', type: 'article' },
      { title: 'Optimizely – A/B Testing Guide', url: 'https://www.optimizely.com/optimization-glossary/ab-testing/', type: 'article' }
    ]
  },
  {
    pathSlug: 'digital-marketing',
    stageNumber: 5,
    title: 'Analytics, Attribution & Growth Strategy',
    outcomes: [
      'Configure Google Analytics 4: custom events, conversions, audiences, and funnel exploration reports',
      'Implement UTM parameter conventions for accurate campaign attribution across all channels',
      'Build multi-touch attribution models to understand the true contribution of each marketing channel',
      'Create marketing dashboards in Looker Studio or Data Studio pulling from GA4, Ads, and CRM data',
      'Apply growth frameworks (AARRR: Acquisition, Activation, Retention, Referral, Revenue) to diagnose bottlenecks',
      'Build a $10,000 multi-channel budget allocation model with CPC, CTR, CPA, and ROAS projections'
    ],
    resources: [
      { title: 'Google Analytics 4 – Skillshop Certification', url: 'https://skillshop.exceedlms.com/student/catalog/list?category_ids=6431-google-analytics-4', type: 'course' },
      { title: 'Reforge – Growth Marketing Deep Dives', url: 'https://www.reforge.com/', type: 'course' },
      { title: 'Looker Studio (Data Studio) Help', url: 'https://support.google.com/looker-studio', type: 'article' },
      { title: 'Growth Hackers – Community & Resources', url: 'https://growthhackers.com/', type: 'article' }
    ]
  },

  // ── Machine Learning Engineering ──
  {
    pathSlug: 'machine-learning-engineering',
    stageNumber: 1,
    title: 'Python, Mathematics & Data Preparation',
    outcomes: [
      'Write clean Python using functions, list comprehensions, classes, and virtual environments',
      'Understand linear algebra for ML: vectors, matrix multiplication, dot products, and eigenvalues',
      'Apply probability and statistics: distributions, Bayes\' theorem, hypothesis testing, and p-values',
      'Load, clean, and transform datasets with pandas: handling nulls, outliers, and data type conversions',
      'Perform feature engineering: encoding categoricals, scaling numerics, and creating interaction features',
      'Split datasets into train/validation/test sets and understand the bias-variance tradeoff'
    ],
    resources: [
      { title: 'roadmap.sh AI Engineer Roadmap', url: 'https://roadmap.sh/ai-engineer', type: 'course' },
      { title: 'Kaggle – Python & ML Courses', url: 'https://www.kaggle.com/learn', type: 'course' },
      { title: '3Blue1Brown – Essence of Linear Algebra (YouTube)', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'course' },
      { title: 'Python Data Science Handbook – Jake VanderPlas', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'book' }
    ]
  },
  {
    pathSlug: 'machine-learning-engineering',
    stageNumber: 2,
    title: 'Classical Machine Learning with scikit-learn',
    outcomes: [
      'Train and evaluate supervised models: Linear Regression, Logistic Regression, Decision Trees, and Random Forests',
      'Apply unsupervised learning: K-Means clustering, PCA for dimensionality reduction, and DBSCAN',
      'Use cross-validation (k-fold) and hyperparameter tuning (GridSearchCV, RandomizedSearchCV) to optimise models',
      'Evaluate models with appropriate metrics: Accuracy, Precision, Recall, F1, ROC-AUC, and RMSE',
      'Build end-to-end scikit-learn Pipelines combining preprocessing and model steps into a single object',
      'Handle class imbalance using oversampling (SMOTE), undersampling, and class weight adjustments'
    ],
    resources: [
      { title: 'scikit-learn Documentation & User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'article' },
      { title: 'Kaggle – Intermediate Machine Learning', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', type: 'course' },
      { title: 'Hands-On Machine Learning – Aurélien Géron (O\'Reilly)', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/', type: 'book' },
      { title: 'StatQuest – ML Concepts Explained (YouTube)', url: 'https://www.youtube.com/@statquest', type: 'course' }
    ]
  },
  {
    pathSlug: 'machine-learning-engineering',
    stageNumber: 3,
    title: 'Deep Learning & Neural Networks',
    outcomes: [
      'Understand how neural networks learn: forward pass, backpropagation, gradient descent, and activation functions',
      'Build and train feedforward neural networks using PyTorch with custom Dataset and DataLoader classes',
      'Design Convolutional Neural Networks (CNNs) for image classification and understand pooling layers',
      'Apply transfer learning: fine-tune pretrained models (ResNet, EfficientNet) on custom datasets',
      'Prevent overfitting using dropout, batch normalisation, data augmentation, and early stopping',
      'Plot and interpret training curves (loss, accuracy) to diagnose underfitting and overfitting'
    ],
    resources: [
      { title: 'PyTorch Official Tutorials', url: 'https://pytorch.org/tutorials/', type: 'course' },
      { title: 'Fast.ai – Practical Deep Learning for Coders', url: 'https://course.fast.ai/', type: 'course' },
      { title: 'TensorFlow Core Guides', url: 'https://www.tensorflow.org/guide', type: 'article' },
      { title: 'Deep Learning Book – Goodfellow et al. (free online)', url: 'https://www.deeplearningbook.org/', type: 'book' }
    ]
  },
  {
    pathSlug: 'machine-learning-engineering',
    stageNumber: 4,
    title: 'NLP, Transformers & Generative AI',
    outcomes: [
      'Preprocess text data: tokenisation, stop word removal, stemming, lemmatisation, and TF-IDF vectorisation',
      'Understand the Transformer architecture: self-attention, multi-head attention, and positional encoding',
      'Fine-tune pretrained language models (BERT, RoBERTa) using Hugging Face Transformers for classification',
      'Use the Hugging Face Hub to load, run, and evaluate models for NLP tasks (NER, QA, summarisation)',
      'Build a RAG (Retrieval-Augmented Generation) pipeline using embeddings and a vector database (Pinecone, Chroma)',
      'Evaluate LLM outputs using BLEU, ROUGE, and human evaluation rubrics for generative tasks'
    ],
    resources: [
      { title: 'Hugging Face – NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'course' },
      { title: 'Andrej Karpathy – Neural Networks: Zero to Hero (YouTube)', url: 'https://www.youtube.com/@AndrejKarpathy', type: 'course' },
      { title: 'LangChain – LLM Application Framework Docs', url: 'https://python.langchain.com/docs/get_started/introduction', type: 'article' },
      { title: 'Pinecone – Vector Database Learning Centre', url: 'https://www.pinecone.io/learn/', type: 'article' }
    ]
  },
  {
    pathSlug: 'machine-learning-engineering',
    stageNumber: 5,
    title: 'MLOps, Model Deployment & Production Monitoring',
    outcomes: [
      'Serialise trained models using joblib or ONNX and expose predictions via FastAPI REST endpoints',
      'Containerise ML services with Docker and deploy to cloud platforms (AWS SageMaker, GCP Vertex AI, Render)',
      'Register versioned models in MLflow: track experiments, log metrics, and compare model runs',
      'Build automated retraining pipelines using Prefect or Apache Airflow triggered by data drift',
      'Monitor production models for data drift, prediction drift, and feature distribution shifts using Evidently AI',
      'Implement A/B testing for model variants in production and safely roll back underperforming models'
    ],
    resources: [
      { title: 'FastAPI – Web Service Tutorial', url: 'https://fastapi.tiangolo.com/tutorial/', type: 'article' },
      { title: 'MLflow – Model Registry Guide', url: 'https://mlflow.org/docs/latest/model-registry.html', type: 'article' },
      { title: 'Evidently AI – Drift Monitoring Docs', url: 'https://docs.evidentlyai.com/', type: 'article' },
      { title: 'Made With ML – MLOps Course', url: 'https://madewithml.com/', type: 'course' }
    ]
  }
];

const TASKS = [...TASKS_PART_1, ...TASKS_PART_2, ...TASKS_PART_3, ...TASKS_PART_4];

const SEED_COMPANIES = [
  {
    email: 'hire@buildco.io',
    password: 'Seed1234!',
    company: { name: 'BuildCo', description: 'We build B2B SaaS tools for operations teams.', website: 'https://buildco.io', industry: 'Technology', size: '11–50' },
    roles: [
      { title: 'Junior Frontend Engineer', description: 'Join our product team to build the interfaces our customers use every day. You will work with React, TypeScript, and a modern design system.', tags: ['React', 'TypeScript', 'CSS'], pathSlugs: ['frontend-engineering'], experienceLevel: 'Beginner', region: 'Europe' },
      { title: 'Product Designer', description: 'We are looking for a product designer to own the end-to-end design of our core product. You will run research, create prototypes, and work closely with engineers.', tags: ['Figma', 'UX', 'Research'], pathSlugs: ['product-design'], experienceLevel: 'Intermediate', region: 'Europe' },
    ],
  },
  {
    email: 'talent@dataworks.io',
    password: 'Seed1234!',
    company: { name: 'DataWorks', description: 'A data consultancy helping mid-size businesses make better decisions with their data.', website: 'https://dataworks.io', industry: 'Technology', size: '51–200' },
    roles: [
      { title: 'Data Analyst', description: 'Help our clients answer their most important business questions through data. You will work with SQL, Python, and Tableau to deliver insights and dashboards.', tags: ['SQL', 'Python', 'Tableau'], pathSlugs: ['data-analysis'], experienceLevel: 'Beginner', region: 'West Africa' },
    ],
  },
  {
    email: 'careers@launchpm.co',
    password: 'Seed1234!',
    company: { name: 'LaunchPM', description: 'An early-stage startup building the next generation of project management tools.', website: 'https://launchpm.co', industry: 'Technology', size: '1-10' },
    roles: [
      { title: 'Associate Product Manager', description: 'A rare opportunity to join as an APM at an early-stage startup. You will own features end-to-end, run user research, and write specs that ship.', tags: ['Strategy', 'Agile', 'Roadmapping'], pathSlugs: ['product-management'], experienceLevel: 'Beginner', region: 'North America' },
      { title: 'Content Strategist', description: 'Own our content presence from blog to in-app copy. You will define our voice, build an editorial calendar, and grow our audience from the ground up.', tags: ['Writing', 'SEO', 'Editorial'], pathSlugs: ['content-strategy'], experienceLevel: 'Intermediate', region: 'North America' },
    ],
  },
];

async function main() {
  console.log('Seeding career paths...');
  for (const path of CAREER_PATHS) {
    await prisma.careerPath.upsert({
      where: { slug: path.slug },
      update: {
        name: path.name,
        description: path.description,
        tags: path.tags,
      },
      create: path,
    });
  }

  console.log('Seeding roadmap stages...');
  // We need to clean up old stages to avoid stage number mismatch if there were 5
  await prisma.roadmapStage.deleteMany({});
  for (const stage of ROADMAP_STAGES) {
    await prisma.roadmapStage.create({
      data: stage,
    });
  }

  console.log('Seeding tasks...');
  // Clean up old tasks to support the new schema and 3-tier tasks
  await prisma.task.deleteMany({});
  for (const task of TASKS) {
    await prisma.task.create({
      data: {
        ...task,
        status: 'active',
      },
    });
  }

  console.log('Seeding companies and roles...');
  for (const seed of SEED_COMPANIES) {
    let user = await prisma.user.findUnique({ where: { email: seed.email } });
    if (!user) {
      const passwordHash = await bcrypt.hash(seed.password, 10);
      user = await prisma.user.create({ data: { email: seed.email, passwordHash, role: 'employer' } });
    }

    let company = await prisma.company.findUnique({ where: { userId: user.id } });
    if (!company) {
      company = await prisma.company.create({ data: { userId: user.id, ...seed.company } });
    }

    for (const role of seed.roles) {
      const existing = await prisma.roleOpening.findFirst({
        where: { companyId: company.id, title: role.title },
      });
      if (!existing) {
        await prisma.roleOpening.create({ data: { companyId: company.id, ...role, status: 'open' } });
      }
    }
  }

  console.log(`Seeded ${CAREER_PATHS.length} paths, ${ROADMAP_STAGES.length} stages, ${TASKS.length} tasks, and ${SEED_COMPANIES.length} companies with roles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

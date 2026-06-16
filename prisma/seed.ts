import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const CAREER_PATHS = [
  {
    slug: 'product-design',
    name: 'Product Design',
    description: 'Design digital products that solve real user problems',
    tags: ['Design', 'UX', 'Figma', 'Research', 'Prototyping'],
  },
  {
    slug: 'frontend-engineering',
    name: 'Frontend Engineering',
    description: 'Build the interfaces users interact with on the web',
    tags: ['React', 'JavaScript', 'CSS', 'TypeScript', 'Web'],
  },
  {
    slug: 'data-analysis',
    name: 'Data Analysis',
    description: 'Turn raw data into insights that drive business decisions',
    tags: ['SQL', 'Python', 'Excel', 'Visualisation', 'Statistics'],
  },
  {
    slug: 'product-management',
    name: 'Product Management',
    description: 'Define what gets built and why, bridging tech and business',
    tags: ['Strategy', 'Roadmapping', 'Stakeholders', 'Agile', 'Metrics'],
  },
  {
    slug: 'content-strategy',
    name: 'Content Strategy',
    description: 'Shape how brands communicate and connect with audiences',
    tags: ['Writing', 'SEO', 'Brand', 'Editorial', 'Distribution'],
  },
];

const ROADMAP_STAGES = [
  // product-design
  { pathSlug: 'product-design', stageNumber: 1, title: 'Design foundations', outcomes: ['Understand core UX principles and design thinking', 'Learn visual design basics: layout, typography, colour', 'Set up and navigate Figma confidently'], resources: [{ title: 'Google UX Design Certificate', url: 'https://grow.google/certificates/ux-design/', type: 'course' }, { title: 'Refactoring UI', url: 'https://www.refactoringui.com', type: 'book' }, { title: 'Figma beginner tutorial', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', type: 'video' }] },
  { pathSlug: 'product-design', stageNumber: 2, title: 'Visual language', outcomes: ['Build a personal design system with reusable components', 'Apply colour theory and typographic hierarchy in real work', 'Critique and give structured feedback on design work'], resources: [{ title: 'Design systems handbook', url: 'https://www.designbetter.co/design-systems-handbook', type: 'book' }, { title: 'Typescale tool', url: 'https://typescale.com', type: 'tool' }, { title: 'Laws of UX', url: 'https://lawsofux.com', type: 'article' }] },
  { pathSlug: 'product-design', stageNumber: 3, title: 'Interaction design', outcomes: ['Design interactive prototypes with realistic flows', 'Apply micro-interaction principles to improve usability', 'Conduct usability tests and iterate on findings'], resources: [{ title: 'Prototyping in Figma', url: 'https://help.figma.com/hc/en-us/categories/360002051613', type: 'article' }, { title: 'Nielsen Norman Group articles', url: 'https://www.nngroup.com/articles/', type: 'article' }, { title: 'Maze usability testing tool', url: 'https://maze.co', type: 'tool' }] },
  { pathSlug: 'product-design', stageNumber: 4, title: 'Product thinking', outcomes: ['Understand how design decisions connect to business outcomes', 'Write clear design briefs and problem statements', 'Collaborate effectively with PMs and engineers'], resources: [{ title: 'Inspired by Marty Cagan', url: 'https://www.svpg.com/books/inspired/', type: 'book' }, { title: "Lenny's Newsletter", url: 'https://www.lennysnewsletter.com', type: 'article' }, { title: 'Product design case study guide', url: 'https://www.uxdesigninstitute.com/blog/ux-case-study/', type: 'article' }] },
  { pathSlug: 'product-design', stageNumber: 5, title: 'Portfolio and career', outcomes: ['Build a case study portfolio with 3 strong projects', 'Write compelling case studies that explain your process', 'Prepare for design interviews and portfolio reviews'], resources: [{ title: 'Bestfolios — portfolio inspiration', url: 'https://www.bestfolios.com', type: 'article' }, { title: 'Read.cv', url: 'https://read.cv', type: 'tool' }, { title: 'Design interview prep guide', url: 'https://www.productdesigninterview.com', type: 'article' }] },
  // frontend-engineering
  { pathSlug: 'frontend-engineering', stageNumber: 1, title: 'Web fundamentals', outcomes: ['Write semantic HTML and understand document structure', 'Style pages with CSS including flexbox and grid', 'Write basic JavaScript including DOM manipulation'], resources: [{ title: 'The Odin Project', url: 'https://www.theodinproject.com', type: 'course' }, { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'article' }, { title: 'CSS Tricks', url: 'https://css-tricks.com', type: 'article' }] },
  { pathSlug: 'frontend-engineering', stageNumber: 2, title: 'JavaScript and TypeScript', outcomes: ['Understand JavaScript deeply including async, promises, closures', 'Write TypeScript with proper types and interfaces', 'Work confidently with APIs using fetch and axios'], resources: [{ title: 'JavaScript.info', url: 'https://javascript.info', type: 'article' }, { title: 'TypeScript handbook', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'article' }, { title: 'Execute Program', url: 'https://www.executeprogram.com', type: 'course' }] },
  { pathSlug: 'frontend-engineering', stageNumber: 3, title: 'React and component thinking', outcomes: ['Build applications with React using hooks and state management', 'Understand component architecture and reusability', 'Fetch and display data from real APIs in a React app'], resources: [{ title: 'React documentation', url: 'https://react.dev', type: 'article' }, { title: 'Build a React app from scratch — tutorial', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', type: 'video' }, { title: 'React Query docs', url: 'https://tanstack.com/query/latest', type: 'article' }] },
  { pathSlug: 'frontend-engineering', stageNumber: 4, title: 'Tooling and best practices', outcomes: ['Use Git and GitHub confidently for version control', 'Configure and use a modern build tool like Vite or Next.js', 'Write tests for components using Jest or Vitest'], resources: [{ title: 'Pro Git book', url: 'https://git-scm.com/book/en/v2', type: 'book' }, { title: 'Next.js documentation', url: 'https://nextjs.org/docs', type: 'article' }, { title: 'Testing library docs', url: 'https://testing-library.com/docs/', type: 'article' }] },
  { pathSlug: 'frontend-engineering', stageNumber: 5, title: 'Portfolio and career', outcomes: ['Build and deploy 2 full projects using your full stack', 'Write a strong developer README and GitHub profile', 'Prepare for frontend technical interviews'], resources: [{ title: 'Frontend interview handbook', url: 'https://www.frontendinterviewhandbook.com', type: 'article' }, { title: 'Netlify — free deployment', url: 'https://www.netlify.com', type: 'tool' }, { title: 'GitHub profile README guide', url: 'https://github.com/abhisheknaiidu/awesome-github-profile-readme', type: 'article' }] },
  // data-analysis
  { pathSlug: 'data-analysis', stageNumber: 1, title: 'Data literacy and spreadsheets', outcomes: ['Understand how data is structured: rows, columns, types, and relationships', 'Use Excel or Google Sheets for data cleaning, formulas, and pivot tables', 'Distinguish between descriptive, diagnostic, predictive, and prescriptive analytics'], resources: [{ title: 'Google Sheets for Beginners', url: 'https://edu.gcfglobal.org/en/googlespreadsheets/', type: 'course' }, { title: 'Data Literacy by Tableau', url: 'https://www.tableau.com/learn/articles/data-literacy', type: 'article' }, { title: 'Excel for Data Analysis — freeCodeCamp', url: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', type: 'video' }] },
  { pathSlug: 'data-analysis', stageNumber: 2, title: 'SQL and database querying', outcomes: ['Write SQL queries using SELECT, JOIN, GROUP BY, and window functions', 'Query relational databases to answer real business questions', 'Understand database schemas and how tables relate to each other'], resources: [{ title: 'SQLZoo interactive tutorial', url: 'https://sqlzoo.net', type: 'course' }, { title: 'Mode SQL tutorial', url: 'https://mode.com/sql-tutorial/', type: 'article' }, { title: 'SQL for Data Analysis — Udacity', url: 'https://www.udacity.com/course/sql-for-data-analysis--ud198', type: 'course' }] },
  { pathSlug: 'data-analysis', stageNumber: 3, title: 'Python for data analysis', outcomes: ['Use pandas to load, clean, and manipulate datasets', 'Perform exploratory data analysis and summarise findings', 'Visualise data with matplotlib and seaborn'], resources: [{ title: 'Kaggle Python course', url: 'https://www.kaggle.com/learn/python', type: 'course' }, { title: 'pandas documentation', url: 'https://pandas.pydata.org/docs/', type: 'article' }, { title: 'Python for Data Analysis by Wes McKinney', url: 'https://wesmckinney.com/book/', type: 'book' }] },
  { pathSlug: 'data-analysis', stageNumber: 4, title: 'Data visualisation and storytelling', outcomes: ['Build interactive dashboards in Tableau or Power BI', 'Choose the right chart type for every data story', 'Present data findings clearly to non-technical stakeholders'], resources: [{ title: 'Tableau Public — free tool', url: 'https://public.tableau.com', type: 'tool' }, { title: 'Storytelling with Data by Cole Nussbaumer', url: 'https://www.storytellingwithdata.com/books', type: 'book' }, { title: 'Data visualisation catalogue', url: 'https://datavizcatalogue.com', type: 'article' }] },
  { pathSlug: 'data-analysis', stageNumber: 5, title: 'Portfolio and career', outcomes: ['Complete 2 end-to-end data projects published on GitHub or Kaggle', 'Build a portfolio page or Notion site showcasing your analyses', 'Prepare for data analyst interviews including SQL and case study rounds'], resources: [{ title: 'Kaggle datasets for projects', url: 'https://www.kaggle.com/datasets', type: 'tool' }, { title: 'Data analyst interview questions — Stratascratch', url: 'https://www.stratascratch.com', type: 'article' }, { title: 'Google Data Analytics Certificate', url: 'https://grow.google/certificates/data-analytics/', type: 'course' }] },
  // product-management
  { pathSlug: 'product-management', stageNumber: 1, title: 'PM fundamentals', outcomes: ['Understand the role of a product manager and how it differs from a project manager', 'Learn the product development lifecycle from discovery to launch', 'Identify stakeholders and understand how to work across design, engineering, and business'], resources: [{ title: 'Inspired by Marty Cagan', url: 'https://www.svpg.com/books/inspired/', type: 'book' }, { title: 'Product School PM fundamentals', url: 'https://productschool.com/blog/product-fundamentals/what-is-product-management/', type: 'article' }, { title: "Lenny's Podcast", url: 'https://www.lennyspodcast.com', type: 'article' }] },
  { pathSlug: 'product-management', stageNumber: 2, title: 'User research and discovery', outcomes: ['Conduct user interviews and synthesise findings into insights', 'Write clear problem statements and opportunity definitions', 'Prioritise problems using frameworks like RICE, ICE, and Jobs to be Done'], resources: [{ title: 'Just Enough Research by Erika Hall', url: 'https://abookapart.com/products/just-enough-research', type: 'book' }, { title: 'Jobs to be Done framework', url: 'https://jobs-to-be-done.com', type: 'article' }, { title: 'Dovetail — user research tool', url: 'https://dovetail.com', type: 'tool' }] },
  { pathSlug: 'product-management', stageNumber: 3, title: 'Strategy and roadmapping', outcomes: ['Write a compelling product vision and strategy document', 'Build and communicate a product roadmap to stakeholders', 'Make prioritisation decisions and defend them with data'], resources: [{ title: 'Product roadmaps relaunched — Productboard guide', url: 'https://www.productboard.com/blog/product-roadmap/', type: 'article' }, { title: 'Figma FigJam — free roadmap tool', url: 'https://www.figma.com/figjam/', type: 'tool' }, { title: 'Continuous Discovery Habits by Teresa Torres', url: 'https://www.producttalk.org/2021/05/continuous-discovery-habits/', type: 'book' }] },
  { pathSlug: 'product-management', stageNumber: 4, title: 'Execution and metrics', outcomes: ['Write user stories, acceptance criteria, and detailed specs', 'Run agile ceremonies: sprint planning, standups, and retrospectives', 'Define and track product metrics using a North Star framework'], resources: [{ title: 'Atlassian agile guide', url: 'https://www.atlassian.com/agile', type: 'article' }, { title: 'Amplitude — product analytics tool', url: 'https://amplitude.com', type: 'tool' }, { title: 'Measure What Matters by John Doerr', url: 'https://www.whatmatters.com/the-book/', type: 'book' }] },
  { pathSlug: 'product-management', stageNumber: 5, title: 'Portfolio and career', outcomes: ['Document 2 product projects with problem, approach, outcome, and learnings', 'Build a PM portfolio page that demonstrates strategic and execution skills', 'Prepare for PM interviews including product sense, analytical, and behavioural rounds'], resources: [{ title: 'Exponent PM interview prep', url: 'https://www.tryexponent.com/courses/pm', type: 'course' }, { title: 'PM exercises — practice questions', url: 'https://www.pmexercises.com', type: 'article' }, { title: 'Notion — free portfolio builder', url: 'https://www.notion.so', type: 'tool' }] },
  // content-strategy
  { pathSlug: 'content-strategy', stageNumber: 1, title: 'Writing and communication foundations', outcomes: ['Write clearly and concisely for digital audiences', 'Understand tone of voice and how it shapes brand perception', 'Apply principles of plain language and user-centred writing'], resources: [{ title: 'On Writing Well by William Zinsser', url: 'https://www.harpercollins.com/products/on-writing-well-william-zinsser', type: 'book' }, { title: 'Hemingway Editor — writing clarity tool', url: 'https://hemingwayapp.com', type: 'tool' }, { title: 'Nielsen Norman Group — writing for the web', url: 'https://www.nngroup.com/topic/writing-web/', type: 'article' }] },
  { pathSlug: 'content-strategy', stageNumber: 2, title: 'Content strategy and planning', outcomes: ['Conduct a content audit and identify gaps in an existing content library', 'Build an editorial calendar aligned to audience needs and business goals', 'Define content pillars and a messaging framework for a brand'], resources: [{ title: 'Content Strategy for the Web by Kristina Halvorson', url: 'https://www.contentstrategy.com', type: 'book' }, { title: 'Airtable — editorial calendar tool', url: 'https://www.airtable.com/templates/editorial-calendar', type: 'tool' }, { title: 'Content marketing institute — strategy guide', url: 'https://contentmarketinginstitute.com/articles/content-marketing-strategy/', type: 'article' }] },
  { pathSlug: 'content-strategy', stageNumber: 3, title: 'SEO and discoverability', outcomes: ['Perform keyword research and map keywords to content topics', 'Optimise on-page SEO: titles, meta descriptions, headings, and internal links', 'Understand how content distribution and backlinks affect search ranking'], resources: [{ title: 'Ahrefs SEO beginner guide', url: 'https://ahrefs.com/seo', type: 'article' }, { title: 'Google Search Console', url: 'https://search.google.com/search-console/about', type: 'tool' }, { title: 'Keyword research with Ubersuggest', url: 'https://neilpatel.com/ubersuggest/', type: 'tool' }] },
  { pathSlug: 'content-strategy', stageNumber: 4, title: 'Distribution and growth', outcomes: ['Build and execute a multi-channel content distribution strategy', 'Grow and manage an email newsletter audience', 'Measure content performance using analytics and iterate based on data'], resources: [{ title: 'Substack — newsletter platform', url: 'https://substack.com', type: 'tool' }, { title: 'Buffer — social media scheduling tool', url: 'https://buffer.com', type: 'tool' }, { title: 'Content distribution playbook — SparkToro', url: 'https://sparktoro.com/blog/content-distribution-tactics/', type: 'article' }] },
  { pathSlug: 'content-strategy', stageNumber: 5, title: 'Portfolio and career', outcomes: ['Compile a writing portfolio with 5 pieces demonstrating range and strategy', 'Document a content strategy project from audit to results', 'Prepare for content and editorial interviews with a clear personal brand story'], resources: [{ title: 'Contently — professional writing portfolio', url: 'https://contently.com', type: 'tool' }, { title: 'Muck Rack — journalist and writer profiles', url: 'https://muckrack.com', type: 'tool' }, { title: 'Content strategy job interview questions — CMI', url: 'https://contentmarketinginstitute.com/articles/content-marketing-job-interview-questions/', type: 'article' }] },
];

const TASKS: {
  pathSlug: string;
  stageNumber: number;
  title: string;
  description: string;
  deliverables: string[];
  acceptanceCriteria: string[];
  difficulty: number;
}[] = [
  // product-design
  { pathSlug: 'product-design', stageNumber: 1, title: 'Redesign a mobile screen', description: 'Pick any app you use daily and redesign one screen to improve usability and visual appeal.', deliverables: ['Before/after screenshots', 'Annotated Figma frame explaining changes', 'Short written rationale (100–200 words)'], acceptanceCriteria: ['Submission includes both original and redesign', 'Changes are justified with UX reasoning', 'Figma file is shareable'], difficulty: 2 },
  { pathSlug: 'product-design', stageNumber: 2, title: 'Build a mini design system', description: 'Create a reusable component library in Figma with at least 8 components following a consistent visual language.', deliverables: ['Figma file with colour styles, text styles, and components', 'At least 8 components (button, input, card, badge, etc.)', 'Auto-layout used throughout'], acceptanceCriteria: ['Components use Figma variables or styles', 'All states (hover, active, disabled) are covered', 'File is well organised with named frames'], difficulty: 3 },
  { pathSlug: 'product-design', stageNumber: 3, title: 'Design an interactive prototype', description: 'Design a 4-screen user flow (e.g. onboarding, checkout) with working transitions in Figma.', deliverables: ['Figma prototype link with clickable interactions', 'User flow diagram', 'List of 3 usability decisions made and why'], acceptanceCriteria: ['Prototype is navigable without assistance', 'Transitions feel intentional and smooth', 'Flow covers a complete user journey'], difficulty: 3 },
  { pathSlug: 'product-design', stageNumber: 4, title: 'Write a design brief for a real problem', description: 'Identify a real-world problem and write a complete design brief including user research summary, problem statement, and success metrics.', deliverables: ['1–2 page design brief document', 'User persona', 'At least 3 success metrics defined'], acceptanceCriteria: ['Problem statement follows "How might we…" format', 'Research is primary or clearly cited', 'Metrics are measurable'], difficulty: 3 },
  { pathSlug: 'product-design', stageNumber: 5, title: 'Publish a design case study', description: 'Document one of your projects as a professional case study and publish it online.', deliverables: ['Published case study URL (Notion, portfolio site, or Behance)', 'Covers: problem, research, process, solution, results', 'At least 3 design artefacts included'], acceptanceCriteria: ['Case study is publicly accessible', 'Narrative clearly shows design thinking process', 'Visuals are high quality and properly captioned'], difficulty: 4 },

  // frontend-engineering
  { pathSlug: 'frontend-engineering', stageNumber: 1, title: 'Build a responsive landing page', description: 'Build a landing page from scratch using only HTML and CSS. No frameworks allowed.', deliverables: ['GitHub repo link', 'Live deployed URL (Netlify, Vercel, or GitHub Pages)', 'Responsive on mobile and desktop'], acceptanceCriteria: ['No CSS frameworks used', 'Page is valid HTML (passes W3C validator)', 'Works on screens from 375px to 1440px wide'], difficulty: 2 },
  { pathSlug: 'frontend-engineering', stageNumber: 2, title: 'Build a JavaScript weather app', description: 'Create a weather app that fetches live data from a public API and displays it to the user.', deliverables: ['GitHub repo with clear README', 'Live deployed URL', 'Search by city name feature'], acceptanceCriteria: ['Uses fetch or axios to call a real weather API', 'Handles loading and error states', 'TypeScript version is a bonus'], difficulty: 3 },
  { pathSlug: 'frontend-engineering', stageNumber: 3, title: 'Build a React task manager', description: 'Create a task manager app in React with full CRUD functionality and local state management.', deliverables: ['GitHub repo', 'Live deployed URL', 'README explaining component structure'], acceptanceCriteria: ['Uses React hooks (useState, useEffect)', 'Tasks persist in localStorage', 'Components are cleanly separated and reusable'], difficulty: 3 },
  { pathSlug: 'frontend-engineering', stageNumber: 4, title: 'Add testing to an existing project', description: 'Take one of your previous projects and add unit and integration tests with at least 70% coverage.', deliverables: ['GitHub repo with tests added', 'Coverage report screenshot', 'README updated with test instructions'], acceptanceCriteria: ['Tests run with a single command', 'At least 5 meaningful tests written', 'CI runs tests on push (GitHub Actions bonus)'], difficulty: 4 },
  { pathSlug: 'frontend-engineering', stageNumber: 5, title: 'Deploy a full-stack Next.js app', description: 'Build and deploy a full-stack Next.js app with at least one API route and a database connection.', deliverables: ['GitHub repo', 'Live deployed URL on Vercel', 'Short write-up of architecture decisions'], acceptanceCriteria: ['App is live and publicly accessible', 'Uses at least one server-side API route', 'Data persists between sessions'], difficulty: 5 },

  // data-analysis
  { pathSlug: 'data-analysis', stageNumber: 1, title: 'Clean and analyse a dataset in Google Sheets', description: 'Download a public dataset and perform data cleaning, summary statistics, and create at least 2 pivot tables.', deliverables: ['Shared Google Sheet link', 'Summary of 3 key findings', 'At least 2 pivot tables'], acceptanceCriteria: ['Dataset has at least 500 rows', 'Data cleaning steps are documented', 'Findings are written in plain English'], difficulty: 2 },
  { pathSlug: 'data-analysis', stageNumber: 2, title: 'Answer 5 business questions using SQL', description: 'Use a public SQL dataset (e.g. from BigQuery public data or Mode) to answer 5 business questions.', deliverables: ['SQL queries for all 5 questions', 'Results screenshots or CSV exports', 'Explanation of each finding'], acceptanceCriteria: ['At least 2 queries use JOINs', 'At least 1 query uses a window function', 'Questions are genuinely business-relevant'], difficulty: 3 },
  { pathSlug: 'data-analysis', stageNumber: 3, title: 'Exploratory data analysis with Python', description: 'Choose a Kaggle dataset and perform a full EDA using pandas, matplotlib, and seaborn. Publish as a Jupyter notebook.', deliverables: ['GitHub repo or Kaggle notebook link', 'At least 5 charts', 'Markdown cells explaining each section'], acceptanceCriteria: ['Notebook runs end-to-end without errors', 'Charts have titles, axis labels, and captions', 'At least one insight is non-obvious'], difficulty: 3 },
  { pathSlug: 'data-analysis', stageNumber: 4, title: 'Build a dashboard in Tableau or Power BI', description: 'Create an interactive dashboard with at least 4 charts that tells a coherent data story.', deliverables: ['Published Tableau Public or Power BI URL', 'Summary of the story the dashboard tells', 'At least 4 interactive charts'], acceptanceCriteria: ['Dashboard is publicly accessible', 'Charts are filtered or linked interactively', 'Colour and layout choices are intentional'], difficulty: 4 },
  { pathSlug: 'data-analysis', stageNumber: 5, title: 'End-to-end data project', description: 'Complete a full data project: define a question, gather data, analyse it, and present findings in a written report.', deliverables: ['Written report (PDF or Notion page)', 'Supporting analysis files (notebook, SQL, or spreadsheet)', 'Published link to report'], acceptanceCriteria: ['Report has clear introduction, methodology, findings, and conclusion', 'Data source is cited', 'Recommendations are data-driven'], difficulty: 5 },

  // product-management
  { pathSlug: 'product-management', stageNumber: 1, title: 'Write a product teardown', description: 'Choose an app you use regularly and write a detailed product teardown covering its goals, users, and key decisions.', deliverables: ['Written teardown (600–1000 words)', 'At least 3 "why this decision" hypotheses', 'One feature you would change and why'], acceptanceCriteria: ['Teardown identifies clear user segments', 'Analysis goes beyond surface-level observations', 'Improvement suggestion is specific and justified'], difficulty: 2 },
  { pathSlug: 'product-management', stageNumber: 2, title: 'Conduct 3 user interviews', description: 'Run 3 user interviews on a problem space of your choice and synthesise the findings into a research report.', deliverables: ['Interview guide used', 'Notes or recording summary for each interview', 'Synthesis document with themes and insights'], acceptanceCriteria: ['Interviews are at least 20 minutes each', 'Synthesis identifies at least 3 themes', 'Report includes direct user quotes'], difficulty: 3 },
  { pathSlug: 'product-management', stageNumber: 3, title: 'Build a product roadmap', description: 'Create a 6-month product roadmap for a real or fictional product with clear prioritisation rationale.', deliverables: ['Roadmap (in Figma, Notion, or similar)', 'Prioritisation framework used (RICE, ICE, etc.)', '1-page strategy document explaining the roadmap'], acceptanceCriteria: ['Roadmap covers at least 3 themes', 'Each item has a clear "why now"', 'Strategy doc connects roadmap to business goals'], difficulty: 3 },
  { pathSlug: 'product-management', stageNumber: 4, title: 'Write a full product spec', description: 'Write a detailed product requirements document (PRD) for one feature including user stories, acceptance criteria, and edge cases.', deliverables: ['PRD document', 'At least 5 user stories with acceptance criteria', 'Wireframe or mockup reference'], acceptanceCriteria: ['PRD is detailed enough for an engineer to build from', 'Edge cases and error states are covered', 'Success metrics are clearly defined'], difficulty: 4 },
  { pathSlug: 'product-management', stageNumber: 5, title: 'Document a product project as a case study', description: 'Write up one of your PM projects as a case study documenting problem, approach, decisions, and outcomes.', deliverables: ['Published case study (Notion, portfolio site, or Medium)', 'Covers: context, problem, approach, results', 'At least one quantified result or learning'], acceptanceCriteria: ['Case study is publicly accessible', 'Clearly shows PM thinking not just output', 'Honest about trade-offs and learnings'], difficulty: 4 },

  // content-strategy
  { pathSlug: 'content-strategy', stageNumber: 1, title: 'Rewrite three pieces of bad copy', description: 'Find 3 examples of unclear or weak copy in the wild (websites, apps, emails) and rewrite each one with an explanation.', deliverables: ['Original and rewritten versions side by side', 'Explanation of what was wrong and why your version is better', 'Published in a Google Doc or Notion page'], acceptanceCriteria: ['Each rewrite is meaningfully different (not just cosmetic)', 'Explanations reference specific writing principles', 'Voice and tone are appropriate for the context'], difficulty: 2 },
  { pathSlug: 'content-strategy', stageNumber: 2, title: 'Conduct a content audit', description: 'Audit the content of a real or fictional brand and identify gaps, underperforming content, and opportunities.', deliverables: ['Content inventory spreadsheet (at least 20 pieces)', 'Gap analysis with recommendations', 'Prioritised list of 5 content opportunities'], acceptanceCriteria: ['Audit includes content type, topic, channel, and quality rating', 'Gaps are tied to specific audience needs', 'Recommendations are actionable'], difficulty: 3 },
  { pathSlug: 'content-strategy', stageNumber: 3, title: 'Optimise 3 articles for SEO', description: 'Take 3 existing articles (real or sample) and optimise them for target keywords, on-page SEO, and readability.', deliverables: ['Before/after versions of all 3 articles', 'Keyword research showing target terms', 'Notes on each change and why'], acceptanceCriteria: ['Each article targets a specific keyword', 'Changes include title tag, meta description, headings, and body', 'Readability score improves (Hemingway App)'], difficulty: 3 },
  { pathSlug: 'content-strategy', stageNumber: 4, title: 'Launch a 4-week newsletter', description: 'Write and send 4 weekly newsletter issues on a topic of your choice and report on performance.', deliverables: ['Links to or exports of all 4 issues', 'Open rate and click rate for each issue', 'Summary of what you learned'], acceptanceCriteria: ['Each issue is at least 300 words', 'At least 10 subscribers (real or test)', 'Performance data is included'], difficulty: 4 },
  { pathSlug: 'content-strategy', stageNumber: 5, title: 'Publish a content strategy case study', description: 'Document a content project from strategy to results and publish it as a professional case study.', deliverables: ['Published case study URL', 'Covers: goal, audience, strategy, execution, results', 'At least one metric showing impact'], acceptanceCriteria: ['Case study is publicly accessible', 'Strategy decisions are clearly explained', 'Results section includes real or projected data'], difficulty: 5 },
];

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
    company: { name: 'LaunchPM', description: 'An early-stage startup building the next generation of project management tools.', website: 'https://launchpm.co', industry: 'Technology', size: '1–10' },
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
      update: {},
      create: path,
    });
  }

  console.log('Seeding roadmap stages...');
  for (const stage of ROADMAP_STAGES) {
    await prisma.roadmapStage.upsert({
      where: { pathSlug_stageNumber: { pathSlug: stage.pathSlug, stageNumber: stage.stageNumber } },
      update: {},
      create: stage,
    });
  }

  console.log('Seeding tasks...');
  for (const task of TASKS) {
    const existing = await prisma.task.findFirst({
      where: { pathSlug: task.pathSlug, stageNumber: task.stageNumber, title: task.title },
    });
    if (!existing) {
      await prisma.task.create({ data: { ...task, status: 'active' } });
    }
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

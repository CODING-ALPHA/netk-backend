export interface Question {
  id: string;
  text: string;
}

export interface QuestionSection {
  id: string;
  label: string;
  description: string;
  questions: Question[];
}

export const QUESTIONS: QuestionSection[] = [
  {
    id: 'love',
    label: 'What you love',
    description: 'Activities and topics that genuinely excite you',
    questions: [
      { id: 'love_1', text: 'I lose track of time when I am working on creative projects' },
      { id: 'love_2', text: 'I enjoy solving complex problems that require deep thinking' },
      { id: 'love_3', text: 'I feel energised when I am helping or teaching other people' },
      { id: 'love_4', text: 'I am drawn to building things, whether digital or physical' },
      { id: 'love_5', text: 'I enjoy analysing data and finding patterns in information' },
    ],
  },
  {
    id: 'strengths',
    label: 'What you are good at',
    description: 'Skills and abilities that come naturally to you',
    questions: [
      { id: 'strengths_1', text: 'People come to me for advice on technical or analytical problems' },
      { id: 'strengths_2', text: 'I am good at communicating ideas clearly to different audiences' },
      { id: 'strengths_3', text: 'I pick up new tools and software quickly without much help' },
      { id: 'strengths_4', text: 'I am good at organising projects and keeping things on track' },
      { id: 'strengths_5', text: 'I produce work that others consistently praise for its quality' },
    ],
  },
  {
    id: 'worldNeeds',
    label: 'What the world needs',
    description: 'Problems you care about solving for others',
    questions: [
      { id: 'worldNeeds_1', text: 'I want my work to improve how organisations operate efficiently' },
      { id: 'worldNeeds_2', text: 'I care about making technology more accessible to more people' },
      { id: 'worldNeeds_3', text: 'I want to help businesses grow and reach more customers' },
      { id: 'worldNeeds_4', text: 'I believe good design makes people\'s lives meaningfully better' },
      { id: 'worldNeeds_5', text: 'I want to work on problems that affect large numbers of people' },
    ],
  },
  {
    id: 'paidSkills',
    label: 'What you can be paid for',
    description: 'Skills that have commercial or professional value',
    questions: [
      { id: 'paidSkills_1', text: 'I have skills that businesses are actively looking to hire for' },
      { id: 'paidSkills_2', text: 'I have produced work or projects I could show to an employer' },
      { id: 'paidSkills_3', text: 'I understand the commercial value of what I am able to do' },
      { id: 'paidSkills_4', text: 'I could explain what makes me hireable in under two minutes' },
      { id: 'paidSkills_5', text: 'My skills are relevant to growing industries or markets' },
    ],
  },
];

export const ANSWER_OPTIONS = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];

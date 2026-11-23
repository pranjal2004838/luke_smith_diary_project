export type MindsetType = 'Calm' | 'Focused' | 'Energized' | 'Reflective' | 'Stretched';

export interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  completed: boolean;
  isOverdue?: boolean;
  isCarriedForward?: boolean;
  notes?: string;
  milestone?: string;
}

export interface Appointment {
  id: string;
  title: string;
  time: string;
  date: string; // YYYY-MM-DD
  location: string;
  type: 'keynote' | 'meeting' | 'recording' | 'personal';
  clientOrHost?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  content: string;
  type: 'note' | 'voice' | 'idea';
  mindset?: MindsetType;
  tags: string[];
  audioUrl?: string;
  audioDuration?: string;
  transcript?: string;
  attachments?: { type: 'image' | 'link'; url: string; label: string }[];
}

export interface MindsetCheckIn {
  id: string;
  date: string;
  time: string;
  mindset: MindsetType;
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  currentMilestone: string;
  deadline: string;
}

export const formatDateStr = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLocalDateStr = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDateStr(d);
};

// Get Monday..Sunday dates for the current week
export const getCurrentWeekDates = (): Date[] => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const weekDates = getCurrentWeekDates();
const monStr = formatDateStr(weekDates[0]);
const tueStr = formatDateStr(weekDates[1]);
const wedStr = formatDateStr(weekDates[2]);
const thuStr = formatDateStr(weekDates[3]);
const friStr = formatDateStr(weekDates[4]);
const satStr = formatDateStr(weekDates[5]);

export const TODAY_STR = getLocalDateStr(0);
export const YESTERDAY_STR = getLocalDateStr(-1);
export const TOMORROW_STR = getLocalDateStr(1);
export const FRIDAY_STR = friStr;

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Book 13: "The Courage to Ask"',
    color: '#d4f854', // Lime
    progress: 72,
    totalTasks: 18,
    completedTasks: 13,
    currentMilestone: 'Final galleys revision with Penguin UK',
    deadline: getLocalDateStr(10),
  },
  {
    id: 'proj-2',
    name: 'Film & Media Production',
    color: '#67e8f9', // Cyan/Teal
    progress: 55,
    totalTasks: 12,
    completedTasks: 7,
    currentMilestone: 'Send film notes & studio schedule',
    deadline: getLocalDateStr(14),
  },
  {
    id: 'proj-3',
    name: 'Real Direction Academy',
    color: '#86efac', // Mint
    progress: 40,
    totalTasks: 10,
    completedTasks: 4,
    currentMilestone: 'Mentorship cohort curriculum launch',
    deadline: getLocalDateStr(20),
  },
  {
    id: 'proj-4',
    name: 'Personal & Mindset',
    color: '#d8b4fe', // Lilac
    progress: 80,
    totalTasks: 5,
    completedTasks: 4,
    currentMilestone: 'Daily mindfulness & reflection streak',
    deadline: getLocalDateStr(7),
  },
];

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Review the project plan',
    project: 'Real Direction Academy',
    priority: 'high',
    dueDate: monStr,
    dueTime: '10:00 am',
    completed: false,
    notes: 'Confirm next milestone dates and key deliverables.',
    milestone: 'Mentorship cohort curriculum launch',
  },
  {
    id: 't-2',
    title: 'Send the film notes',
    project: 'Film & Media Production',
    priority: 'high',
    dueDate: tueStr,
    dueTime: '2:00 pm',
    completed: false,
    notes: 'Include lighting cues and intro talking points.',
    milestone: 'Send film notes & studio schedule',
  },
  {
    id: 't-3',
    title: 'Prep keynote slides',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'medium',
    dueDate: wedStr,
    dueTime: '11:00 am',
    completed: false,
    notes: 'Refine opening story and audience prompt.',
  },
  {
    id: 't-4',
    title: 'Studio sound check',
    project: 'Film & Media Production',
    priority: 'medium',
    dueDate: thuStr,
    dueTime: '3:00 pm',
    completed: false,
  },
  {
    id: 't-5',
    title: "Check tomorrow's diary",
    project: 'Personal & Mindset',
    priority: 'medium',
    dueDate: friStr,
    dueTime: '11:00 am',
    completed: false,
    notes: 'Review priorities and set top 3 goals for the weekend.',
  },
  {
    id: 't-6',
    title: 'Weekly reflection & reset',
    project: 'Personal & Mindset',
    priority: 'low',
    dueDate: satStr,
    dueTime: '10:00 am',
    completed: true,
  },
  {
    id: 't-7',
    title: 'Review Chapter 4 galleys with editor',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'urgent',
    dueDate: YESTERDAY_STR,
    dueTime: '9:00 am',
    completed: false,
    isOverdue: true,
    isCarriedForward: true,
    notes: 'Carried forward from yesterday. Penguin UK expects returned PDF.',
    milestone: 'Final galleys revision with Penguin UK',
  },
  {
    id: 't-8',
    title: 'Sign off on Question-Cards proof',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'medium',
    dueDate: TODAY_STR,
    dueTime: '9:00 am',
    completed: true,
    notes: 'Approved high-res print proof with printer.',
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'app-1',
    title: 'Briefing Call: Global Leadership Forum',
    time: '11:30 am - 12:15 pm',
    date: TODAY_STR,
    location: 'Zoom (Virtual)',
    type: 'keynote',
    clientOrHost: 'Sarah Jenkins (Event Director)',
  },
  {
    id: 'app-2',
    title: 'Production Sync: Studio Session',
    time: '3:00 pm - 4:00 pm',
    date: TODAY_STR,
    location: 'Studio 3, Soho London',
    type: 'recording',
    clientOrHost: 'Marcus & AV Crew',
  },
  {
    id: 'app-3',
    title: 'Penguin Books Editorial Check-in',
    time: '2:30 pm - 3:15 pm',
    date: getLocalDateStr(2),
    location: 'Google Meet',
    type: 'meeting',
    clientOrHost: 'Editorial Board',
  },
];

export const initialDiaryEntries: DiaryEntry[] = [
  {
    id: 'd-1',
    date: TODAY_STR,
    time: '08:45 am',
    title: 'Morning Voice Memo — Production & Editor Sync',
    type: 'voice',
    mindset: 'Calm',
    content:
      'Follow up with the editor on Friday and prepare three questions for the production meeting. Make sure we also address the sound check schedule for the studio session.',
    tags: ['Publishing', 'Studio', 'QuickCapture'],
    audioUrl: 'simulated_audio_waveform.mp3',
    audioDuration: '0:48',
    transcript:
      'Follow up with the editor on Friday and prepare three questions for the production meeting. Make sure we also address the sound check schedule for the studio session.',
    attachments: [
      {
        type: 'link',
        url: 'https://realdirection.co.uk',
        label: 'Production Brief Doc',
      },
    ],
  },
  {
    id: 'd-2',
    date: YESTERDAY_STR,
    time: '10:20 pm',
    title: 'Evening Reflection: The Art of Unspoken Questions',
    type: 'note',
    mindset: 'Reflective',
    content:
      'In leadership, the most dangerous assumption is believing silence equals agreement. When speaking with executives today, 80% of what blocked their team was fear of asking what seemed obvious. Expand this into Chapter 5.',
    tags: ['Philosophy', 'BookNotes', 'Keynotes'],
  },
  {
    id: 'd-3',
    date: getLocalDateStr(-2),
    time: '02:15 pm',
    title: 'Card Deck Concept: "Difficult Conversations"',
    type: 'idea',
    mindset: 'Energized',
    content:
      'Drafting 10 sample prompt cards for high-stakes executive dialogue. Core theme: Disagreeing without contempt.',
    tags: ['QuestionCards', 'ProductIdea'],
  },
];

export const initialMindsetHistory: MindsetCheckIn[] = [
  { id: 'm-1', date: getLocalDateStr(-4), time: '09:00 am', mindset: 'Focused', note: 'Deep writing session' },
  { id: 'm-2', date: getLocalDateStr(-3), time: '08:30 am', mindset: 'Energized', note: 'Great keynote feedback' },
  { id: 'm-3', date: getLocalDateStr(-2), time: '02:15 pm', mindset: 'Stretched', note: 'Busy filming schedule' },
  { id: 'm-4', date: YESTERDAY_STR, time: '10:20 pm', mindset: 'Reflective', note: 'Evening journaling helped unwind' },
  { id: 'm-5', date: TODAY_STR, time: '08:45 am', mindset: 'Calm', note: 'Clear priorities for today' },
];

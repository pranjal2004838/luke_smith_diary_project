export type MindsetType = 'Calm' | 'Good' | 'Okay' | 'Low' | 'Overwhelmed' | 'Focused' | 'Energized' | 'Reflective' | 'Stretched';

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
  colorTone?: 'lime' | 'teal' | 'mint' | 'lilac';
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
    color: '#c8ef43', // Lime
    progress: 75,
    totalTasks: 16,
    completedTasks: 12,
    currentMilestone: 'Final galleys revision with Penguin UK',
    deadline: getLocalDateStr(10),
  },
  {
    id: 'proj-2',
    name: 'Film & Media Production',
    color: '#63d8d8', // Teal
    progress: 65,
    totalTasks: 12,
    completedTasks: 8,
    currentMilestone: 'Send film notes & studio schedule',
    deadline: getLocalDateStr(14),
  },
  {
    id: 'proj-3',
    name: 'Real Direction Academy',
    color: '#9ee4c3', // Mint
    progress: 50,
    totalTasks: 10,
    completedTasks: 5,
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

// Tasks positioned to match Luke's reference weekly calendar grid
export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Review project plan',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'high',
    dueDate: monStr,
    dueTime: '10:00 am',
    completed: false,
    colorTone: 'lime',
    notes: 'Confirm next milestone dates and key deliverables.',
    milestone: 'Final galleys revision with Penguin UK',
  },
  {
    id: 't-2',
    title: 'Send film notes',
    project: 'Film & Media Production',
    priority: 'high',
    dueDate: tueStr,
    dueTime: '1:00 pm',
    completed: false,
    colorTone: 'teal',
    notes: 'Include lighting cues and intro talking points.',
    milestone: 'Send film notes & studio schedule',
  },
  {
    id: 't-3',
    title: 'Team meeting',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'urgent',
    dueDate: thuStr,
    dueTime: '11:00 am',
    completed: false,
    colorTone: 'lime',
    notes: 'Production & editorial team alignment call.',
  },
  {
    id: 't-4',
    title: 'Check diary',
    project: 'Real Direction Academy',
    priority: 'medium',
    dueDate: friStr,
    dueTime: '2:00 pm',
    completed: false,
    colorTone: 'mint',
    notes: 'Review priorities and schedule for next week.',
  },
  {
    id: 't-5',
    title: 'Keynote prep',
    project: 'Film & Media Production',
    priority: 'high',
    dueDate: satStr,
    dueTime: '9:30 am',
    completed: false,
    colorTone: 'teal',
    notes: 'Run through slides and opening hook.',
  },
  {
    id: 't-6',
    title: 'Review Chapter 4 galleys with editor',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'urgent',
    dueDate: YESTERDAY_STR,
    dueTime: '4:00 pm',
    completed: false,
    isOverdue: true,
    isCarriedForward: true,
    colorTone: 'lime',
    notes: 'Carried forward from yesterday. Penguin UK expects returned PDF.',
  },
  // Completed tasks so progress reads naturally (e.g. 12 of 18 or high completion bar)
  {
    id: 't-7',
    title: 'Sign off on Question-Cards proof',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'medium',
    dueDate: wedStr,
    dueTime: '9:00 am',
    completed: true,
    colorTone: 'mint',
  },
  {
    id: 't-8',
    title: 'Morning reflection & priority check',
    project: 'Personal & Mindset',
    priority: 'low',
    dueDate: wedStr,
    dueTime: '8:30 am',
    completed: true,
    colorTone: 'mint',
  },
  {
    id: 't-9',
    title: 'Approve studio lighting setup',
    project: 'Film & Media Production',
    priority: 'medium',
    dueDate: wedStr,
    dueTime: '3:00 pm',
    completed: true,
    colorTone: 'teal',
  },
  {
    id: 't-10',
    title: 'Update keynote bio for organiser',
    project: 'Real Direction Academy',
    priority: 'low',
    dueDate: wedStr,
    dueTime: '4:00 pm',
    completed: true,
    colorTone: 'mint',
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
    mindset: 'Good',
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
    mindset: 'Calm',
    content:
      'Drafting 10 sample prompt cards for high-stakes executive dialogue. Core theme: Disagreeing without contempt.',
    tags: ['QuestionCards', 'ProductIdea'],
  },
];

export const initialMindsetHistory: MindsetCheckIn[] = [
  { id: 'm-1', date: getLocalDateStr(-4), time: '09:00 am', mindset: 'Good', note: 'Deep writing session' },
  { id: 'm-2', date: getLocalDateStr(-3), time: '08:30 am', mindset: 'Calm', note: 'Great keynote feedback' },
  { id: 'm-3', date: getLocalDateStr(-2), time: '02:15 pm', mindset: 'Okay', note: 'Busy filming schedule' },
  { id: 'm-4', date: YESTERDAY_STR, time: '10:20 pm', mindset: 'Good', note: 'Evening journaling helped unwind' },
  { id: 'm-5', date: TODAY_STR, time: '08:45 am', mindset: 'Calm', note: 'Clear priorities for today' },
];

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
  tags: string[];
  audioUrl?: string;
  audioDuration?: string;
  transcript?: string;
  attachments?: { type: 'image' | 'link'; url: string; label: string }[];
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

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Book 13: "The Courage to Ask"',
    color: '#f0a500', // Gold
    progress: 72,
    totalTasks: 18,
    completedTasks: 13,
    currentMilestone: 'Final galleys revision with Penguin UK',
    deadline: '2026-11-28',
  },
  {
    id: 'proj-2',
    name: 'TEDx & Keynote Spring Tour',
    color: '#3b82f6', // Blue
    progress: 55,
    totalTasks: 12,
    completedTasks: 7,
    currentMilestone: 'AV slide sync & contracts signoff',
    deadline: '2026-12-05',
  },
  {
    id: 'proj-3',
    name: 'Real Direction Academy',
    color: '#10b981', // Emerald
    progress: 40,
    totalTasks: 10,
    completedTasks: 4,
    currentMilestone: 'Mentorship cohort curriculum launch',
    deadline: '2026-12-15',
  },
  {
    id: 'proj-4',
    name: 'Personal & Health',
    color: '#8b5cf6', // Purple
    progress: 80,
    totalTasks: 5,
    completedTasks: 4,
    currentMilestone: 'Quarterly retreat booking',
    deadline: '2026-11-30',
  },
];

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Review Chapter 4 galleys and margin queries from editor',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'urgent',
    dueDate: '2026-11-06',
    completed: false,
    isOverdue: true,
    isCarriedForward: true,
    notes: 'Carried forward from yesterday. Penguin UK expects returned PDF by 5 PM.',
    milestone: 'Final galleys revision with Penguin UK',
  },
  {
    id: 't-2',
    title: 'Finalize stage AV deck for Leadership Summit Keynote',
    project: 'TEDx & Keynote Spring Tour',
    priority: 'high',
    dueDate: '2026-11-07',
    dueTime: '14:00',
    completed: false,
    notes: 'Check 16:9 widescreen ratio and video embed cues.',
    milestone: 'AV slide sync & contracts signoff',
  },
  {
    id: 't-3',
    title: 'Review 3 production meeting questions with Marcus',
    project: 'Real Direction Academy',
    priority: 'high',
    dueDate: '2026-11-07',
    dueTime: '16:30',
    completed: false,
    notes: 'Generated from voice capture note.',
  },
  {
    id: 't-4',
    title: 'Sign off on Question-Cards custom gold foil packaging proof',
    project: 'Book 13: "The Courage to Ask"',
    priority: 'medium',
    dueDate: '2026-11-07',
    completed: true,
    notes: 'Approved high-res print proof with printer.',
  },
  {
    id: 't-5',
    title: 'Approve newsletter draft: "The Sunday Spark #142"',
    project: 'Real Direction Academy',
    priority: 'medium',
    dueDate: '2026-11-07',
    completed: true,
  },
  {
    id: 't-6',
    title: 'Confirm travel dates for Birmingham keynote & hotel booking',
    project: 'TEDx & Keynote Spring Tour',
    priority: 'low',
    dueDate: '2026-11-08',
    completed: false,
  },
  {
    id: 't-7',
    title: 'Morning 45-min interval run & journal reflection',
    project: 'Personal & Health',
    priority: 'medium',
    dueDate: '2026-11-07',
    completed: true,
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'app-1',
    title: 'Briefing Call: Global Banking Leadership Forum',
    time: '11:00 - 11:45 AM',
    date: '2026-11-07',
    location: 'Zoom (Virtual)',
    type: 'keynote',
    clientOrHost: 'Sarah Jenkins (Event Director)',
  },
  {
    id: 'app-2',
    title: 'Production Sync: Real Direction Episode 14',
    time: '04:00 - 05:00 PM',
    date: '2026-11-07',
    location: 'Studio 3, Soho London',
    type: 'recording',
    clientOrHost: 'Marcus & AV Crew',
  },
  {
    id: 'app-3',
    title: 'Penguin Books Publishing Strategy Check-in',
    time: '02:30 - 03:15 PM',
    date: '2026-11-09',
    location: 'Google Meet',
    type: 'meeting',
    clientOrHost: 'Editorial Board',
  },
];

export const initialDiaryEntries: DiaryEntry[] = [
  {
    id: 'd-1',
    date: '2026-11-07',
    time: '08:45 AM',
    title: 'Morning Voice Memo — Production & Editor Sync',
    type: 'voice',
    content: 'Follow up with the editor on Friday and prepare three questions for the production meeting. Make sure we also address the sound check schedule for the studio session.',
    tags: ['Publishing', 'Studio', 'QuickCapture'],
    audioUrl: 'simulated_audio_waveform.mp3',
    audioDuration: '0:48',
    transcript: 'Follow up with the editor on Friday and prepare three questions for the production meeting. Make sure we also address the sound check schedule for the studio session.',
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
    date: '2026-11-06',
    time: '10:20 PM',
    title: 'Evening Reflection: The Art of Unspoken Questions',
    type: 'note',
    content: 'In leadership, the most dangerous assumption is believing silence equals agreement. When speaking with executives today, 80% of what blocked their team wasn\'t strategy—it was fear of asking what seemed "obvious". Need to expand this into a chapter prologue for Book 13.',
    tags: ['Philosophy', 'BookNotes', 'Keynotes'],
  },
  {
    id: 'd-3',
    date: '2026-11-05',
    time: '02:15 PM',
    title: 'Card Deck Concept: "Difficult Conversations for Teams"',
    type: 'idea',
    content: 'Drafting 10 sample prompt cards for high-stakes executive dialogue. Core theme: Disagreeing without contempt. Card 1: What would you say if you knew you could not be fired for saying it?',
    tags: ['QuestionCards', 'ProductIdea'],
  },
];

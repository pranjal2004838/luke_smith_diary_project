import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Task, Appointment, DiaryEntry, Project, initialTasks, initialAppointments, initialDiaryEntries, initialProjects } from '../components/planner/mockData';
import { DashboardSettings } from '../components/planner/DesignCustomizer';

const STORAGE_KEYS = {
  TASKS: 'luke_planner_tasks',
  APPOINTMENTS: 'luke_planner_appointments',
  DIARY: 'luke_planner_diary',
  PROJECTS: 'luke_planner_projects',
  SETTINGS: 'luke_planner_settings',
  AUTH: 'luke_planner_auth_user',
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const plannerService = {
  // Authentication
  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async login(email: string): Promise<AuthUser> {
    const user: AuthUser = {
      id: 'usr-luke-smith-01',
      email,
      name: 'Luke Smith',
      role: 'Author & Keynote Speaker',
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signInWithOtp({ email });
      } catch (err) {
        console.warn('Supabase auth notice:', err);
      }
    }

    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(console.warn);
    }
  },

  // Tasks
  getTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
      return initialTasks;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialTasks;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Diary Entries
  getDiaryEntries(): DiaryEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DIARY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(initialDiaryEntries));
      return initialDiaryEntries;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialDiaryEntries;
    }
  },

  saveDiaryEntries(entries: DiaryEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries));
  },

  // Projects
  getProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
      return initialProjects;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialProjects;
    }
  },

  // Appointments
  getAppointments(): Appointment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialAppointments));
      return initialAppointments;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialAppointments;
    }
  },

  // Settings
  getSettings(): DashboardSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaultSettings: DashboardSettings = {
      mockupMode: 'background',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80',
      backgroundBlur: 'md',
      cardOpacity: 85,
      accentColor: '#f0a500',
    };
    if (!raw) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings: DashboardSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Export full backup
  exportAllData() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getStoredUser(),
      tasks: this.getTasks(),
      diaryEntries: this.getDiaryEntries(),
      projects: this.getProjects(),
      appointments: this.getAppointments(),
      settings: this.getSettings(),
    };
  },
};

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Task,
  Appointment,
  DiaryEntry,
  Project,
  MindsetCheckIn,
  initialTasks,
  initialAppointments,
  initialDiaryEntries,
  initialProjects,
  initialMindsetHistory,
} from '../components/planner/mockData';
import { DashboardSettings } from '../components/planner/DesignCustomizer';

const STORAGE_KEYS = {
  TASKS: 'luke_planner_tasks_v5',
  APPOINTMENTS: 'luke_planner_appointments_v5',
  DIARY: 'luke_planner_diary_v5',
  PROJECTS: 'luke_planner_projects_v5',
  MINDSET: 'luke_planner_mindset_v5',
  SETTINGS: 'luke_planner_settings_v5',
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
    try {
      localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries));
    } catch (err) {
      console.warn('LocalStorage quota notice while saving diary:', err);
    }
  },

  // Mindset Check-Ins
  getMindsetHistory(): MindsetCheckIn[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MINDSET);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MINDSET, JSON.stringify(initialMindsetHistory));
      return initialMindsetHistory;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialMindsetHistory;
    }
  },

  saveMindsetHistory(history: MindsetCheckIn[]): void {
    localStorage.setItem(STORAGE_KEYS.MINDSET, JSON.stringify(history));
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

  // Settings (Electric-blue glass over Luke portrait + Ice Blue text default)
  getSettings(): DashboardSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaultSettings: DashboardSettings = {
      mockupMode: 'background',
      backgroundImageUrl: '/luke-cato-clear.jpg',
      backgroundBlur: 'none',
      photoVisibility: 90,
      textColor: 'white',
    };
    if (!raw) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings: DashboardSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.warn('LocalStorage quota notice while saving settings:', err);
    }
  },

  // Export full backup
  exportAllData() {
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user: this.getStoredUser(),
      tasks: this.getTasks(),
      diaryEntries: this.getDiaryEntries(),
      mindsetHistory: this.getMindsetHistory(),
      projects: this.getProjects(),
      appointments: this.getAppointments(),
      settings: this.getSettings(),
    };
  },
};

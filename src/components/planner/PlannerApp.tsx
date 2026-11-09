import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Palette, 
  Lock, 
  ShieldCheck,
  User,
  Download,
  Smartphone
} from 'lucide-react';
import { 
  Task, 
  Appointment, 
  DiaryEntry, 
  Project 
} from './mockData';
import TodayDashboard from './TodayDashboard';
import DiaryQuickCapture from './DiaryQuickCapture';
import TasksProjects from './TasksProjects';
import CalendarView from './CalendarView';
import AiTaskExtractor from './AiTaskExtractor';
import DesignCustomizer, { DashboardSettings } from './DesignCustomizer';
import AuthModal from './AuthModal';
import ExportModal from './ExportModal';
import { plannerService, AuthUser } from '../../services/plannerService';

export default function PlannerApp() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'today' | 'diary' | 'tasks' | 'calendar'>('today');

  // Application Data State loaded from plannerService (localStorage / Supabase)
  const [tasks, setTasks] = useState<Task[]>(() => plannerService.getTasks());
  const [appointments] = useState<Appointment[]>(() => plannerService.getAppointments());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => plannerService.getDiaryEntries());
  const [projects] = useState<Project[]>(() => plannerService.getProjects());
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => plannerService.getStoredUser());

  // Modals and Drawers
  const [isAiExtractorOpen, setIsAiExtractorOpen] = useState(false);
  const [aiExtractorPrompt, setAiExtractorPrompt] = useState<string | undefined>(undefined);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);

  // Design Settings (Mockup 1 vs Mockup 2)
  const [settings, setSettings] = useState<DashboardSettings>(() => plannerService.getSettings());

  const isGlassTheme = settings.mockupMode === 'background';

  // Persist tasks and entries when updated
  useEffect(() => {
    plannerService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    plannerService.saveDiaryEntries(diaryEntries);
  }, [diaryEntries]);

  useEffect(() => {
    plannerService.saveSettings(settings);
  }, [settings]);

  // Handlers
  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleAddMultipleTasks = (newTasks: Omit<Task, 'id'>[]) => {
    const formatted: Task[] = newTasks.map((t, i) => ({
      ...t,
      id: `task-ai-${Date.now()}-${i}`,
    }));
    setTasks(prev => [...formatted, ...prev]);
  };

  const handleAddDiaryEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
  };

  const handleExtractTasksFromNote = (text: string) => {
    setAiExtractorPrompt(text);
    setIsAiExtractorOpen(true);
  };

  const handleUpdateSettings = (newSettings: Partial<DashboardSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleLogin = async (email: string) => {
    const user = await plannerService.login(email);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    plannerService.logout();
    setCurrentUser(null);
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-gold selection:text-navy">
      {/* Dynamic Background Image Layer (Mockup 2) */}
      {isGlassTheme ? (
        <div className="fixed inset-0 z-0">
          <img
            src={settings.backgroundImageUrl}
            alt="Dashboard Background"
            className="w-full h-full object-cover fixed inset-0"
          />
          {/* Frosted / Tinted Dark Overlay */}
          <div
            className="fixed inset-0 bg-navy-dark transition-opacity duration-300"
            style={{
              opacity: (settings.cardOpacity / 100) * 0.85,
              backdropFilter:
                settings.backgroundBlur === 'none'
                  ? 'none'
                  : settings.backgroundBlur === 'sm'
                  ? 'blur(4px)'
                  : settings.backgroundBlur === 'md'
                  ? 'blur(10px)'
                  : 'blur(20px)',
            }}
          />
        </div>
      ) : (
        /* Mockup 1: Clean Minimalist Background */
        <div className="fixed inset-0 z-0 bg-[#0c101c]" />
      )}

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen text-gray-100">
        {/* Top Bar / Client Reassurance & Mockup Switcher Header */}
        <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm tracking-wide text-white">
                Luke Smith
              </span>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-medium hidden sm:inline-flex items-center gap-1 hover:bg-gold/25 transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>{currentUser ? 'Authenticated: Luke Smith' : 'Private Access'}</span>
              </button>
            </div>
          </div>

          {/* Controls: Mockup Switcher, Theme, Backup, Auth */}
          <div className="flex items-center gap-2">
            {/* Quick Mockup Switcher Pills */}
            <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/15 text-xs">
              <button
                onClick={() => handleUpdateSettings({ mockupMode: 'clean' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  settings.mockupMode === 'clean'
                    ? 'bg-gold text-navy font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mockup 1: Clean
              </button>
              <button
                onClick={() => handleUpdateSettings({ mockupMode: 'background' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  settings.mockupMode === 'background'
                    ? 'bg-gold text-navy font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mockup 2: Visual
              </button>
            </div>

            {/* Theme customizer */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gold border border-white/15 transition-all"
              title="Change Background Wallpaper & Styles"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Export & Backup */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-400 border border-white/15 transition-all"
              title="Backup & Export Data (JSON/CSV)"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* User Profile / Auth */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 border border-white/15 transition-all"
              title="Security & Account Access"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* PWA Mobile Installation Notice Bar */}
        {showPwaPrompt && (
          <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border-b border-indigo-500/30 px-4 py-2 text-xs flex items-center justify-between text-indigo-100">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-300" />
              <span>
                <strong>Mobile App Installation:</strong> On iPhone Safari, tap <strong>Share → Add to Home Screen</strong>. On Android Chrome, tap <strong>Menu → Install App</strong>.
              </span>
            </div>
            <button
              onClick={() => setShowPwaPrompt(false)}
              className="text-xs text-indigo-300 hover:text-white underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Sub-Header Navigation Tabs */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 md:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
            <nav className="flex items-center gap-1.5 md:gap-3 text-xs md:text-sm font-semibold whitespace-nowrap">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'today'
                    ? 'bg-gold text-navy font-bold shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Today Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('diary')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'diary'
                    ? 'bg-gold text-navy font-bold shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Diary & Quick Capture</span>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-gold text-navy font-bold shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tasks & Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-gold text-navy font-bold shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar & Reminders</span>
              </button>
            </nav>

            {/* AI Action Trigger in Navigation */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowPwaPrompt(true)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Phone App Setup"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Phone App</span>
              </button>

              <button
                onClick={() => {
                  setAiExtractorPrompt('Follow up with the editor on Friday and prepare three questions for the production meeting.');
                  setIsAiExtractorOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Task Parser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
          {activeTab === 'today' && (
            <TodayDashboard
              tasks={tasks}
              appointments={appointments}
              onToggleTask={handleToggleTask}
              onOpenQuickCapture={() => setActiveTab('diary')}
              onOpenAiExtractor={() => {
                setAiExtractorPrompt('Follow up with the editor on Friday and prepare three questions for the production meeting.');
                setIsAiExtractorOpen(true);
              }}
              isGlassTheme={isGlassTheme}
            />
          )}

          {activeTab === 'diary' && (
            <DiaryQuickCapture
              entries={diaryEntries}
              onAddEntry={handleAddDiaryEntry}
              onExtractTasksFromNote={handleExtractTasksFromNote}
              isGlassTheme={isGlassTheme}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksProjects
              tasks={tasks}
              projects={projects}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              isGlassTheme={isGlassTheme}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              appointments={appointments}
              tasks={tasks}
              isGlassTheme={isGlassTheme}
            />
          )}
        </main>

        {/* Footer / Architecture & Privacy Guarantee */}
        <footer className="mt-auto border-t border-white/10 bg-black/50 backdrop-blur-md px-6 py-4 text-xs text-gray-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>
                <strong>100% Private Vault:</strong> Row-Level Security (RLS) active. Personal diary entries are strictly user-scoped.
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <span>PWA Ready (iOS & Android)</span>
              <span>•</span>
              <span>Claude & GPT-4o mini Pipeline</span>
              <span>•</span>
              <button
                onClick={() => setIsExportOpen(true)}
                className="text-gold hover:underline flex items-center gap-1"
              >
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* AI Task Extractor Modal */}
      {isAiExtractorOpen && (
        <AiTaskExtractor
          initialPrompt={aiExtractorPrompt}
          projects={projects}
          onAddTasks={handleAddMultipleTasks}
          onClose={() => setIsAiExtractorOpen(false)}
          isGlassTheme={isGlassTheme}
        />
      )}

      {/* Theme & Mockup Customizer Drawer */}
      {isCustomizerOpen && (
        <DesignCustomizer
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}

      {/* Private Access / Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onClose={() => setIsAuthOpen(false)}
          isGlassTheme={isGlassTheme}
        />
      )}

      {/* Backup & Export Modal */}
      {isExportOpen && (
        <ExportModal
          onClose={() => setIsExportOpen(false)}
          isGlassTheme={isGlassTheme}
        />
      )}
    </div>
  );
}

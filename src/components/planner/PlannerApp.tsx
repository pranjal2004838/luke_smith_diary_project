import { useState, useEffect } from 'react';
import { 
  Settings,
  Smartphone
} from 'lucide-react';
import { 
  Task, 
  Appointment, 
  DiaryEntry, 
  Project,
  MindsetCheckIn,
  MindsetType,
  TODAY_STR
} from './mockData';
import TodayDashboard from './TodayDashboard';
import DiaryQuickCapture from './DiaryQuickCapture';
import CalendarView from './CalendarView';
import AiTaskExtractor from './AiTaskExtractor';
import DesignCustomizer, { DashboardSettings, TEXT_COLOR_THEMES } from './DesignCustomizer';
import AuthModal from './AuthModal';
import ExportModal from './ExportModal';
import PerformanceChartsModal from './PerformanceChartsModal';
import QuickAddTaskModal from './QuickAddTaskModal';
import QuickThoughtModal from './QuickThoughtModal';
import { plannerService, AuthUser } from '../../services/plannerService';

export default function PlannerApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'diary'>('home');

  // Persistent Application State
  const [tasks, setTasks] = useState<Task[]>(() => plannerService.getTasks());
  const [appointments] = useState<Appointment[]>(() => plannerService.getAppointments());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => plannerService.getDiaryEntries());
  const [projects] = useState<Project[]>(() => plannerService.getProjects());
  const [mindsetHistory, setMindsetHistory] = useState<MindsetCheckIn[]>(() => plannerService.getMindsetHistory());
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => plannerService.getStoredUser());
  const [settings, setSettings] = useState<DashboardSettings>(() => plannerService.getSettings());

  // Modals & Drawers
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isRecordThoughtOpen, setIsRecordThoughtOpen] = useState(false);
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isAiExtractorOpen, setIsAiExtractorOpen] = useState(false);
  const [aiExtractorPrompt, setAiExtractorPrompt] = useState<string | undefined>(undefined);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);

  const isGlassTheme = settings.mockupMode === 'background';
  const colorTheme = TEXT_COLOR_THEMES[settings.textColor] || TEXT_COLOR_THEMES['ice-blue'];

  useEffect(() => {
    plannerService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    plannerService.saveDiaryEntries(diaryEntries);
  }, [diaryEntries]);

  useEffect(() => {
    plannerService.saveMindsetHistory(mindsetHistory);
  }, [mindsetHistory]);

  useEffect(() => {
    plannerService.saveSettings(settings);
  }, [settings]);

  // Handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleMoveOverdueToToday = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, dueDate: TODAY_STR, isOverdue: false, isCarriedForward: true }
          : t
      )
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleAddMultipleTasks = (newTasks: Omit<Task, 'id'>[]) => {
    const formatted: Task[] = newTasks.map((t, i) => ({
      ...t,
      id: `task-ai-${Date.now()}-${i}`,
    }));
    setTasks((prev) => [...formatted, ...prev]);
  };

  const handleAddDiaryEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);
  };

  const handleLogMindset = (mindset: MindsetType, note?: string) => {
    const checkIn: MindsetCheckIn = {
      id: `m-${Date.now()}`,
      date: TODAY_STR,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase(),
      mindset,
      note,
    };
    setMindsetHistory((prev) => [...prev, checkIn]);
  };

  const handleExtractTasksFromNote = (text: string) => {
    setAiExtractorPrompt(text);
    setIsAiExtractorOpen(true);
  };

  const handleUpdateSettings = (newSettings: Partial<DashboardSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
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
    <div
      className="min-h-screen font-sans bg-[#0d1017] selection:bg-[#c8ef43] selection:text-[#0b0f14]"
      style={{ color: colorTheme.primaryHex }}
    >
      {/* Top Navigation Bar (Matching Luke's Reference Screenshot) */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5 flex items-center justify-between gap-2">
          {/* Left: Brand + Pill Track (Home | Calendar | Diary) */}
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <span className="font-sans font-extrabold text-base sm:text-2xl tracking-tight text-white whitespace-nowrap">
              My planner
            </span>

            <nav
              aria-label="Primary navigation"
              className="flex items-center bg-[#141821] border border-white/10 rounded-full p-1"
            >
              {[
                { id: 'home', label: 'Home' },
                { id: 'calendar', label: 'Calendar' },
                { id: 'diary', label: 'Diary' },
              ].map((item, idx) => {
                const active = activeTab === item.id;
                return (
                  <div key={item.id} className="flex items-center">
                    {idx > 0 && !active && activeTab !== ['home', 'calendar', 'diary'][idx - 1] && (
                      <span className="h-3.5 w-px bg-white/10 mx-0.5" />
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                        active
                          ? 'bg-[#c8ef43] text-[#0b0f14] font-bold shadow-[0_0_12px_rgba(200,239,67,0.3)]'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right: Set Reminder button + Settings */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddTaskOpen(true)}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#141821] hover:bg-[#1c222e] border border-white/15 text-xs font-medium text-gray-200 transition-colors"
            >
              Set Reminder
            </button>

            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="p-2 rounded-xl bg-[#141821] hover:bg-[#1c222e] border border-white/15 text-gray-300 hover:text-white transition-colors"
              aria-label="Settings and appearance"
              title="Photo, text colour, private access & backup"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile App Install Help Banner */}
      {showPwaPrompt && (
        <div className="bg-[#131922] border-b border-[#d4f854]/30 px-4 py-2.5 text-xs flex items-center justify-between text-gray-200">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#d4f854] shrink-0" />
            <span>
              <strong>Install on iPhone:</strong> In Safari tap <strong>Share → Add to Home Screen</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPwaPrompt(false)}
            className="text-xs text-[#d4f854] hover:underline ml-4 shrink-0"
          >
            Close
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 py-5 sm:py-6">
        {activeTab === 'home' && (
          <TodayDashboard
            tasks={tasks}
            appointments={appointments}
            mindsetHistory={mindsetHistory}
            backgroundImageUrl={settings.backgroundImageUrl}
            photoVisibility={settings.photoVisibility}
            textColor={settings.textColor}
            onToggleTask={handleToggleTask}
            onLogMindset={handleLogMindset}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
            onOpenRecordThought={() => setIsRecordThoughtOpen(true)}
            onOpenViewCharts={() => setIsChartsOpen(true)}
            onOpenUpdatePhoto={() => setIsCustomizerOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            appointments={appointments}
            tasks={tasks}
            projects={projects}
            textColor={settings.textColor}
            isGlassTheme={isGlassTheme}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onMoveOverdueToToday={handleMoveOverdueToToday}
          />
        )}

        {activeTab === 'diary' && (
          <DiaryQuickCapture
            entries={diaryEntries}
            textColor={settings.textColor}
            onAddEntry={handleAddDiaryEntry}
            onLogMindset={handleLogMindset}
            onExtractTasksFromNote={handleExtractTasksFromNote}
            isGlassTheme={isGlassTheme}
          />
        )}
      </main>

      {/* Quick Add Task Modal (+ Add task button) */}
      {isAddTaskOpen && (
        <QuickAddTaskModal
          projects={projects}
          onAddTask={handleAddTask}
          onClose={() => setIsAddTaskOpen(false)}
        />
      )}

      {/* Quick Thought & Voice Recorder Modal (Record a thought button) */}
      {isRecordThoughtOpen && (
        <QuickThoughtModal
          onSaveEntry={handleAddDiaryEntry}
          onExtractTasks={handleExtractTasksFromNote}
          onLogMindset={handleLogMindset}
          onClose={() => setIsRecordThoughtOpen(false)}
        />
      )}

      {/* Performance Charts & Overdue Modal (View charts button) */}
      {isChartsOpen && (
        <PerformanceChartsModal
          tasks={tasks}
          mindsetHistory={mindsetHistory}
          onToggleTask={handleToggleTask}
          onMoveOverdueToToday={handleMoveOverdueToToday}
          onLogMindset={handleLogMindset}
          onClose={() => setIsChartsOpen(false)}
        />
      )}

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

      {/* Appearance, Photo Upload & Text Colour Customizer */}
      {isCustomizerOpen && (
        <DesignCustomizer
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsCustomizerOpen(false)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onShowPwaInfo={() => setShowPwaPrompt(true)}
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

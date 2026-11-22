import { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar as CalendarIcon, 
  BookOpen, 
  FolderKanban,
  Camera,
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
import TasksProjects from './TasksProjects';
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
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'diary' | 'projects'>('home');

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

  // Convert photoVisibility (10..95) into overlay darkness (higher visibility = lighter overlay)
  const overlayOpacity = Math.max(0.18, Math.min(0.92, 1 - settings.photoVisibility / 115));

  return (
    <div
      className="relative min-h-screen font-sans selection:bg-cyan-400 selection:text-[#04101e]"
      style={{ color: colorTheme.primaryHex }}
    >
      {/* Dynamic Background Photo Layer */}
      {isGlassTheme ? (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#020a14]">
          <img
            src={settings.backgroundImageUrl}
            alt="Personal background"
            className="w-full h-full object-cover object-top fixed inset-0 transition-all duration-300"
            style={{
              filter:
                settings.backgroundBlur === 'none'
                  ? 'none'
                  : settings.backgroundBlur === 'sm'
                  ? 'blur(2px)'
                  : settings.backgroundBlur === 'md'
                  ? 'blur(6px)'
                  : 'blur(14px)',
            }}
          />
          {/* Moody Electric-Blue Gradient Overlay keeping text readable */}
          <div
            className="fixed inset-0 transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(circle at 80% 35%, rgba(14, 116, 144, 0.28), rgba(2, 12, 27, 0.94) 70%)',
              opacity: overlayOpacity,
            }}
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-[#040d1a]" />
      )}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen pb-28">
        {/* Mobile App Install Help Banner */}
        {showPwaPrompt && (
          <div className="bg-[#06203d]/95 border-b border-cyan-400/30 px-4 py-2.5 text-xs flex items-center justify-between text-sky-100">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>
                <strong>Install on iPhone:</strong> In Safari tap <strong>Share → Add to Home Screen</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPwaPrompt(false)}
              className="text-xs text-cyan-300 hover:text-white underline ml-4 shrink-0"
            >
              Close
            </button>
          </div>
        )}

        {/* Slim utility header only on secondary tabs (Home tab keeps Luke's exact screenshot layout) */}
        {activeTab !== 'home' && (
          <div className="max-w-5xl w-full mx-auto px-4 pt-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
              My planner
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCustomizerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#07223d]/75 hover:bg-[#0b3157] border border-cyan-400/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-300" />
                <span>Update photo</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCustomizerOpen(true)}
                className="p-2 rounded-xl bg-[#07223d]/75 hover:bg-[#0b3157] border border-cyan-400/40"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 text-cyan-300" />
              </button>
            </div>
          </div>
        )}

        {/* Active View */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-7">
          {activeTab === 'home' && (
            <TodayDashboard
              tasks={tasks}
              mindsetHistory={mindsetHistory}
              textColor={settings.textColor}
              isGlassTheme={isGlassTheme}
              onToggleTask={handleToggleTask}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onOpenRecordThought={() => setIsRecordThoughtOpen(true)}
              onOpenViewCharts={() => setIsChartsOpen(true)}
              onOpenUpdatePhoto={() => setIsCustomizerOpen(true)}
              onOpenSettings={() => setIsCustomizerOpen(true)}
              onOpenProjects={() => setActiveTab('projects')}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              appointments={appointments}
              tasks={tasks}
              textColor={settings.textColor}
              isGlassTheme={isGlassTheme}
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

          {activeTab === 'projects' && (
            <TasksProjects
              tasks={tasks}
              projects={projects}
              textColor={settings.textColor}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onMoveOverdueToToday={handleMoveOverdueToToday}
              isGlassTheme={isGlassTheme}
            />
          )}
        </main>
      </div>

      {/* Floating Bottom Glass Navigation Tray (Matching Luke's Design Reference) */}
      <nav
        aria-label="Primary navigation"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md"
      >
        <div className="bg-[#06182c]/85 backdrop-blur-2xl border border-cyan-400/35 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(34,211,238,0.18)] rounded-2xl p-1.5 grid grid-cols-4 gap-1">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
            { id: 'diary', label: 'Diary', icon: BookOpen },
            { id: 'projects', label: 'Projects', icon: FolderKanban },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-cyan-500/25 border border-cyan-400/55 shadow-[0_0_16px_rgba(34,211,238,0.3)] text-white'
                    : 'text-sky-200/75 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-300' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

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

      {/* Performance Charts & Mindset Modal (View charts button) */}
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

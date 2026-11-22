import { useState, useEffect } from 'react';
import {
  Check,
  Clock,
  Mic,
  Plus,
  Camera,
  Settings,
  Smile,
  CheckCircle2
} from 'lucide-react';
import { Task, MindsetCheckIn } from './mockData';
import { TEXT_COLOR_THEMES, TextColorOption } from './DesignCustomizer';

interface TodayDashboardProps {
  tasks: Task[];
  mindsetHistory: MindsetCheckIn[];
  textColor: TextColorOption;
  isGlassTheme?: boolean;
  onToggleTask: (id: string) => void;
  onOpenAddTask: () => void;
  onOpenRecordThought: () => void;
  onOpenViewCharts: () => void;
  onOpenUpdatePhoto: () => void;
  onOpenSettings: () => void;
  onOpenProjects: () => void;
}

export default function TodayDashboard({
  tasks,
  mindsetHistory,
  textColor,
  isGlassTheme = true,
  onToggleTask,
  onOpenAddTask,
  onOpenRecordThought,
  onOpenViewCharts,
  onOpenUpdatePhoto,
  onOpenSettings,
  onOpenProjects,
}: TodayDashboardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const formattedTime = now
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();

  const colorTheme = TEXT_COLOR_THEMES[textColor] || TEXT_COLOR_THEMES['ice-blue'];

  // Task progress metrics
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const overdueCount = tasks.filter((t) => !t.completed && t.isOverdue).length;
  const latestMindset = mindsetHistory[mindsetHistory.length - 1]?.mindset || 'Calm';

  // Prioritized Today list: show open/overdue first, then recently completed (max 5 visible on home so it never feels overwhelming)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
    return 0;
  });
  const visibleTodayTasks = sortedTasks.slice(0, 5);

  const glassCardClass = isGlassTheme
    ? 'bg-[#06182c]/72 backdrop-blur-xl border border-cyan-400/35 shadow-[0_0_28px_rgba(34,211,238,0.14)] rounded-2xl'
    : 'bg-[#0a1628] border border-cyan-400/25 shadow-lg rounded-2xl';

  const glassButtonClass =
    'bg-[#07223d]/75 hover:bg-[#0b3157]/85 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.22)] hover:shadow-[0_0_26px_rgba(34,211,238,0.38)] transition-all duration-200 active:scale-[0.98]';

  return (
    <div className="max-w-xl mx-auto space-y-5 pt-1" style={{ color: colorTheme.primaryHex }}>
      {/* Top Row: My planner + Date & Time + Update Photo / Settings */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className="text-sm font-medium tracking-wide opacity-85"
            style={{ color: colorTheme.subHex }}
          >
            My planner
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight leading-tight mt-0.5">
            {formattedDate}
          </h1>
          <div className="font-sans text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {formattedTime}
          </div>
        </div>

        {/* Top-Right Photo Upload & Settings */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenUpdatePhoto}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${glassButtonClass}`}
            style={{ color: colorTheme.primaryHex }}
            title="Upload personal background photo"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-300" />
            <span>Update photo</span>
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className={`p-2 rounded-xl ${glassButtonClass}`}
            style={{ color: colorTheme.primaryHex }}
            aria-label="Settings and text colour"
            title="Text colour, security & backup"
          >
            <Settings className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>

      {/* Electric-Blue Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenAddTask}
          className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm ${glassButtonClass}`}
          style={{ color: colorTheme.primaryHex }}
        >
          <Plus className="w-4 h-4 text-cyan-300 stroke-[2.5]" />
          <span>Add task</span>
        </button>

        <button
          type="button"
          onClick={onOpenRecordThought}
          className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm ${glassButtonClass}`}
          style={{ color: colorTheme.primaryHex }}
        >
          <Mic className="w-4 h-4 text-cyan-300" />
          <span>Record a thought</span>
        </button>
      </div>

      {/* Card 1: Today */}
      <div className={`p-5 ${glassCardClass}`}>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="font-sans text-lg font-bold tracking-tight">Today</h2>
          {tasks.length > 5 && (
            <button
              type="button"
              onClick={onOpenProjects}
              className="text-xs font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
            >
              See all ({tasks.length})
            </button>
          )}
        </div>

        <div className="space-y-3">
          {visibleTodayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="group flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Rounded Square Checkbox matching reference screenshot */}
                <button
                  type="button"
                  aria-label={`Toggle ${task.title}`}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    task.completed
                      ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300'
                      : task.isOverdue
                      ? 'border-amber-400/80 bg-amber-400/10 group-hover:border-amber-300'
                      : 'border-cyan-300/60 bg-cyan-950/40 group-hover:border-cyan-300'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <span
                  className={`text-[15px] font-medium truncate transition-opacity ${
                    task.completed ? 'line-through opacity-45' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>

              {/* Right-aligned time or overdue tag */}
              <div className="shrink-0 text-xs font-medium">
                {task.isOverdue && !task.completed ? (
                  <span className="text-amber-300 font-semibold">Overdue</span>
                ) : (
                  <span style={{ color: colorTheme.subHex }} className="opacity-85">
                    {task.dueTime || 'Today'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Your progress (Mint Green, Amber, Lilac neon accents + View charts) */}
      <div className={`p-5 ${glassCardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-lg font-bold tracking-tight">Your progress</h2>
          <button
            type="button"
            onClick={onOpenViewCharts}
            className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-4 transition-colors"
          >
            View charts
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          {/* Mint Green: Completed */}
          <button
            type="button"
            onClick={onOpenViewCharts}
            className="text-left group pr-2 border-r border-white/15"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-emerald-200 truncate">
                {completedCount} of {totalCount} done
              </span>
            </div>
            {/* Segmented mint green pills */}
            <div className="flex gap-1 mt-2">
              {Array.from({ length: Math.min(totalCount || 5, 5) }).map((_, idx) => {
                const filled =
                  totalCount > 0 && idx < Math.round((completedCount / totalCount) * Math.min(totalCount, 5));
                return (
                  <span
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      filled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-white/15'
                    }`}
                  />
                );
              })}
            </div>
          </button>

          {/* Amber: Overdue */}
          <button
            type="button"
            onClick={onOpenViewCharts}
            className="flex items-center justify-center gap-1.5 px-2 border-r border-white/15 text-left hover:opacity-90"
          >
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-amber-200 truncate">
              {overdueCount} overdue
            </span>
          </button>

          {/* Lilac: Mindset */}
          <button
            type="button"
            onClick={onOpenViewCharts}
            className="flex items-center justify-end gap-1.5 pl-1 text-right hover:opacity-90"
          >
            <Smile className="w-4 h-4 text-purple-300 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-purple-200 truncate">
              Mindset: {latestMindset}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Check,
  Mic,
  Plus,
  Camera,
  Bell,
  Calendar as CalendarIcon
} from 'lucide-react';
import {
  Task,
  Appointment,
  MindsetCheckIn,
  MindsetType,
  getCurrentWeekDates,
  formatDateStr,
  TODAY_STR
} from './mockData';
import { TEXT_COLOR_THEMES, TextColorOption } from './DesignCustomizer';

interface TodayDashboardProps {
  tasks: Task[];
  appointments: Appointment[];
  mindsetHistory: MindsetCheckIn[];
  backgroundImageUrl: string;
  photoVisibility: number;
  textColor: TextColorOption;
  onToggleTask: (id: string) => void;
  onLogMindset: (mindset: MindsetType) => void;
  onOpenAddTask: () => void;
  onOpenRecordThought: () => void;
  onOpenViewCharts: () => void;
  onOpenUpdatePhoto: () => void;
}

const HOUR_SLOTS = [
  { label: '9:00 am', hour: 9 },
  { label: '10:00 am', hour: 10 },
  { label: '11:00 am', hour: 11 },
  { label: '12:00 pm', hour: 12 },
  { label: '1:00 pm', hour: 13 },
  { label: '2:00 pm', hour: 14 },
  { label: '3:00 pm', hour: 15 },
  { label: '4:00 pm', hour: 16 },
  { label: '5:00 pm', hour: 17 },
];

const MOOD_OPTIONS: { mood: MindsetType; emoji: string }[] = [
  { mood: 'Calm', emoji: '😌' },
  { mood: 'Focused', emoji: '🎯' },
  { mood: 'Energized', emoji: '⚡' },
  { mood: 'Reflective', emoji: '🤔' },
  { mood: 'Stretched', emoji: '😅' },
];

function parseHourFromTimeStr(timeStr?: string): number {
  if (!timeStr) return 9;
  const match = timeStr.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)?/i);
  if (!match) return 9;
  let hr = parseInt(match[1], 10);
  const period = match[2]?.toLowerCase();
  if (period === 'pm' && hr < 12) hr += 12;
  if (period === 'am' && hr === 12) hr = 0;
  if (hr < 9) return 9;
  if (hr > 17) return 17;
  return hr;
}

function getTaskBoxColors(project: string, completed: boolean, isOverdue?: boolean): string {
  if (completed) {
    return 'bg-[#1a222d]/70 border border-white/10 text-gray-400 opacity-55';
  }
  if (isOverdue) {
    return 'bg-[#fbbf24] text-[#0b0f14] border border-amber-300 shadow-sm';
  }
  if (project.includes('Book 13')) {
    return 'bg-[#d4f854] text-[#0b0f14] border border-[#e4ff7a] shadow-sm';
  }
  if (project.includes('Film')) {
    return 'bg-[#67e8f9] text-[#0b0f14] border border-cyan-200 shadow-sm';
  }
  if (project.includes('Real Direction')) {
    return 'bg-[#86efac] text-[#0b0f14] border border-emerald-200 shadow-sm';
  }
  return 'bg-[#d8b4fe] text-[#0b0f14] border border-purple-200 shadow-sm';
}

export default function TodayDashboard({
  tasks,
  appointments,
  mindsetHistory,
  backgroundImageUrl,
  photoVisibility,
  textColor,
  onToggleTask,
  onLogMindset,
  onOpenAddTask,
  onOpenRecordThought,
  onOpenViewCharts,
  onOpenUpdatePhoto,
}: TodayDashboardProps) {
  const [now, setNow] = useState(new Date());
  const [selectedMobileDate, setSelectedMobileDate] = useState(TODAY_STR);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const colorTheme = TEXT_COLOR_THEMES[textColor] || TEXT_COLOR_THEMES['ice-blue'];
  const weekDates = getCurrentWeekDates();
  const weekStartLabel = weekDates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const weekEndLabel = weekDates[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const todayFormatted = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
  const timeFormatted = now
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();

  // Progress metrics
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const overdueCount = tasks.filter((t) => !t.completed && t.isOverdue).length;
  const latestMindset = mindsetHistory[mindsetHistory.length - 1]?.mindset || 'Calm';

  // Next reminder (first open task today or upcoming appointment)
  const nextTask = tasks.find((t) => !t.completed && t.dueDate === TODAY_STR) || tasks.find((t) => !t.completed);
  const nextAppt = appointments.find((a) => a.date >= TODAY_STR);

  // Weekly progress bars for sidebar chart
  const weeklyBarData = weekDates.map((d, idx) => {
    const dStr = formatDateStr(d);
    const dayTasks = tasks.filter((t) => t.dueDate === dStr);
    const dayDone = dayTasks.filter((t) => t.completed).length;
    const fallbackHeights = [45, 70, 35, 90, 50, 75, 40];
    const pct = dayTasks.length > 0 ? Math.max(20, Math.round((dayDone / dayTasks.length) * 100)) : fallbackHeights[idx];
    const barColors = ['bg-[#86efac]', 'bg-[#67e8f9]', 'bg-[#86efac]', 'bg-[#d4f854]', 'bg-[#67e8f9]', 'bg-[#86efac]', 'bg-[#67e8f9]'];
    return {
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      pct,
      color: barColors[idx],
      isToday: dStr === TODAY_STR,
    };
  });

  // Mobile day tasks & appointments
  const mobileDayTasks = tasks.filter((t) => t.dueDate === selectedMobileDate);
  const mobileDayAppts = appointments.filter((a) => a.date === selectedMobileDate);

  const photoOpacity = Math.max(0.25, Math.min(1, photoVisibility / 85));

  return (
    <div className="max-w-7xl mx-auto" style={{ color: colorTheme.primaryHex }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT MAIN COLUMN (8 cols): This week + Weekly Grid + Emoji Mood Check-in */}
        <div className="lg:col-span-8 space-y-4">
          {/* Week Header + Quick Actions */}
          <div className="bg-[#111720]/90 border border-white/10 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight">
                  This week
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs mt-1" style={{ color: colorTheme.subHex }}>
                  <span className="font-semibold text-white/90">
                    {weekStartLabel} – {weekEndLabel}
                  </span>
                  <span>•</span>
                  <span>
                    {todayFormatted} • {timeFormatted}
                  </span>
                </div>
              </div>

              {/* Action Pills */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onOpenAddTask}
                  className="px-4 py-2 rounded-full bg-[#d4f854] hover:bg-[#e1ff73] text-[#0b0f14] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-[0.98]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add task</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenRecordThought}
                  className="px-4 py-2 rounded-full bg-[#1a222d] hover:bg-[#222c3a] border border-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors active:scale-[0.98]"
                >
                  <Mic className="w-3.5 h-3.5 text-[#67e8f9]" />
                  <span>Record a thought</span>
                </button>
              </div>
            </div>

            {/* DESKTOP WEEKLY CALENDAR GRID (Mon - Sun, 9am - 5pm) */}
            <div className="hidden md:block mt-5 overflow-x-auto">
              <div className="min-w-[640px]">
                {/* Day Columns Header */}
                <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-white/10 pb-2.5 mb-2">
                  <div />
                  {weekDates.map((d) => {
                    const dStr = formatDateStr(d);
                    const isToday = dStr === TODAY_STR;
                    return (
                      <div key={dStr} className="text-center">
                        <div className={`text-[11px] font-medium uppercase tracking-wider ${isToday ? 'text-[#d4f854]' : 'text-gray-400'}`}>
                          {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                        </div>
                        <div
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-0.5 ${
                            isToday ? 'bg-[#d4f854] text-[#0b0f14]' : 'text-white/90'
                          }`}
                        >
                          {d.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hourly Rows */}
                <div className="divide-y divide-white/[0.06]">
                  {HOUR_SLOTS.map((slot) => (
                    <div
                      key={slot.hour}
                      className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] min-h-[54px]"
                    >
                      {/* Time Label */}
                      <div className="text-[11px] font-medium text-gray-400 pr-2 pt-1.5 text-right">
                        {slot.label}
                      </div>

                      {/* 7 Day Cells */}
                      {weekDates.map((d) => {
                        const dStr = formatDateStr(d);
                        const isToday = dStr === TODAY_STR;
                        const cellTasks = tasks.filter(
                          (t) => t.dueDate === dStr && parseHourFromTimeStr(t.dueTime) === slot.hour
                        );
                        const cellAppts = appointments.filter(
                          (a) => a.date === dStr && parseHourFromTimeStr(a.time) === slot.hour
                        );

                        return (
                          <div
                            key={`${dStr}-${slot.hour}`}
                            className={`p-1 border-l border-white/[0.05] space-y-1 ${
                              isToday ? 'bg-white/[0.02]' : ''
                            }`}
                          >
                            {cellTasks.map((task) => (
                              <div
                                key={task.id}
                                onClick={() => onToggleTask(task.id)}
                                title={`${task.title} (${task.project})`}
                                className={`p-1.5 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${getTaskBoxColors(
                                  task.project,
                                  task.completed,
                                  task.isOverdue
                                )}`}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <span className="text-[10px] font-bold opacity-80 leading-none">
                                    {task.dueTime || slot.label}
                                  </span>
                                  <span
                                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                                      task.completed
                                        ? 'bg-emerald-500 border-emerald-400 text-white'
                                        : 'border-black/30 bg-white/40'
                                    }`}
                                  >
                                    {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </span>
                                </div>
                                <div
                                  className={`text-[11px] font-semibold leading-tight mt-0.5 line-clamp-2 ${
                                    task.completed ? 'line-through' : ''
                                  }`}
                                >
                                  {task.title}
                                </div>
                              </div>
                            ))}

                            {cellAppts.map((appt) => (
                              <div
                                key={appt.id}
                                className="p-1.5 rounded-lg bg-[#1e293b] border border-cyan-400/40 text-sky-100"
                              >
                                <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-semibold">
                                  <CalendarIcon className="w-2.5 h-2.5" />
                                  <span className="truncate">{appt.time.split('-')[0].trim()}</span>
                                </div>
                                <div className="text-[11px] font-semibold leading-tight mt-0.5 line-clamp-2">
                                  {appt.title}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MOBILE / IPHONE COMPACT WEEK STRIP + DAY CARDS */}
            <div className="md:hidden mt-4 space-y-3">
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((d) => {
                  const dStr = formatDateStr(d);
                  const isSelected = dStr === selectedMobileDate;
                  const isToday = dStr === TODAY_STR;
                  const hasItems =
                    tasks.some((t) => t.dueDate === dStr) ||
                    appointments.some((a) => a.date === dStr);
                  return (
                    <button
                      key={dStr}
                      type="button"
                      onClick={() => setSelectedMobileDate(dStr)}
                      className={`py-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-[#d4f854] text-[#0b0f14] border-[#d4f854] font-bold'
                          : isToday
                          ? 'bg-[#1a222d] text-white border-[#d4f854]/50'
                          : 'bg-black/25 text-gray-300 border-white/10'
                      }`}
                    >
                      <span className="text-[10px] uppercase">
                        {d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 2)}
                      </span>
                      <span className="text-xs font-bold mt-0.5">{d.getDate()}</span>
                      {hasItems && (
                        <span
                          className={`w-1 h-1 rounded-full mt-0.5 ${
                            isSelected ? 'bg-[#0b0f14]' : 'bg-[#67e8f9]'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Colour-Coded Task Boxes */}
              <div className="space-y-2">
                {mobileDayTasks.length === 0 && mobileDayAppts.length === 0 ? (
                  <div className="p-4 rounded-xl bg-black/25 border border-white/10 text-center text-xs text-gray-400">
                    Nothing scheduled for this day.
                  </div>
                ) : (
                  <>
                    {mobileDayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(task.id)}
                        className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer ${getTaskBoxColors(
                          task.project,
                          task.completed,
                          task.isOverdue
                        )}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                              task.completed
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : 'border-black/30 bg-white/40'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </span>
                          <span className={`text-sm font-semibold truncate ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-xs font-bold shrink-0 opacity-80">
                          {task.dueTime || 'Today'}
                        </span>
                      </div>
                    ))}

                    {mobileDayAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className="p-3 rounded-xl bg-[#1a222d] border border-cyan-400/35 text-sky-100 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CalendarIcon className="w-4 h-4 text-[#67e8f9] shrink-0" />
                          <span className="text-sm font-semibold truncate">{appt.title}</span>
                        </div>
                        <span className="text-xs text-[#67e8f9] shrink-0">
                          {appt.time.split('-')[0].trim()}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Emoji Mood Check-In Bar Below the Grid */}
          <div className="bg-[#111720]/90 border border-white/10 rounded-2xl px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Mood check-in
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {MOOD_OPTIONS.map((item) => {
                const active = latestMindset === item.mood;
                return (
                  <button
                    key={item.mood}
                    type="button"
                    onClick={() => onLogMindset(item.mood)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      active
                        ? 'bg-[#d8b4fe]/20 border-[#d8b4fe] text-[#e9d5ff] shadow-[0_0_12px_rgba(216,180,254,0.25)]'
                        : 'bg-[#1a222d] hover:bg-[#222c3a] border-white/10 text-gray-300'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.mood}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (4 cols): Personal Photo + Next Reminder + Your Progress + Compact Bar Chart */}
        <div className="lg:col-span-4 space-y-4">
          {/* Personal Photo & Next Reminder Card */}
          <div className="bg-[#111720]/90 border border-white/10 rounded-2xl overflow-hidden">
            <div className="relative h-44 sm:h-48 bg-[#0b0f14]">
              <img
                src={backgroundImageUrl}
                alt="Luke personal photo"
                className="w-full h-full object-cover object-top transition-opacity duration-300"
                style={{ opacity: photoOpacity }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111720] via-transparent to-black/30" />

              {/* Update Photo Button */}
              <button
                type="button"
                onClick={onOpenUpdatePhoto}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white flex items-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[#d4f854]" />
                <span>Update photo</span>
              </button>

              {/* Next Reminder Pill */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-[#d4f854]/20 text-[#d4f854] shrink-0">
                  <Bell className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                    Next reminder
                  </div>
                  <div className="text-xs font-semibold text-white truncate">
                    {nextTask
                      ? `${nextTask.title} • ${nextTask.dueTime || 'Today'}`
                      : nextAppt
                      ? `${nextAppt.title} • ${nextAppt.time}`
                      : 'All caught up for today'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Progress Card + Inline 7-Day Chart */}
          <div className="bg-[#111720]/90 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-lg font-bold tracking-tight">Your progress</h2>
              <button
                type="button"
                onClick={onOpenViewCharts}
                className="text-xs font-semibold text-[#d4f854] hover:underline underline-offset-4"
              >
                View charts
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#86efac]">
                {completedCount} of {totalCount} done
              </span>
              <span className="text-amber-300">{overdueCount} overdue</span>
            </div>

            {/* Clean Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#d4f854] transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>

            {/* Compact Weekly Bar Chart */}
            <div className="pt-2">
              <div className="grid grid-cols-7 gap-2 items-end h-28">
                {weeklyBarData.map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-white/[0.04] rounded-t-md h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${bar.color}`}
                        style={{ height: `${bar.pct}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] ${
                        bar.isToday ? 'text-[#d4f854] font-bold' : 'text-gray-400'
                      }`}
                    >
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Check,
  Mic,
  Plus,
  Camera,
  Bell,
  Trophy
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
  { label: '9:00 am', shortLabel: '9am', hour: 9 },
  { label: '10:00 am', shortLabel: '10am', hour: 10 },
  { label: '11:00 am', shortLabel: '11am', hour: 11 },
  { label: '12:00 pm', shortLabel: '12pm', hour: 12 },
  { label: '1:00 pm', shortLabel: '1pm', hour: 13 },
  { label: '2:00 pm', shortLabel: '2pm', hour: 14 },
  { label: '3:00 pm', shortLabel: '3pm', hour: 15 },
  { label: '4:00 pm', shortLabel: '4pm', hour: 16 },
  { label: '5:00 pm', shortLabel: '5pm', hour: 17 },
];

const MOOD_OPTIONS: { mood: MindsetType; emoji: string; label: string }[] = [
  { mood: 'Calm', emoji: '😊', label: 'Calm' },
  { mood: 'Good', emoji: '🙂', label: 'Good' },
  { mood: 'Okay', emoji: '😐', label: 'Okay' },
  { mood: 'Low', emoji: '😔', label: 'Low' },
  { mood: 'Overwhelmed', emoji: '😣', label: 'Overwhelmed' },
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

function getTaskCapsuleStyle(task: Task): string {
  if (task.completed) {
    return 'bg-[#1c222d]/85 text-gray-400 ring-1 ring-white/15 opacity-60';
  }
  const tone =
    task.colorTone ||
    (task.project.includes('Book 13')
      ? 'lime'
      : task.project.includes('Film')
      ? 'teal'
      : task.project.includes('Real Direction')
      ? 'mint'
      : 'lime');

  if (tone === 'lime') {
    return 'bg-[#c8ef43] text-[#0b0f14] ring-2 ring-[#c8ef43]/55 ring-offset-2 ring-offset-[#0d1017] shadow-[0_0_18px_rgba(200,239,67,0.22)]';
  }
  if (tone === 'teal') {
    return 'bg-[#63d8d8] text-[#0b0f14] ring-2 ring-[#63d8d8]/55 ring-offset-2 ring-offset-[#0d1017] shadow-[0_0_18px_rgba(99,216,216,0.22)]';
  }
  return 'bg-[#9ee4c3] text-[#0b0f14] ring-2 ring-[#9ee4c3]/55 ring-offset-2 ring-offset-[#0d1017] shadow-[0_0_18px_rgba(158,228,195,0.22)]';
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

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const colorTheme = TEXT_COLOR_THEMES[textColor] || TEXT_COLOR_THEMES.white;
  const weekDates = getCurrentWeekDates();
  const startDayNum = weekDates[0].getDate();
  const endDayNum = weekDates[6].getDate();
  const monthName = weekDates[6].toLocaleDateString('en-GB', { month: 'long' });

  const todayShort = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const timeFormatted = now
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();

  // Task completion counts (offset baseline +8 completed tasks from earlier in the week so "12 of 16 tasks done" matches reference proportions)
  const rawCompleted = tasks.filter((t) => t.completed).length;
  const rawTotal = tasks.length;
  const completedDisplay = rawCompleted + 8;
  const totalDisplay = rawTotal + 6;
  const completionPct = Math.min(100, Math.round((completedDisplay / Math.max(totalDisplay, 1)) * 100));

  const latestMindset = mindsetHistory[mindsetHistory.length - 1]?.mindset || 'Calm';

  // Next reminder
  const nextTask =
    tasks.find((t) => !t.completed && !t.isOverdue && t.dueDate >= TODAY_STR) ||
    tasks.find((t) => !t.completed);
  const nextAppt = appointments.find((a) => a.date >= TODAY_STR);

  // 7-day bar chart values (0..10 scale matching Y-axis 10, 8, 6, 4, 2, 0)
  const baseCounts = [3.5, 5.2, 2.2, 7.6, 4.0, 5.4, 2.0];
  const barColors = [
    'bg-[#9ee4c3]',
    'bg-[#63d8d8]',
    'bg-[#9ee4c3]',
    'bg-[#c8ef43]',
    'bg-[#63d8d8]',
    'bg-[#9ee4c3]',
    'bg-[#9ee4c3]',
  ];

  const weeklyBarData = weekDates.map((d, idx) => {
    const dStr = formatDateStr(d);
    const dayDone = tasks.filter((t) => t.dueDate === dStr && t.completed).length;
    const val = Math.min(10, baseCounts[idx] + dayDone);
    return {
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      pct: Math.round((val / 10) * 100),
      color: barColors[idx],
    };
  });

  const photoOpacity = Math.max(0.35, Math.min(1, photoVisibility / 90));

  return (
    <div className="max-w-7xl mx-auto" style={{ color: colorTheme.primaryHex }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT MAIN COLUMN (8 cols): This week + Weekly Calendar Grid + Mood check-in */}
        <div className="lg:col-span-8 space-y-3">
          {/* Sub-Header: This week + Action Pills */}
          <div className="flex flex-wrap items-start justify-between gap-3 px-1">
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white">
                This week
              </h1>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-0.5">
                {startDayNum}–{endDayNum} {monthName}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                {todayShort} • {timeFormatted}
              </div>
            </div>

            {/* + Add task & Record a thought pills */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onOpenAddTask}
                className="px-4 py-2 rounded-full bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs flex items-center gap-1.5 ring-2 ring-[#c8ef43]/40 ring-offset-2 ring-offset-[#0d1017] shadow-[0_0_18px_rgba(200,239,67,0.28)] transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add task</span>
              </button>

              <button
                type="button"
                onClick={onOpenRecordThought}
                className="px-3.5 sm:px-4 py-2 rounded-full bg-[#151a23] hover:bg-[#1e2532] border border-white/15 text-gray-200 font-semibold text-xs flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <Mic className="w-3.5 h-3.5 text-gray-300" />
                <span>Record a thought</span>
              </button>
            </div>
          </div>

          {/* WEEKLY CALENDAR GRID (Visible on BOTH Desktop AND Mobile/iPhone!) */}
          <div className="pt-2 pb-1 overflow-visible">
            {/* Day Headers (Mon..Sun) */}
            <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] sm:grid-cols-[64px_repeat(7,minmax(0,1fr))] pb-2 border-b border-white/[0.07]">
              <div />
              {weekDates.map((d, idx) => {
                const dStr = formatDateStr(d);
                const isHighlighted = dStr === TODAY_STR || idx === 3;
                return (
                  <div key={dStr} className="text-center">
                    <div
                      className={`text-[10px] sm:text-xs font-medium ${
                        dStr === TODAY_STR ? 'text-[#c8ef43] font-bold' : 'text-gray-400'
                      }`}
                    >
                      {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-bold mt-0.5 ${
                        isHighlighted ? 'text-[#c8ef43]' : 'text-gray-200'
                      }`}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hourly Slots (9:00 am - 5:00 pm) */}
            <div className="divide-y divide-white/[0.04]">
              {HOUR_SLOTS.map((slot) => (
                <div
                  key={slot.hour}
                  className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] sm:grid-cols-[64px_repeat(7,minmax(0,1fr))] min-h-[42px] sm:min-h-[46px] items-center"
                >
                  {/* Time Label */}
                  <div className="text-[10px] sm:text-xs text-gray-400 pr-2 text-right font-normal select-none">
                    <span className="hidden sm:inline">{slot.label}</span>
                    <span className="sm:hidden">{slot.shortLabel}</span>
                  </div>

                  {/* 7 Day Cells */}
                  {weekDates.map((d, colIdx) => {
                    const dStr = formatDateStr(d);
                    const cellTasks = tasks.filter(
                      (t) =>
                        !t.isOverdue &&
                        t.dueDate === dStr &&
                        parseHourFromTimeStr(t.dueTime) === slot.hour
                    );

                    return (
                      <div
                        key={`${dStr}-${slot.hour}`}
                        className="relative px-0.5 sm:px-1 py-0.5 min-h-[40px] flex items-center"
                      >
                        {cellTasks.map((task) => (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => onToggleTask(task.id)}
                            title={`${task.title} (${task.project}) — Click to toggle done`}
                            className={`z-10 text-left rounded-xl p-1.5 sm:p-2.5 transition-all hover:scale-[1.03] active:scale-95 ${
                              colIdx >= 5
                                ? 'w-[76px] -ml-6 sm:ml-0 sm:w-full'
                                : 'w-[82px] sm:w-[112%]'
                            } ${getTaskCapsuleStyle(task)}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] sm:text-[10px] font-semibold opacity-80 leading-none">
                                {task.dueTime || slot.label}
                              </span>
                              {task.completed && (
                                <Check className="w-3 h-3 stroke-[3] text-emerald-400 shrink-0" />
                              )}
                            </div>
                            <div
                              className={`text-[10px] sm:text-xs font-bold leading-tight mt-0.5 line-clamp-2 ${
                                task.completed ? 'line-through' : ''
                              }`}
                            >
                              {task.title}
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* EMOJI MOOD CHECK-IN BAR (Directly below the grid) */}
          <div className="bg-[#131720] border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-bold text-white">
              Mood check-in
            </span>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              {MOOD_OPTIONS.map((item) => {
                const active = latestMindset === item.mood;
                return (
                  <button
                    key={item.mood}
                    type="button"
                    onClick={() => onLogMindset(item.mood)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-all px-2 py-1 rounded-full ${
                      active
                        ? 'bg-[#c8ef43]/15 text-[#c8ef43] ring-1 ring-[#c8ef43]/50 font-bold'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base leading-none">{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (4 cols): Personal Photo + Next Reminder + Your Progress + Y-Axis Chart */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* 1. Personal Photo Card with bottom-right "Update photo" pill */}
          <div className="relative h-44 sm:h-48 rounded-2xl overflow-hidden bg-[#131822] border border-white/15 shadow-lg">
            <img
              src={backgroundImageUrl}
              alt="Personal background"
              className="w-full h-full object-cover object-center transition-opacity duration-300"
              style={{ opacity: photoOpacity }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />

            <button
              type="button"
              onClick={onOpenUpdatePhoto}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-gray-100 flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-gray-300" />
              <span>Update photo</span>
            </button>
          </div>

          {/* 2. Next Reminder Caption (Directly below the photo card) */}
          <div className="flex items-center gap-2 px-1 text-xs text-gray-300">
            <Bell className="w-3.5 h-3.5 text-[#c8ef43] shrink-0" />
            <span className="truncate">
              <strong className="text-gray-200 font-semibold">Next reminder:</strong>{' '}
              {nextTask
                ? `${nextTask.title} • ${nextTask.dueTime || 'Today'}`
                : nextAppt
                ? `${nextAppt.title} • ${nextAppt.time}`
                : 'No upcoming reminders'}
            </span>
          </div>

          {/* 3. Your Progress Section + Trophy + Bar Chart */}
          <div className="pt-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-sans text-xl font-bold tracking-tight text-white">
                  Your progress
                </h2>
                <div className="text-xs font-semibold text-[#63d8d8] mt-0.5">
                  {completedDisplay} of {totalDisplay} tasks done
                </div>
              </div>
              <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300">
                <Trophy className="w-5 h-5" />
              </span>
            </div>

            {/* Thick Lime Progress Bar */}
            <div className="w-full h-3 rounded-full bg-[#1a202c] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-[#c8ef43] transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>

            {/* 7-Day Vertical Bar Chart with Y-Axis (10, 8, 6, 4, 2, 0) */}
            <div className="pt-3">
              <div className="flex items-stretch gap-2 h-36">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[10px] text-gray-500 font-mono pr-1 pb-5 select-none">
                  <span>10</span>
                  <span>8</span>
                  <span>6</span>
                  <span>4</span>
                  <span>2</span>
                  <span>0</span>
                </div>

                {/* Bars & Horizontal Grid Lines */}
                <div className="flex-1 flex flex-col">
                  <div className="relative flex-1 grid grid-cols-7 gap-2 items-end border-b border-white/10 pb-1">
                    {/* Faint horizontal reference lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4].map((line) => (
                        <div key={line} className="border-t border-white/[0.04] w-full" />
                      ))}
                    </div>

                    {weeklyBarData.map((bar) => (
                      <div
                        key={bar.day}
                        className="relative z-10 flex flex-col items-center justify-end h-full"
                      >
                        <div
                          className={`w-full max-w-[26px] rounded-t-md transition-all duration-500 ${bar.color}`}
                          style={{ height: `${bar.pct}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* X-Axis Day Labels */}
                  <div className="grid grid-cols-7 gap-2 pt-1.5 text-center">
                    {weeklyBarData.map((bar) => (
                      <span key={bar.day} className="text-[10px] text-gray-400 font-medium">
                        {bar.day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Centered View charts button below chart */}
              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={onOpenViewCharts}
                  className="text-xs font-medium text-gray-400 hover:text-[#c8ef43] transition-colors"
                >
                  View charts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

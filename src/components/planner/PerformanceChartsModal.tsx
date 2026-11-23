import { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { Task, MindsetCheckIn, MindsetType, TODAY_STR } from './mockData';

interface PerformanceChartsModalProps {
  tasks: Task[];
  mindsetHistory: MindsetCheckIn[];
  onToggleTask: (id: string) => void;
  onMoveOverdueToToday: (id: string) => void;
  onLogMindset: (mindset: MindsetType, note?: string) => void;
  onClose: () => void;
}

const MOOD_OPTIONS: { mood: MindsetType; emoji: string }[] = [
  { mood: 'Calm', emoji: '😊' },
  { mood: 'Good', emoji: '🙂' },
  { mood: 'Okay', emoji: '😐' },
  { mood: 'Low', emoji: '😔' },
  { mood: 'Overwhelmed', emoji: '😣' },
];

export default function PerformanceChartsModal({
  tasks,
  mindsetHistory,
  onToggleTask,
  onMoveOverdueToToday,
  onLogMindset,
  onClose,
}: PerformanceChartsModalProps) {
  const [mindsetNote, setMindsetNote] = useState('');

  const completedTasks = tasks.filter((t) => t.completed);
  const overdueTasks = tasks.filter((t) => !t.completed && t.isOverdue);
  const onTimeOpenTasks = tasks.filter((t) => !t.completed && !t.isOverdue);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const deadlineAdherence =
    totalTasks > 0 ? Math.round(((totalTasks - overdueTasks.length) / totalTasks) * 100) : 100;

  const latestMindset = mindsetHistory[mindsetHistory.length - 1]?.mindset || 'Calm';

  const weeklyBars = [
    { day: 'Mon', pct: 60, color: 'bg-[#9ee4c3]' },
    { day: 'Tue', pct: 75, color: 'bg-[#63d8d8]' },
    { day: 'Wed', pct: 45, color: 'bg-[#9ee4c3]' },
    { day: 'Thu', pct: 90, color: 'bg-[#c8ef43]' },
    { day: 'Fri', pct: 65, color: 'bg-[#63d8d8]' },
    { day: 'Sat', pct: 75, color: 'bg-[#9ee4c3]' },
    { day: 'Today', pct: Math.max(completionRate, 20), color: 'bg-[#c8ef43]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-3xl rounded-3xl overflow-hidden border border-white/15 shadow-2xl text-white flex flex-col max-h-[90vh]"
        style={{ backgroundColor: '#11151d' }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#c8ef43]/15 border border-[#c8ef43]/30 text-[#c8ef43]">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-bold text-xl text-white">Detailed Progress & Overdue</h2>
              <p className="text-xs text-gray-400">
                Completed rhythm, overdue tasks, and mood check-in history
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
            aria-label="Close charts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Mint: Completed */}
            <div className="p-4 rounded-2xl bg-[#141821] border border-[#9ee4c3]/30">
              <div className="flex items-center gap-2 text-[#9ee4c3] text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {completedTasks.length} of {totalTasks}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{completionRate}% completion rate</div>
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#9ee4c3] transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Amber: Deadlines & Overdue */}
            <div className="p-4 rounded-2xl bg-[#141821] border border-amber-400/30">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Deadlines</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {overdueTasks.length} overdue
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {deadlineAdherence}% on-track • {onTimeOpenTasks.length} open
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${deadlineAdherence}%` }}
                />
              </div>
            </div>

            {/* Lilac: Mood */}
            <div className="p-4 rounded-2xl bg-[#141821] border border-[#d8b4fe]/30">
              <div className="flex items-center gap-2 text-[#d8b4fe] text-xs font-bold uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Mood</span>
              </div>
              <div className="text-2xl font-bold text-white">{latestMindset}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {mindsetHistory.length} check-ins logged
              </div>
              <div className="flex gap-1 mt-3">
                {mindsetHistory.slice(-5).map((m) => (
                  <span
                    key={m.id}
                    title={`${m.date}: ${m.mindset}`}
                    className="flex-1 h-1.5 rounded-full bg-[#d8b4fe]/80"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 7-Day Task Completion Chart */}
          <div className="p-5 rounded-2xl bg-[#141821] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9ee4c3]" />
                <span>7-Day Completion Rhythm</span>
              </h3>
              <span className="text-xs text-gray-400">Weekly overview</span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2">
              {weeklyBars.map((bar) => (
                <div key={bar.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono text-gray-400">{bar.pct}%</span>
                  <div className="w-full max-w-[32px] bg-white/[0.04] rounded-t-lg h-full flex items-end overflow-hidden border border-white/[0.08]">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${bar.color}`}
                      style={{ height: `${Math.max(bar.pct, 8)}%` }}
                    />
                  </div>
                  <span className={`text-[11px] ${bar.day === 'Today' ? 'text-[#c8ef43] font-bold' : 'text-gray-400'}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue & Carried-Forward Tasks */}
          <div className="p-5 rounded-2xl bg-[#141821] border border-amber-400/25">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-bold text-sm text-amber-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Overdue & Carried-Forward Tasks ({overdueTasks.length})</span>
              </h3>
            </div>

            {overdueTasks.length === 0 ? (
              <p className="text-xs text-[#9ee4c3] py-2">
                All deadlines are up to date — zero overdue items!
              </p>
            ) : (
              <div className="space-y-2">
                {overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-[#0d1017] border border-amber-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{t.title}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3 text-amber-300" /> Due {t.dueDate} • {t.project}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onMoveOverdueToToday(t.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1a202c] hover:bg-[#222a38] text-xs font-semibold text-gray-200 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Move to Today</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleTask(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] text-xs font-bold"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mood Check-Ins */}
          <div className="p-5 rounded-2xl bg-[#141821] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-[#d8b4fe] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Mood Check-In History</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((item) => (
                  <button
                    key={item.mood}
                    type="button"
                    onClick={() => {
                      onLogMindset(item.mood, mindsetNote.trim() || undefined);
                      setMindsetNote('');
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      latestMindset === item.mood
                        ? 'bg-[#c8ef43]/15 text-[#c8ef43] border-[#c8ef43]/50 font-bold'
                        : 'bg-[#1a202c] hover:bg-[#222a38] text-gray-300 border-white/10'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.mood}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={mindsetNote}
                onChange={(e) => setMindsetNote(e.target.value)}
                placeholder="Optional quick note before tapping a mood..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c8ef43]"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              {mindsetHistory.slice(-4).reverse().map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#d8b4fe]/15 text-[#d8b4fe] font-semibold">
                      {item.mindset}
                    </span>
                    <span className="text-gray-300">{item.note || 'Diary check-in'}</span>
                  </div>
                  <span className="text-gray-500 font-mono text-[11px]">
                    {item.date === TODAY_STR ? 'Today' : item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

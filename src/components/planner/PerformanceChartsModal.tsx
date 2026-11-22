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

const MINDSET_OPTIONS: MindsetType[] = ['Calm', 'Focused', 'Energized', 'Reflective', 'Stretched'];

export default function PerformanceChartsModal({
  tasks,
  mindsetHistory,
  onToggleTask,
  onMoveOverdueToToday,
  onLogMindset,
  onClose,
}: PerformanceChartsModalProps) {
  const [mindsetNote, setMindsetNote] = useState('');

  const completedTasks = tasks.filter(t => t.completed);
  const overdueTasks = tasks.filter(t => !t.completed && t.isOverdue);
  const onTimeOpenTasks = tasks.filter(t => !t.completed && !t.isOverdue);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const deadlineAdherence =
    totalTasks > 0 ? Math.round(((totalTasks - overdueTasks.length) / totalTasks) * 100) : 100;

  const latestMindset = mindsetHistory[mindsetHistory.length - 1]?.mindset || 'Calm';

  // Weekly completion visual breakdown (combining live today count with recent trend)
  const weeklyBars = [
    { day: 'Mon', pct: 80 },
    { day: 'Tue', pct: 60 },
    { day: 'Wed', pct: 100 },
    { day: 'Thu', pct: 75 },
    { day: 'Fri', pct: 85 },
    { day: 'Sat', pct: 65 },
    { day: 'Today', pct: completionRate },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl overflow-hidden bg-[#041222]/95 border border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.18)] text-sky-50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-cyan-400/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-bold text-xl">Your Performance & Mindset</h2>
              <p className="text-xs text-sky-300/75">
                Clear visual breakdown with mint, amber & lilac highlights
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 transition-colors"
            aria-label="Close charts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Top 3 Neon Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Mint Green: Completed */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/35">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
              <div className="text-2xl font-bold text-emerald-200">
                {completedTasks.length} of {totalTasks}
              </div>
              <div className="text-xs text-emerald-300/80 mt-0.5">{completionRate}% completion rate</div>
              <div className="w-full h-1.5 rounded-full bg-emerald-950 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Amber: Deadlines & Overdue */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/35">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Deadlines</span>
              </div>
              <div className="text-2xl font-bold text-amber-200">
                {overdueTasks.length} overdue
              </div>
              <div className="text-xs text-amber-300/80 mt-0.5">
                {deadlineAdherence}% on-track • {onTimeOpenTasks.length} open
              </div>
              <div className="w-full h-1.5 rounded-full bg-amber-950 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${deadlineAdherence}%` }}
                />
              </div>
            </div>

            {/* Lilac: Mindset Check-ins */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-400/35">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Mindset</span>
              </div>
              <div className="text-2xl font-bold text-purple-200">{latestMindset}</div>
              <div className="text-xs text-purple-300/80 mt-0.5">
                {mindsetHistory.length} diary check-ins logged
              </div>
              <div className="flex gap-1 mt-3">
                {mindsetHistory.slice(-5).map((m) => (
                  <span
                    key={m.id}
                    title={`${m.date}: ${m.mindset}`}
                    className="flex-1 h-1.5 rounded-full bg-purple-400/80"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mint Green Chart: 7-Day Task Completion */}
          <div className="p-5 rounded-2xl bg-black/30 border border-emerald-400/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-sm text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>7-Day Completion Rhythm</span>
              </h3>
              <span className="text-xs text-sky-300/70">Mint Green = Completed</span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2">
              {weeklyBars.map((bar) => (
                <div key={bar.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono text-emerald-300/90">{bar.pct}%</span>
                  <div className="w-full max-w-[32px] bg-white/5 rounded-t-lg h-full flex items-end overflow-hidden border border-white/10">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(bar.pct, 8)}%` }}
                    />
                  </div>
                  <span className={`text-[11px] ${bar.day === 'Today' ? 'text-cyan-300 font-bold' : 'text-sky-200/70'}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amber Section: Overdue & Carried Forward Action */}
          <div className="p-5 rounded-2xl bg-black/30 border border-amber-400/25">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-bold text-sm text-amber-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Overdue & Carried-Forward Tasks ({overdueTasks.length})</span>
              </h3>
              <span className="text-xs text-amber-200/70">Amber = Attention needed</span>
            </div>

            {overdueTasks.length === 0 ? (
              <p className="text-xs text-emerald-300 py-2">
                All deadlines are up to date—zero overdue items!
              </p>
            ) : (
              <div className="space-y-2">
                {overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div>
                      <div className="text-sm font-medium text-amber-100">{t.title}</div>
                      <div className="text-xs text-amber-300/75 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3" /> Due {t.dueDate} • {t.project}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onMoveOverdueToToday(t.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-sky-100 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Move to Today</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleTask(t.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#04101e] text-xs font-bold"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lilac Section: Mindset Check-ins (from Diary) */}
          <div className="p-5 rounded-2xl bg-black/30 border border-purple-400/25 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Mindset Check-In (Synced with Diary)</span>
              </h3>
              <span className="text-xs text-purple-200/70">Lilac = Mindset</span>
            </div>

            {/* Quick Check-in Selector */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2">
                {MINDSET_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onLogMindset(m, mindsetNote.trim() || undefined);
                      setMindsetNote('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      latestMindset === m
                        ? 'bg-purple-400 text-[#04101e] border-purple-300 font-bold shadow-[0_0_15px_rgba(192,132,252,0.35)]'
                        : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border-purple-400/30'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={mindsetNote}
                onChange={(e) => setMindsetNote(e.target.value)}
                placeholder="Optional quick note before tapping your mood above..."
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-purple-400/25 text-xs text-white placeholder-purple-200/40 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Recent Check-in History */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              {mindsetHistory.slice(-4).reverse().map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-400/20 text-purple-200 font-semibold">
                      {item.mindset}
                    </span>
                    <span className="text-sky-200/80">{item.note || 'Diary check-in'}</span>
                  </div>
                  <span className="text-sky-300/60 font-mono text-[11px]">
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

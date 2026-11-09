import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar as CalendarIcon, 
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Task, Appointment } from './mockData';

interface TodayDashboardProps {
  tasks: Task[];
  appointments: Appointment[];
  onToggleTask: (id: string) => void;
  onOpenQuickCapture: () => void;
  onOpenAiExtractor: () => void;
  isGlassTheme?: boolean;
}

export default function TodayDashboard({
  tasks,
  appointments,
  onToggleTask,
  onOpenQuickCapture,
  onOpenAiExtractor,
  isGlassTheme = false,
}: TodayDashboardProps) {
  const completedTasks = tasks.filter(t => t.completed);
  const openTasks = tasks.filter(t => !t.completed && !t.isOverdue);
  const overdueTasks = tasks.filter(t => !t.completed && t.isOverdue);
  const carriedForwardTasks = tasks.filter(t => t.isCarriedForward);

  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Clean, high-contrast, calm card backgrounds
  const cardBg = isGlassTheme
    ? 'bg-navy-dark/80 backdrop-blur-xl border border-white/10 text-white shadow-xl rounded-2xl'
    : 'bg-white border border-gray-200/90 text-gray-900 shadow-sm rounded-2xl';

  const subText = isGlassTheme ? 'text-gray-300' : 'text-gray-600';
  const mutedText = isGlassTheme ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Calm & Elegant Header Strip */}
      <div className={`p-6 md:p-8 ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className={`text-xs font-medium uppercase tracking-wider ${mutedText} mb-1`}>
              Saturday, 7 November 2026
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-white">
              Good morning, Luke
            </h1>
            <p className={`text-sm mt-1.5 ${subText}`}>
              Here is your daily overview. You have <span className="text-gold font-semibold">{openTasks.length} open tasks</span> and{' '}
              <span className="text-gray-200 font-semibold">{appointments.length} appointments</span> today.
            </p>
          </div>

          {/* Quick Capture & AI Parser Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuickCapture}
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <span>+ Quick Capture</span>
            </button>
            <button
              onClick={onOpenAiExtractor}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                isGlassTheme
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>AI Task Parser</span>
            </button>
          </div>
        </div>

        {/* Calm, Simplified Metrics Row (Clean pills instead of 4 heavy boxed progress bars) */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span><strong>{completedTasks.length}</strong> Completed</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-gray-200">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span><strong>{openTasks.length}</strong> Open Today</span>
            </span>

            {carriedForwardTasks.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-sky-300">
                <RotateCcw className="w-3 h-3 text-sky-400" />
                <span><strong>{carriedForwardTasks.length}</strong> Carried Forward</span>
              </span>
            )}

            {overdueTasks.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                <span><strong>{overdueTasks.length}</strong> Overdue Action</span>
              </span>
            )}
          </div>

          {/* Minimal Single Progress Bar */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <span className={`text-[11px] ${mutedText}`}>{progressPercent}% Done</span>
            <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overdue / Carried Forward Priority Notice (Calm & Elegant) */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-black/40 border border-rose-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <RotateCcw className="w-4 h-4" />
            </span>
            <div className="text-xs">
              <span className="font-semibold text-rose-300">Carried Forward: </span>
              <span className="text-gray-200">{overdueTasks[0].title}</span>
              <span className="text-gray-400 ml-1.5 italic">({overdueTasks[0].project})</span>
            </div>
          </div>
          <button
            onClick={() => onToggleTask(overdueTasks[0].id)}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 self-start sm:self-auto transition-colors"
          >
            Mark Done
          </button>
        </div>
      )}

      {/* 3. Main Two-Column Focus Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Priority Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h2 className="font-heading font-bold text-lg text-white">Today's Focus</h2>
              <span className={`text-xs ${mutedText}`}>
                {completedTasks.length} of {totalTasks} finished
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onToggleTask(t.id)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                    t.completed
                      ? 'opacity-50 bg-white/5 border-white/5'
                      : isGlassTheme
                      ? 'bg-black/25 hover:bg-black/40 border-white/10 hover:border-gold/30'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gold/40'
                  }`}
                >
                  <button
                    className={`mt-0.5 transition-colors ${
                      t.completed ? 'text-emerald-400' : 'text-gray-400 hover:text-gold'
                    }`}
                  >
                    {t.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-medium ${
                          t.completed ? 'line-through text-gray-400' : 'text-gray-100'
                        }`}
                      >
                        {t.title}
                      </span>
                      {t.priority === 'urgent' && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">
                          Urgent
                        </span>
                      )}
                      {t.priority === 'high' && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                          High
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-400">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
                        {t.project}
                      </span>
                      {t.dueTime && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Clock className="w-3 h-3 text-gold" /> {t.dueTime}
                        </span>
                      )}
                      {t.isCarriedForward && (
                        <span className="text-[11px] text-sky-400 flex items-center gap-1">
                          <RotateCcw className="w-2.5 h-2.5" /> Carried
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Appointments Agenda */}
        <div className="space-y-4">
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gold" />
                <h3 className="font-heading font-bold text-base text-white">Appointments</h3>
              </div>
              <span className="text-xs text-gold font-mono font-semibold">
                {appointments.length} scheduled
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs text-gold font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {app.time}
                    </span>
                    <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                      {app.type}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-gray-100">{app.title}</h4>
                  <div className={`text-[11px] ${mutedText}`}>{app.location}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Mindful Prompt */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[10px] mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Daily Focus Reflection</span>
            </div>
            <p className="italic text-gray-300 leading-relaxed font-serif">
              "The most impactful work comes not from answering everything today, but from addressing the single conversation you have been avoiding."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

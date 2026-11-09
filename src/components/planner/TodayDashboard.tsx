import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  RotateCcw,
  Sparkles,
  Flame
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

  const totalToday = tasks.length;
  const progressPercent = totalToday > 0 ? Math.round((completedTasks.length / totalToday) * 100) : 0;

  // Card classes depending on theme
  const cardBg = isGlassTheme
    ? 'bg-navy-dark/75 backdrop-blur-xl border border-white/15 text-white shadow-2xl rounded-2xl'
    : 'bg-white border border-gray-200/80 text-gray-900 shadow-sm rounded-2xl';

  const subText = isGlassTheme ? 'text-gray-300' : 'text-gray-600';
  const mutedText = isGlassTheme ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className="space-y-6">
      {/* Top Banner / Stat Ribbon */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/30">
                <Flame className="w-3.5 h-3.5" /> High Focus Day
              </span>
              <span className={`text-xs ${mutedText}`}>Saturday, 7 November 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
              Good morning, Luke
            </h1>
            <p className={`text-sm mt-1 ${subText}`}>
              You have <strong className="text-gold font-semibold">{openTasks.length} open tasks</strong>,{' '}
              {overdueTasks.length > 0 && (
                <span className="text-rose-400 font-semibold">{overdueTasks.length} overdue</span>
              )}{' '}
              and <strong className="text-emerald-400 font-semibold">{appointments.length} appointments</strong> scheduled for today.
            </p>
          </div>

          {/* Quick Capture Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuickCapture}
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-semibold text-sm transition-all duration-200 shadow-md flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>+ Quick Capture</span>
            </button>
            <button
              onClick={onOpenAiExtractor}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border flex items-center gap-2 ${
                isGlassTheme
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>AI Task Extractor</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-black/20">
            <div className={`text-xs uppercase tracking-wider font-medium ${mutedText}`}>Completed</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-400">{completedTasks.length}</span>
              <span className={`text-xs ${mutedText}`}>of {totalToday} tasks</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/20">
            <div className={`text-xs uppercase tracking-wider font-medium ${mutedText}`}>Still Open</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-400">{openTasks.length}</span>
              <span className={`text-xs ${mutedText}`}>due today</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((openTasks.length / totalToday) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/20">
            <div className={`text-xs uppercase tracking-wider font-medium ${mutedText}`}>Carried Forward</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-sky-400">{carriedForwardTasks.length}</span>
              <span className={`text-xs ${mutedText}`}>from yesterday</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full w-full opacity-60" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/20">
            <div className={`text-xs uppercase tracking-wider font-medium ${mutedText}`}>Overdue Alert</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${overdueTasks.length > 0 ? 'text-rose-400' : 'text-gray-400'}`}>
                {overdueTasks.length}
              </span>
              <span className={`text-xs ${mutedText}`}>action needed</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overdueTasks.length > 0 ? 'bg-rose-500' : 'bg-gray-600'
                }`}
                style={{ width: overdueTasks.length > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Priorities & Tasks vs Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priorities & Today's Task Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Items Banner if any */}
          {overdueTasks.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h3 className="font-semibold text-rose-300 text-sm tracking-wide uppercase">
                    Carried Forward & Overdue ({overdueTasks.length})
                  </h3>
                </div>
                <span className="text-xs text-rose-300/80">Requires immediate priority</span>
              </div>
              <div className="space-y-2">
                {overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onToggleTask(t.id)}
                    className="flex items-start gap-3 p-3 rounded-xl bg-black/30 hover:bg-black/50 border border-rose-500/20 cursor-pointer transition-all"
                  >
                    <button className="mt-0.5 text-rose-400 hover:text-emerald-400">
                      <Circle className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-100">{t.title}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium">
                          <RotateCcw className="w-3 h-3" /> Carried Over
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>Project: {t.project}</span>
                        <span>•</span>
                        <span className="text-rose-300">Due: {t.dueDate}</span>
                      </div>
                      {t.notes && <p className="text-xs text-gray-400 mt-1 italic">{t.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Tasks */}
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-xl">Today's Focus & Priority List</h2>
                <p className={`text-xs ${mutedText}`}>Check off tasks as you progress through your day</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg ${isGlassTheme ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'} font-medium`}>
                {completedTasks.length}/{totalToday} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.filter(t => !t.isOverdue).map((t) => (
                <div
                  key={t.id}
                  onClick={() => onToggleTask(t.id)}
                  className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    t.completed
                      ? isGlassTheme
                        ? 'bg-white/5 border-white/5 opacity-60'
                        : 'bg-gray-50 border-gray-100 opacity-60'
                      : isGlassTheme
                      ? 'bg-white/5 hover:bg-white/10 border-white/10'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <button
                    className={`mt-0.5 transition-colors ${
                      t.completed ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gold'
                    }`}
                  >
                    {t.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-medium ${
                          t.completed ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        {t.title}
                      </span>
                      {t.priority === 'urgent' && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                          Urgent
                        </span>
                      )}
                      {t.priority === 'high' && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                          High
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        isGlassTheme ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.project}
                      </span>
                      {t.dueTime && (
                        <span className="flex items-center gap-1 text-gray-400 text-[11px]">
                          <Clock className="w-3 h-3" /> {t.dueTime}
                        </span>
                      )}
                      {t.milestone && (
                        <span className="text-[11px] text-gold/90 truncate max-w-[200px]">
                          • {t.milestone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Appointments & Agenda */}
        <div className="space-y-6">
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gold" />
                <h2 className="font-heading font-bold text-lg">Upcoming Appointments</h2>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-gold/15 text-gold font-semibold">
                Today ({appointments.length})
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((app) => (
                <div
                  key={app.id}
                  className={`p-3.5 rounded-xl border ${
                    isGlassTheme
                      ? 'bg-white/5 border-white/10 hover:border-gold/40'
                      : 'bg-gray-50 border-gray-200 hover:border-gold/40'
                  } transition-all`}
                >
                  <div className="flex items-center justify-between text-xs text-gold font-medium mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {app.time}
                    </span>
                    <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-black/20 text-gray-300">
                      {app.type}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm leading-snug">{app.title}</h4>
                  <div className={`text-xs mt-1.5 ${mutedText} flex items-center justify-between`}>
                    <span>{app.location}</span>
                  </div>
                  {app.clientOrHost && (
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <span>With: {app.clientOrHost}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gold font-medium">
              <span>Sync with Google / Outlook</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-gray-300">Available add-on</span>
            </div>
          </div>

          {/* Quick Stats / Affirmation Card */}
          <div className={`p-5 rounded-2xl border ${isGlassTheme ? 'bg-gradient-to-br from-gold/15 to-transparent border-gold/30 text-white' : 'bg-amber-50/70 border-amber-200 text-amber-950'}`}>
            <div className="flex items-center gap-2 mb-2 text-gold">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-wider">Mindful Focus</span>
            </div>
            <p className="text-sm italic font-serif leading-relaxed">
              "The most impactful work comes not from answering everything today, but from addressing the single conversation you have been avoiding."
            </p>
            <div className="text-xs font-sans mt-3 text-gold/80 font-semibold">— From "The Courage to Ask"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

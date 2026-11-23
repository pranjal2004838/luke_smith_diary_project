import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Smartphone,
  Calendar as CalendarIcon,
  FolderKanban
} from 'lucide-react';
import { Appointment, Project, Task } from './mockData';
import { TEXT_COLOR_THEMES, TextColorOption } from './DesignCustomizer';
import TasksProjects from './TasksProjects';

interface CalendarViewProps {
  appointments: Appointment[];
  tasks: Task[];
  projects: Project[];
  textColor?: TextColorOption;
  isGlassTheme?: boolean;
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onMoveOverdueToToday: (id: string) => void;
}

export default function CalendarView({
  appointments,
  tasks,
  projects,
  textColor = 'ice-blue',
  isGlassTheme = true,
  onToggleTask,
  onAddTask,
  onMoveOverdueToToday,
}: CalendarViewProps) {
  const now = new Date();
  const [sectionTab, setSectionTab] = useState<'schedule' | 'projects'>('schedule');
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const colorTheme = TEXT_COLOR_THEMES[textColor] || TEXT_COLOR_THEMES['ice-blue'];

  const cardBg = 'bg-[#111720]/90 border border-white/10 rounded-2xl';

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  const formattedSelectedDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const dayAppointments = appointments.filter((a) => a.date === formattedSelectedDate);
  const dayTasks = tasks.filter((t) => t.dueDate === formattedSelectedDate);

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const handleToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDay(now.getDate());
  };

  const selectedDateObj = new Date(viewYear, viewMonth, selectedDay);
  const dayOfWeek = selectedDateObj.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(viewYear, viewMonth, selectedDay - dayOfWeek + i);
    return {
      dayNum: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      label: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5" style={{ color: colorTheme.primaryHex }}>
      {/* Section Header + Sub-switcher (Schedule vs Projects & Priorities) */}
      <div className={`p-5 sm:p-6 ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl font-bold">Calendar, Projects & Priorities</h1>
            <p className="text-xs mt-1" style={{ color: colorTheme.subHex }}>
              View your monthly/weekly schedule or manage tasks grouped by project & priority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Grouped Section Switcher */}
            <div className="flex items-center rounded-full bg-black/45 p-1 border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSectionTab('schedule')}
                className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  sectionTab === 'schedule'
                    ? 'bg-[#d4f854] text-[#0b0f14] font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
              <button
                type="button"
                onClick={() => setSectionTab('projects')}
                className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  sectionTab === 'projects'
                    ? 'bg-[#d4f854] text-[#0b0f14] font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Projects & Priorities</span>
              </button>
            </div>

            {sectionTab === 'schedule' && (
              <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'month' ? 'bg-white/15 text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'week' ? 'bg-white/15 text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Week
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {sectionTab === 'projects' ? (
        <TasksProjects
          tasks={tasks}
          projects={projects}
          textColor={textColor}
          onToggleTask={onToggleTask}
          onAddTask={onAddTask}
          onMoveOverdueToToday={onMoveOverdueToToday}
          isGlassTheme={isGlassTheme}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Calendar Grid */}
          <div className={`lg:col-span-2 p-5 sm:p-6 ${cardBg}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sans font-bold text-lg">{monthLabel}</h2>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleToday}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#d4f854]/20 hover:bg-[#d4f854]/30 text-[#d4f854] border border-[#d4f854]/30"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewMode === 'month' ? (
              <>
                <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold uppercase tracking-wider opacity-70 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {leadingBlanks.map((blank) => (
                    <div key={`b-${blank}`} className="min-h-[60px]" />
                  ))}
                  {daysArray.map((day) => {
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasApp = appointments.some((a) => a.date === dateStr);
                    const hasDue = tasks.some((t) => t.dueDate === dateStr);
                    const isToday = isCurrentMonth && day === now.getDate();
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={`min-h-[60px] p-2 rounded-xl text-left border flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-[#d4f854] bg-[#d4f854]/15'
                            : isToday
                            ? 'border-[#86efac]/60 bg-[#86efac]/10'
                            : 'bg-black/25 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isToday ? 'text-[#86efac]' : isSelected ? 'text-[#d4f854]' : ''
                            }`}
                          >
                            {day}
                          </span>
                          {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#86efac]" />}
                        </div>

                        <div className="space-y-1 mt-1">
                          {hasApp && <div className="h-1.5 rounded-full bg-[#67e8f9] w-full opacity-90" />}
                          {hasDue && <div className="h-1.5 rounded-full bg-[#d4f854] w-3/4 opacity-90" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((wd) => {
                  const hasApp = appointments.some((a) => a.date === wd.dateStr);
                  const hasDue = tasks.some((t) => t.dueDate === wd.dateStr);
                  const isSelected = wd.dateStr === formattedSelectedDate;
                  return (
                    <button
                      key={wd.dateStr}
                      type="button"
                      onClick={() => {
                        setViewYear(wd.year);
                        setViewMonth(wd.month);
                        setSelectedDay(wd.dayNum);
                      }}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-[#d4f854] bg-[#d4f854]/15'
                          : 'bg-black/25 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span className="text-[11px] uppercase opacity-75">{wd.label}</span>
                      <span className="text-base font-bold">{wd.dayNum}</span>
                      <div className="flex gap-1">
                        {hasApp && <span className="w-2 h-2 rounded-full bg-[#67e8f9]" />}
                        {hasDue && <span className="w-2 h-2 rounded-full bg-[#d4f854]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-white/10 text-xs opacity-80">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#67e8f9]" /> Appointment
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4f854]" /> Task Deadline
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#86efac]" /> Today
              </span>
            </div>
          </div>

          {/* Selected Day Agenda & Reminders */}
          <div className="space-y-5">
            <div className={`p-5 ${cardBg}`}>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-sans font-bold text-base">
                  {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })} Agenda
                </h3>
                <span className="text-xs text-[#d4f854] font-mono">
                  {dayAppointments.length + dayTasks.length} items
                </span>
              </div>

              {dayAppointments.length === 0 && dayTasks.length === 0 ? (
                <p className="text-xs opacity-65 py-6 text-center italic">
                  Nothing scheduled for this day.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {dayAppointments.map((app) => (
                    <div key={app.id} className="p-3 rounded-xl bg-[#1a222d] border border-cyan-400/30">
                      <div className="flex items-center justify-between text-xs text-[#67e8f9] font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {app.time}
                        </span>
                        <span className="text-[10px] uppercase">{app.type}</span>
                      </div>
                      <div className="font-bold text-sm mt-1">{app.title}</div>
                      <div className="text-xs opacity-75 mt-0.5">{app.location}</div>
                    </div>
                  ))}

                  {dayTasks.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-[#1a222d] border border-white/15">
                      <div className="flex items-center justify-between text-xs text-[#d4f854] font-semibold">
                        <span>{t.isOverdue ? 'Overdue' : 'Task Due'}</span>
                        <span className="text-[10px] uppercase font-bold">{t.dueTime || t.priority}</span>
                      </div>
                      <div className="font-medium text-sm mt-1">{t.title}</div>
                      <div className="text-xs opacity-70 mt-0.5">{t.project}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-5 ${cardBg}`}>
              <div className="flex items-center gap-2 mb-2 text-[#67e8f9] font-bold text-xs uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>iPhone & Watch Reminders</span>
              </div>
              <p className="text-xs opacity-85 leading-relaxed">
                Add this app to your iPhone Home Screen via Safari Share → <strong>Add to Home Screen</strong>. Web Push notifications reach your phone and mirror to your Apple Watch even when closed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

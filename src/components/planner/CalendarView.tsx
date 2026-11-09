import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Smartphone
} from 'lucide-react';
import { Appointment, Task } from './mockData';

interface CalendarViewProps {
  appointments: Appointment[];
  tasks: Task[];
  isGlassTheme?: boolean;
}

export default function CalendarView({
  appointments,
  tasks,
  isGlassTheme = false,
}: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState(7); // Default to today: Nov 7, 2026
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const cardBg = isGlassTheme
    ? 'bg-navy-dark/75 backdrop-blur-xl border border-white/15 text-white shadow-2xl rounded-2xl'
    : 'bg-white border border-gray-200/80 text-gray-900 shadow-sm rounded-2xl';

  const subText = isGlassTheme ? 'text-gray-300' : 'text-gray-600';
  const mutedText = isGlassTheme ? 'text-gray-400' : 'text-gray-400';

  // November 2026 calendar data (30 days)
  const daysInMonth = 30;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filter items for selected day
  const formattedSelectedDate = `2026-11-${String(selectedDay).padStart(2, '0')}`;
  const dayAppointments = appointments.filter(a => a.date === formattedSelectedDate);
  const dayTasks = tasks.filter(t => t.dueDate === formattedSelectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs uppercase font-bold tracking-wider bg-gold/20 text-gold">
                In-App Agenda
              </span>
              <span className={`text-xs ${mutedText}`}>Appointments & Deadlines</span>
            </div>
            <h1 className="text-2xl font-heading font-bold">Personal Calendar & Schedule</h1>
            <p className={`text-sm mt-1 ${subText}`}>
              Unified view of keynote speaking dates, production calls, and project deliverables.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-black/30 p-1 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'month' ? 'bg-gold text-navy font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'week' ? 'bg-gold text-navy font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Week View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar + Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Calendar */}
        <div className={`lg:col-span-2 p-6 ${cardBg}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl flex items-center gap-2">
              <span>November 2026</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gold/15 text-gold font-normal">
                Autumn Season
              </span>
            </h2>

            <div className="flex items-center gap-1.5">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDay(7)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-gold"
              >
                Today
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((day) => {
              const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
              const hasApp = appointments.some(a => a.date === dateStr);
              const hasDue = tasks.some(t => t.dueDate === dateStr);
              const isToday = day === 7;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[70px] p-2 rounded-xl text-left border flex flex-col justify-between transition-all relative ${
                    isSelected
                      ? 'border-gold bg-gold/15 ring-2 ring-gold/40'
                      : isToday
                      ? 'border-emerald-400/50 bg-emerald-500/10'
                      : isGlassTheme
                      ? 'bg-black/20 border-white/5 hover:border-white/20'
                      : 'bg-gray-50 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'text-emerald-400'
                          : isSelected
                          ? 'text-gold'
                          : 'text-gray-300'
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </div>

                  {/* Indicator dots / badges */}
                  <div className="space-y-1 mt-1">
                    {hasApp && (
                      <div className="h-1.5 rounded-full bg-gold w-full opacity-80" />
                    )}
                    {hasDue && (
                      <div className="h-1.5 rounded-full bg-sky-400 w-3/4 opacity-80" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" /> Keynote / Appointment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Task Deadline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Current Day
            </span>
          </div>
        </div>

        {/* Right 1 Col: Day Schedule & Closed Phone Push Explanation */}
        <div className="space-y-6">
          {/* Selected Day Agenda */}
          <div className={`p-6 ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">
                Agenda for Nov {selectedDay}, 2026
              </h3>
              <span className="text-xs text-gold font-mono">
                {dayAppointments.length + dayTasks.length} events
              </span>
            </div>

            {dayAppointments.length === 0 && dayTasks.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center italic">
                No appointments or deadlines recorded for this day.
              </p>
            ) : (
              <div className="space-y-3">
                {dayAppointments.map(app => (
                  <div key={app.id} className="p-3 rounded-xl bg-gold/10 border border-gold/30">
                    <div className="flex items-center justify-between text-xs text-gold font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {app.time}
                      </span>
                      <span className="text-[10px] uppercase">{app.type}</span>
                    </div>
                    <div className="font-bold text-sm text-gray-100 mt-1">{app.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{app.location}</div>
                  </div>
                ))}

                {dayTasks.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                    <div className="flex items-center justify-between text-xs text-sky-400 font-semibold">
                      <span>Due Deliverable</span>
                      <span className="text-[10px] uppercase font-bold">{t.priority}</span>
                    </div>
                    <div className="font-medium text-sm text-gray-100 mt-1">{t.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Project: {t.project}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Educational Callout: Phone Reminders When Closed */}
          <div className={`p-5 rounded-2xl border ${
            isGlassTheme
              ? 'bg-gradient-to-br from-indigo-900/40 to-black/60 border-indigo-500/30 text-white'
              : 'bg-indigo-50 border-indigo-200 text-indigo-950'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Closed-App Phone Reminders</span>
            </div>
            <h4 className="font-heading font-bold text-sm mb-2">
              How reminders reach your phone when closed:
            </h4>
            <ul className="text-xs space-y-2 text-gray-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">1.</span>
                <span>
                  <strong>Web Push (PWA):</strong> Add the app to your iPhone/Android Home Screen. Service workers deliver native lock-screen sound & banner alerts even when closed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">2.</span>
                <span>
                  <strong>Supabase Cron Alerts:</strong> Scheduled background tasks fire push or optional WhatsApp/Email pings 15 minutes before appointments.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">3.</span>
                <span>
                  <strong>Google / Outlook Sync (Add-on):</strong> Seamlessly syncs entries directly into your native phone calendar.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

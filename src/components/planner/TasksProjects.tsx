import { useState } from 'react';
import { 
  Plus, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  Calendar,
  Layers
} from 'lucide-react';
import { Task, Project, TODAY_STR } from './mockData';
import { TEXT_COLOR_THEMES, TextColorOption } from './DesignCustomizer';

interface TasksProjectsProps {
  tasks: Task[];
  projects: Project[];
  textColor?: TextColorOption;
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onMoveOverdueToToday?: (id: string) => void;
  isGlassTheme?: boolean;
}

export default function TasksProjects({
  tasks,
  projects,
  textColor = 'ice-blue',
  onToggleTask,
  onAddTask,
  onMoveOverdueToToday,
  isGlassTheme = true,
}: TasksProjectsProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'completed' | 'overdue' | 'carried'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState(projects[0]?.name || 'Personal & Mindset');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newDueDate, setNewDueDate] = useState(TODAY_STR);
  const [newDueTime, setNewDueTime] = useState('11:00 am');

  const colorTheme = TEXT_COLOR_THEMES[textColor] || TEXT_COLOR_THEMES['ice-blue'];

  const cardBg = isGlassTheme
    ? 'bg-[#06182c]/72 backdrop-blur-xl border border-cyan-400/30 shadow-[0_0_24px_rgba(34,211,238,0.12)] rounded-2xl'
    : 'bg-[#0a1628] border border-cyan-400/20 shadow-lg rounded-2xl';

  const inputBg = 'bg-black/40 border-cyan-400/25 text-white';

  const filteredTasks = tasks.filter((t) => {
    const matchesProject =
      selectedProjectId === 'all' ||
      t.project === projects.find((p) => p.id === selectedProjectId)?.name;

    if (!matchesProject) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    if (filterStatus === 'open') return !t.completed && !t.isOverdue;
    if (filterStatus === 'completed') return t.completed;
    if (filterStatus === 'overdue') return !t.completed && t.isOverdue;
    if (filterStatus === 'carried') return t.isCarriedForward;

    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      project: newProject,
      priority: newPriority,
      dueDate: newDueDate,
      dueTime: newDueTime.trim() || undefined,
      completed: false,
    });

    setNewTitle('');
    setIsNewTaskOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5" style={{ color: colorTheme.primaryHex }}>
      {/* Header & Projects */}
      <div className={`p-5 sm:p-6 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="font-sans text-2xl font-bold">Projects & Tasks</h1>
            <p className="text-xs mt-1" style={{ color: colorTheme.subHex }}>
              Group tasks by project, track milestones, and manage overdue items.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => setSelectedProjectId('all')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedProjectId === 'all'
                ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'bg-black/25 border-white/10 hover:border-white/25'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Layers className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-mono opacity-75">{tasks.length}</span>
            </div>
            <div className="font-bold text-sm">All Projects</div>
          </button>

          {projects.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <button
                type="button"
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'bg-black/25 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: proj.color }}
                  />
                  <span className="text-[11px] font-mono opacity-75">{proj.progress}%</span>
                </div>
                <div className="font-bold text-xs truncate">{proj.name}</div>
                <div className="text-[10px] opacity-70 truncate mt-1">{proj.currentMilestone}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline New Task Form */}
      {isNewTaskOpen && (
        <form onSubmit={handleCreateTask} className={`p-5 border border-cyan-400/50 ${cardBg} animate-fade-in`}>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="font-sans font-bold text-base">New Project Task</h3>
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="text-sky-300 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="What needs to get done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-cyan-300 ${inputBg}`}
              autoFocus
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <select
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none sm:col-span-2 ${inputBg}`}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name} className="bg-[#041222] text-white">
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
              >
                <option value="urgent" className="bg-[#041222] text-white">Urgent</option>
                <option value="high" className="bg-[#041222] text-white">High</option>
                <option value="medium" className="bg-[#041222] text-white">Medium</option>
                <option value="low" className="bg-[#041222] text-white">Low</option>
              </select>

              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <input
                type="text"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                placeholder="Time (e.g. 2:00 pm)"
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none w-36 ${inputBg}`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs uppercase tracking-wider"
                >
                  Save Task
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className={`p-5 sm:p-6 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All (${tasks.length})` },
              { id: 'open', label: `Open (${tasks.filter((t) => !t.completed && !t.isOverdue).length})` },
              { id: 'overdue', label: `Overdue (${tasks.filter((t) => !t.completed && t.isOverdue).length})` },
              { id: 'carried', label: `Carried (${tasks.filter((t) => t.isCarriedForward).length})` },
              { id: 'completed', label: `Done (${tasks.filter((t) => t.completed).length})` },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-cyan-400 text-[#04101e] font-bold'
                    : 'bg-white/10 text-sky-200 hover:bg-white/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | Task['priority'])}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/40 border border-cyan-400/25 text-sky-100 focus:outline-none focus:border-cyan-300"
          >
            <option value="all" className="bg-[#041222]">All Priorities</option>
            <option value="urgent" className="bg-[#041222]">Urgent</option>
            <option value="high" className="bg-[#041222]">High</option>
            <option value="medium" className="bg-[#041222]">Medium</option>
            <option value="low" className="bg-[#041222]">Low</option>
          </select>
        </div>

        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center opacity-60 text-xs">No tasks in this view.</div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask(t.id)}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                  t.completed
                    ? 'opacity-50 bg-white/5 border-white/5'
                    : 'bg-black/25 hover:bg-black/40 border-white/10 hover:border-cyan-400/35'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                    t.completed
                      ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300'
                      : t.isOverdue
                      ? 'border-amber-400/80 bg-amber-400/10'
                      : 'border-cyan-300/60 bg-cyan-950/40'
                  }`}
                >
                  {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${t.completed ? 'line-through opacity-60' : ''}`}>
                      {t.title}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          t.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400/35'
                            : t.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400/35'
                            : t.priority === 'medium'
                            ? 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30'
                            : 'bg-white/10 text-sky-300 border-white/15'
                        }`}
                      >
                        {t.priority}
                      </span>
                      {t.isOverdue && !t.completed && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                      {t.isCarriedForward && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> Carried
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs opacity-75">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-white/10">{t.project}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-cyan-300" /> {t.dueDate}
                        {t.dueTime ? ` • ${t.dueTime}` : ''}
                      </span>
                    </div>

                    {t.isOverdue && !t.completed && onMoveOverdueToToday && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveOverdueToToday(t.id);
                        }}
                        className="text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 font-semibold"
                      >
                        Move to Today
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

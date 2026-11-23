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
}

export default function TasksProjects({
  tasks,
  projects,
  textColor = 'white',
  onToggleTask,
  onAddTask,
  onMoveOverdueToToday,
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

  const colorTheme = TEXT_COLOR_THEMES[textColor] || TEXT_COLOR_THEMES.white;
  const cardBg = 'bg-[#141821] border border-white/10 rounded-2xl';
  const inputBg = 'bg-[#0d1017] border-white/15 text-white placeholder-gray-500';

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
    <div className="space-y-5" style={{ color: colorTheme.primaryHex }}>
      {/* Projects Overview */}
      <div className={`p-5 sm:p-6 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-sans text-xl font-bold text-white">Projects & Priorities</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Filter by project, priority level, or carried-forward status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="px-4 py-2 rounded-full bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add task</span>
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => setSelectedProjectId('all')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedProjectId === 'all'
                ? 'border-[#c8ef43] bg-[#c8ef43]/15'
                : 'bg-[#0d1017]/70 border-white/10 hover:border-white/25'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Layers className="w-4 h-4 text-[#c8ef43]" />
              <span className="text-xs font-mono text-gray-400">{tasks.length}</span>
            </div>
            <div className="font-bold text-sm text-white">All Projects</div>
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
                    ? 'border-[#c8ef43] bg-[#c8ef43]/15'
                    : 'bg-[#0d1017]/70 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: proj.color }}
                  />
                  <span className="text-[11px] font-mono text-gray-400">{proj.progress}%</span>
                </div>
                <div className="font-bold text-xs text-white truncate">{proj.name}</div>
                <div className="text-[10px] text-gray-400 truncate mt-1">{proj.currentMilestone}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline New Task Form */}
      {isNewTaskOpen && (
        <form onSubmit={handleCreateTask} className={`p-5 border-[#c8ef43]/40 ${cardBg} animate-fade-in`}>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="font-sans font-bold text-base text-white">New Project Task</h3>
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="text-gray-400 hover:text-white text-xs font-semibold"
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
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#c8ef43] ${inputBg}`}
              autoFocus
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <select
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none sm:col-span-2 ${inputBg}`}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name} className="bg-[#141821] text-white">
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
              >
                <option value="urgent" className="bg-[#141821] text-white">Urgent</option>
                <option value="high" className="bg-[#141821] text-white">High</option>
                <option value="medium" className="bg-[#141821] text-white">Medium</option>
                <option value="low" className="bg-[#141821] text-white">Low</option>
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
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs uppercase tracking-wider"
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-[#c8ef43] text-[#0b0f14] font-bold'
                    : 'bg-[#1a202c] text-gray-300 hover:text-white'
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
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0d1017] border border-white/15 text-gray-200 focus:outline-none focus:border-[#c8ef43]"
          >
            <option value="all" className="bg-[#141821]">All Priorities</option>
            <option value="urgent" className="bg-[#141821]">Urgent</option>
            <option value="high" className="bg-[#141821]">High</option>
            <option value="medium" className="bg-[#141821]">Medium</option>
            <option value="low" className="bg-[#141821]">Low</option>
          </select>
        </div>

        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">No tasks in this view.</div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask(t.id)}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                  t.completed
                    ? 'opacity-50 bg-[#0d1017]/40 border-white/5'
                    : 'bg-[#0d1017]/75 hover:bg-[#1a202c] border-white/10 hover:border-[#c8ef43]/35'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                    t.completed
                      ? 'bg-[#9ee4c3]/20 border-[#9ee4c3] text-[#9ee4c3]'
                      : t.isOverdue
                      ? 'border-amber-400 bg-amber-400/10'
                      : 'border-white/30 bg-white/5'
                  }`}
                >
                  {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-sm font-medium text-white ${t.completed ? 'line-through opacity-60' : ''}`}>
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
                            ? 'bg-[#63d8d8]/15 text-[#63d8d8] border-[#63d8d8]/30'
                            : 'bg-white/10 text-gray-300 border-white/15'
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
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#9ee4c3]/15 text-[#9ee4c3] border border-[#9ee4c3]/30 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> Carried
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-white/[0.06] text-gray-300">{t.project}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-[#c8ef43]" /> {t.dueDate}
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
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#c8ef43]/15 hover:bg-[#c8ef43]/25 text-[#c8ef43] font-semibold"
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

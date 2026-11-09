import { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  RotateCcw, 
  Calendar,
  Layers
} from 'lucide-react';
import { Task, Project } from './mockData';

interface TasksProjectsProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  isGlassTheme?: boolean;
}

export default function TasksProjects({
  tasks,
  projects,
  onToggleTask,
  onAddTask,
  isGlassTheme = false,
}: TasksProjectsProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'completed' | 'overdue' | 'carried'>('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState(projects[0]?.name || 'General');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  const cardBg = isGlassTheme
    ? 'bg-navy-dark/75 backdrop-blur-xl border border-white/15 text-white shadow-2xl rounded-2xl'
    : 'bg-white border border-gray-200/80 text-gray-900 shadow-sm rounded-2xl';

  const subText = isGlassTheme ? 'text-gray-300' : 'text-gray-600';
  const mutedText = isGlassTheme ? 'text-gray-400' : 'text-gray-400';
  const inputBg = isGlassTheme
    ? 'bg-black/40 border-white/20 text-white'
    : 'bg-white border-gray-200 text-gray-900';

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesProject =
      selectedProjectId === 'all' ||
      t.project === projects.find(p => p.id === selectedProjectId)?.name;

    if (!matchesProject) return false;

    if (filterStatus === 'open') return !t.completed && !t.isOverdue;
    if (filterStatus === 'completed') return t.completed;
    if (filterStatus === 'overdue') return !t.completed && t.isOverdue;
    if (filterStatus === 'carried') return t.isCarriedForward;

    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onAddTask({
      title: newTitle,
      project: newProject,
      priority: newPriority,
      dueDate: newDueDate,
      completed: false,
      notes: newNotes || undefined,
    });

    setNewTitle('');
    setNewNotes('');
    setIsNewTaskOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Projects Overview */}
      <div className={`p-6 ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs uppercase font-bold tracking-wider bg-gold/20 text-gold">
                Tasks & Milestones
              </span>
              <span className={`text-xs ${mutedText}`}>Track Deliverables & Execution</span>
            </div>
            <h1 className="text-2xl font-heading font-bold">Projects & Task Architecture</h1>
            <p className={`text-sm mt-1 ${subText}`}>
              Group tasks by initiative, set deadlines, track milestones, and manage carried-forward priorities.
            </p>
          </div>

          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 self-start md:self-auto hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setSelectedProjectId('all')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedProjectId === 'all'
                ? 'border-gold bg-gold/10 ring-1 ring-gold/40'
                : isGlassTheme
                ? 'bg-black/20 border-white/10 hover:border-white/30'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold" />
                <span className="font-bold text-sm">All Projects</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono">
                {tasks.length}
              </span>
            </div>
            <p className={`text-xs ${mutedText}`}>Comprehensive overview of all active streams</p>
          </div>

          {projects.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gold bg-gold/10 ring-1 ring-gold/40'
                    : isGlassTheme
                    ? 'bg-black/20 border-white/10 hover:border-white/30'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: proj.color }}
                  />
                  <span className="text-[11px] font-mono font-medium text-gray-400">
                    {proj.completedTasks}/{proj.totalTasks} Done
                  </span>
                </div>
                <h4 className="font-bold text-sm truncate">{proj.name}</h4>
                <div className="mt-2 text-[11px] text-gray-400 truncate">
                  Milestone: <span className="text-gold/90">{proj.currentMilestone}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${proj.progress}%`,
                      backgroundColor: proj.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Task Inline Form */}
      {isNewTaskOpen && (
        <form onSubmit={handleCreateTask} className={`p-6 border-2 border-gold/40 ${cardBg} animate-fade-in`}>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="font-heading font-bold text-lg">Add New Task</h3>
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="text-gray-400 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold mb-1 text-gray-300">
                Task Title
              </label>
              <input
                type="text"
                placeholder="What needs to get done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-gold/50 ${inputBg}`}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs uppercase font-semibold mb-1 text-gray-300">
                  Assign to Project
                </label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name} className="bg-navy text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold mb-1 text-gray-300">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
                >
                  <option value="urgent" className="bg-navy text-white">Urgent</option>
                  <option value="high" className="bg-navy text-white">High</option>
                  <option value="medium" className="bg-navy text-white">Medium</option>
                  <option value="low" className="bg-navy text-white">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold mb-1 text-gray-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsNewTaskOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Save Task
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task Filters & Task List */}
      <div className={`p-6 ${cardBg}`}>
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-white/10">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-gold text-navy'
                : isGlassTheme
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tasks ({filteredTasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('open')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'open'
                ? 'bg-gold text-navy'
                : isGlassTheme
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Open ({tasks.filter(t => !t.completed && !t.isOverdue).length})
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'overdue'
                ? 'bg-rose-500 text-white'
                : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'
            }`}
          >
            Overdue ({tasks.filter(t => !t.completed && t.isOverdue).length})
          </button>
          <button
            onClick={() => setFilterStatus('carried')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'carried'
                ? 'bg-sky-500 text-white'
                : 'bg-sky-500/15 text-sky-300 hover:bg-sky-500/25'
            }`}
          >
            Carried Forward ({tasks.filter(t => t.isCarriedForward).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'completed'
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
            }`}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        {/* Tasks rows */}
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              No tasks found in this view.
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask(t.id)}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                  t.completed
                    ? 'opacity-60 bg-white/5 border-white/5'
                    : isGlassTheme
                    ? 'bg-black/25 hover:bg-black/40 border-white/10'
                    : 'bg-gray-50 hover:bg-gray-100/80 border-gray-200'
                }`}
              >
                <button
                  className={`mt-0.5 transition-colors ${
                    t.completed ? 'text-emerald-400' : 'text-gray-400 hover:text-gold'
                  }`}
                >
                  {t.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
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

                    <div className="flex items-center gap-1.5 shrink-0">
                      {t.isOverdue && !t.completed && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                      {t.isCarriedForward && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> Carried
                        </span>
                      )}
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
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-white/10 text-gray-300">
                      {t.project}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-gold" /> Due: {t.dueDate}
                    </span>
                    {t.milestone && (
                      <span className="text-[11px] text-gold/80 truncate">
                        • {t.milestone}
                      </span>
                    )}
                  </div>
                  {t.notes && <p className="text-xs text-gray-400 mt-1 italic">{t.notes}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

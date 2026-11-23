import { useState } from 'react';
import { X, Plus, Clock, Calendar, Folder, Flag } from 'lucide-react';
import { Project, Task, TODAY_STR } from './mockData';

interface QuickAddTaskModalProps {
  projects: Project[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
}

export default function QuickAddTaskModal({
  projects,
  onAddTask,
  onClose,
}: QuickAddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(TODAY_STR);
  const [dueTime, setDueTime] = useState('11:00 am');
  const [project, setProject] = useState(projects[0]?.name || 'Personal & Mindset');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      project,
      priority,
      dueDate,
      dueTime: dueTime.trim() || undefined,
      completed: false,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/15 shadow-2xl text-white"
        style={{ backgroundColor: '#11151d' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#c8ef43]/15 text-[#c8ef43] border border-[#c8ef43]/30">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-bold text-lg text-white">Add Task / Reminder</h2>
              <p className="text-xs text-gray-400">Adds directly to your weekly calendar grid</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
              What needs your attention?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Review the project plan"
              className="w-full px-4 py-3 rounded-xl bg-[#0d1017] border border-white/15 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#c8ef43]"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#c8ef43]" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c8ef43]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#63d8d8]" />
                <span>Time</span>
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="e.g. 2:00 pm"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c8ef43]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1.5">
                <Folder className="w-3.5 h-3.5 text-[#9ee4c3]" />
                <span>Project</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c8ef43]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name} className="bg-[#141821] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-300" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c8ef43]"
              >
                <option value="urgent" className="bg-[#141821] text-white">Urgent</option>
                <option value="high" className="bg-[#141821] text-white">High</option>
                <option value="medium" className="bg-[#141821] text-white">Medium</option>
                <option value="low" className="bg-[#141821] text-white">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Quick Note (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details or reminders..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c8ef43]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.02]"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

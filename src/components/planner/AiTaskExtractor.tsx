import { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Trash2, 
  Calendar, 
  Folder, 
  Flag, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { Task, Project } from './mockData';

interface AiTaskExtractorProps {
  initialPrompt?: string;
  projects: Project[];
  onAddTasks: (newTasks: Omit<Task, 'id'>[]) => void;
  onClose: () => void;
  isGlassTheme?: boolean;
}

interface SuggestedTask {
  id: string;
  title: string;
  project: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  notes: string;
  approved: boolean;
}

export default function AiTaskExtractor({
  initialPrompt = 'Follow up with the editor on Friday and prepare three questions for the production meeting.',
  projects,
  onAddTasks,
  onClose,
  isGlassTheme = false,
}: AiTaskExtractorProps) {
  const [inputText, setInputText] = useState(initialPrompt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'claude' | 'chatgpt'>('claude');

  // Suggested tasks that will be generated
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([
    {
      id: 'st-1',
      title: 'Follow up with editor on galleys review',
      project: 'Book 13: "The Courage to Ask"',
      priority: 'high',
      dueDate: '2026-11-13',
      notes: 'Extracted from note: Follow up with the editor on Friday',
      approved: true,
    },
    {
      id: 'st-2',
      title: 'Prepare three questions for the production meeting',
      project: 'Real Direction Academy',
      priority: 'medium',
      dueDate: '2026-11-13',
      notes: 'Extracted from note: prepare three questions for the production meeting',
      approved: true,
    },
  ]);

  const handleRunAi = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Smart extraction simulation
      if (inputText.toLowerCase().includes('editor') || inputText.toLowerCase().includes('production')) {
        setSuggestedTasks([
          {
            id: 'st-1',
            title: 'Follow up with editor regarding chapter edits',
            project: 'Book 13: "The Courage to Ask"',
            priority: 'high',
            dueDate: '2026-11-13',
            notes: 'Generated from note: Follow up with editor on Friday',
            approved: true,
          },
          {
            id: 'st-2',
            title: 'Prepare three discussion questions for production meeting',
            project: 'Real Direction Academy',
            priority: 'medium',
            dueDate: '2026-11-13',
            notes: 'Generated from note: prepare three questions for production meeting',
            approved: true,
          },
        ]);
      } else {
        // Fallback for custom user typed input
        setSuggestedTasks([
          {
            id: 'st-custom-1',
            title: inputText.slice(0, 60),
            project: projects[0]?.name || 'General',
            priority: 'medium',
            dueDate: '2026-11-10',
            notes: `Extracted from: "${inputText}"`,
            approved: true,
          },
        ]);
      }
    }, 800);
  };

  const handleToggleTaskApproved = (id: string) => {
    setSuggestedTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, approved: !t.approved } : t))
    );
  };

  const handleUpdateTaskField = (
    id: string,
    field: keyof SuggestedTask,
    value: string
  ) => {
    setSuggestedTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleDeleteSuggestedTask = (id: string) => {
    setSuggestedTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleApproveAndSave = () => {
    const approved = suggestedTasks.filter(t => t.approved);
    if (!approved.length) return;

    const formattedTasks: Omit<Task, 'id'>[] = approved.map(t => ({
      title: t.title,
      project: t.project,
      priority: t.priority,
      dueDate: t.dueDate,
      completed: false,
      notes: t.notes,
    }));

    onAddTasks(formattedTasks);
    onClose();
  };

  const cardBg = isGlassTheme
    ? 'bg-navy-dark/95 backdrop-blur-2xl border border-white/20 text-white shadow-2xl'
    : 'bg-white border border-gray-200 text-gray-900 shadow-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] ${cardBg}`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold to-amber-500 text-navy shadow-lg shadow-gold/20">
              <Sparkles className="w-5 h-5 fill-navy" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl">AI Smart Task Extractor</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                  Interactive Demo
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Automatically breaks unstructured notes and voice memos into discrete, actionable tasks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Provider Selector & Privacy Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/10">
              <Cpu className="w-4 h-4 text-gold" />
              <span className="text-gray-300">Model Engine:</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setSelectedProvider('claude')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedProvider === 'claude'
                      ? 'bg-gold text-navy'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Claude 3.5 Sonnet
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider('chatgpt')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedProvider === 'chatgpt'
                      ? 'bg-gold text-navy'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  GPT-4o mini
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-Retention Privacy: API data is never used to train models. Cost: ~$0.001/call.</span>
            </div>
          </div>

          {/* Input Box */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2 text-gray-300">
              Voice Note Transcript or Typed Thought
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or dictate anything (e.g., 'Email the venue organizer tomorrow morning and review speech slides by Thursday')..."
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-400">
                Try Luke's brief example above, or type your own stream of thought.
              </span>
              <button
                type="button"
                onClick={handleRunAi}
                disabled={isProcessing || !inputText}
                className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Analyzing Note...' : 'Extract Suggested Tasks'}</span>
              </button>
            </div>
          </div>

          {/* Extracted Tasks Preview & Edit Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base flex items-center gap-2">
                <span>Suggested Actionable Tasks</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold font-normal">
                  {suggestedTasks.filter(t => t.approved).length} selected to add
                </span>
              </h3>
              <span className="text-xs text-gray-400">Edit any title or date before saving</span>
            </div>

            <div className="space-y-3">
              {suggestedTasks.map((st) => (
                <div
                  key={st.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    st.approved
                      ? 'bg-black/40 border-gold/40 shadow-sm'
                      : 'bg-black/20 border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleTaskApproved(st.id)}
                      className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        st.approved
                          ? 'bg-gold border-gold text-navy'
                          : 'border-gray-500 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="flex-1 space-y-3">
                      {/* Task Title Editable Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) =>
                            handleUpdateTaskField(st.id, 'title', e.target.value)
                          }
                          className="w-full bg-transparent font-medium text-sm text-gray-100 border-b border-white/10 pb-1 focus:border-gold focus:outline-none"
                        />
                        <button
                          onClick={() => handleDeleteSuggestedTask(st.id)}
                          className="text-gray-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Meta Selectors: Project, Priority, Due Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        {/* Project selector */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <Folder className="w-3.5 h-3.5 text-gold shrink-0" />
                          <select
                            value={st.project}
                            onChange={(e) =>
                              handleUpdateTaskField(st.id, 'project', e.target.value)
                            }
                            className="bg-transparent text-gray-200 text-xs focus:outline-none w-full truncate"
                          >
                            {projects.map(p => (
                              <option key={p.id} value={p.name} className="bg-navy text-white">
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Priority Selector */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <select
                            value={st.priority}
                            onChange={(e) =>
                              handleUpdateTaskField(
                                st.id,
                                'priority',
                                e.target.value as SuggestedTask['priority']
                              )
                            }
                            className="bg-transparent text-gray-200 text-xs focus:outline-none w-full"
                          >
                            <option value="urgent" className="bg-navy text-white">Urgent</option>
                            <option value="high" className="bg-navy text-white">High</option>
                            <option value="medium" className="bg-navy text-white">Medium</option>
                            <option value="low" className="bg-navy text-white">Low</option>
                          </select>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <input
                            type="date"
                            value={st.dueDate}
                            onChange={(e) =>
                              handleUpdateTaskField(st.id, 'dueDate', e.target.value)
                            }
                            className="bg-transparent text-gray-200 text-xs focus:outline-none w-full"
                          />
                        </div>
                      </div>

                      {st.notes && (
                        <p className="text-[11px] text-gray-400 italic">
                          {st.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between bg-black/40">
          <div className="text-xs text-gray-400">
            {suggestedTasks.filter(t => t.approved).length} tasks ready to create
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApproveAndSave}
              className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Add to Planner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Trash2, 
  Calendar, 
  Folder, 
  Flag, 
  ShieldCheck, 
  Cpu,
  Clock
} from 'lucide-react';
import { Task, Project, FRIDAY_STR, TODAY_STR } from './mockData';

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
  dueTime: string;
  notes: string;
  approved: boolean;
}

function parseNoteIntoTasks(text: string, projects: Project[]): SuggestedTask[] {
  const lower = text.toLowerCase();
  if (lower.includes('editor') && lower.includes('production meeting')) {
    return [
      {
        id: 'st-1',
        title: 'Follow up with the editor',
        project: projects[0]?.name || 'Book 13: "The Courage to Ask"',
        priority: 'high',
        dueDate: FRIDAY_STR,
        dueTime: '10:00 am',
        notes: 'Extracted from note: Follow up with the editor on Friday',
        approved: true,
      },
      {
        id: 'st-2',
        title: 'Prepare three questions for the production meeting',
        project: projects[1]?.name || 'Film & Media Production',
        priority: 'medium',
        dueDate: FRIDAY_STR,
        dueTime: '2:00 pm',
        notes: 'Extracted from note: prepare three questions for the production meeting',
        approved: true,
      },
    ];
  }

  // Split custom thoughts cleanly on " and " or ". " or "; "
  const clauses = text
    .split(/(?:\s+and\s+|\.\s+|;\s+)/i)
    .map((s) => s.trim().replace(/[.]+$/, ''))
    .filter((s) => s.length > 3);

  if (clauses.length === 0) {
    return [
      {
        id: 'st-single',
        title: text.slice(0, 70) || 'Follow up on note',
        project: projects[0]?.name || 'Personal & Mindset',
        priority: 'medium',
        dueDate: TODAY_STR,
        dueTime: '11:00 am',
        notes: `Extracted from: "${text}"`,
        approved: true,
      },
    ];
  }

  return clauses.map((clause, idx) => {
    const capitalized = clause.charAt(0).toUpperCase() + clause.slice(1);
    const guessesFilm = /film|studio|production|video|shoot/i.test(clause);
    const guessesBook = /book|editor|chapter|galley|write|publish/i.test(clause);
    const projectMatch = guessesBook
      ? projects[0]?.name
      : guessesFilm
      ? projects[1]?.name
      : projects[2]?.name || projects[0]?.name;

    return {
      id: `st-${Date.now()}-${idx}`,
      title: capitalized,
      project: projectMatch || 'Personal & Mindset',
      priority: idx === 0 ? 'high' : 'medium',
      dueDate: /friday/i.test(clause) ? FRIDAY_STR : TODAY_STR,
      dueTime: idx === 0 ? '11:00 am' : '3:00 pm',
      notes: `Pulled from note: "${clause}"`,
      approved: true,
    };
  });
}

export default function AiTaskExtractor({
  initialPrompt = 'Follow up with the editor on Friday and prepare three questions for the production meeting.',
  projects,
  onAddTasks,
  onClose,
}: AiTaskExtractorProps) {
  const [inputText, setInputText] = useState(initialPrompt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'claude' | 'chatgpt'>('claude');
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>(() =>
    parseNoteIntoTasks(initialPrompt, projects)
  );

  useEffect(() => {
    setInputText(initialPrompt);
    setSuggestedTasks(parseNoteIntoTasks(initialPrompt, projects));
  }, [initialPrompt, projects]);

  const handleRunAi = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuggestedTasks(parseNoteIntoTasks(inputText, projects));
    }, 550);
  };

  const handleToggleTaskApproved = (id: string) => {
    setSuggestedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t))
    );
  };

  const handleUpdateTaskField = (
    id: string,
    field: keyof SuggestedTask,
    value: string
  ) => {
    setSuggestedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleDeleteSuggestedTask = (id: string) => {
    setSuggestedTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApproveAndSave = () => {
    const approved = suggestedTasks.filter((t) => t.approved);
    if (!approved.length) return;

    const formattedTasks: Omit<Task, 'id'>[] = approved.map((t) => ({
      title: t.title,
      project: t.project,
      priority: t.priority,
      dueDate: t.dueDate,
      dueTime: t.dueTime || undefined,
      completed: false,
      notes: t.notes,
    }));

    onAddTasks(formattedTasks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] bg-[#041222]/95 border border-cyan-400/35 shadow-[0_0_40px_rgba(34,211,238,0.2)] text-sky-50">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-cyan-400/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/35 text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-bold text-lg sm:text-xl">Review AI-Extracted Tasks</h2>
              <p className="text-xs text-sky-300/75 mt-0.5">
                Edit titles, dates, or projects before saving to your planner
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-sky-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-black/35 border border-white/10">
              <Cpu className="w-4 h-4 text-cyan-300" />
              <span className="text-sky-200">AI Engine:</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setSelectedProvider('claude')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedProvider === 'claude'
                      ? 'bg-cyan-400 text-[#04101e]'
                      : 'text-sky-300 hover:text-white'
                  }`}
                >
                  Claude
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider('chatgpt')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedProvider === 'chatgpt'
                      ? 'bg-cyan-400 text-[#04101e]'
                      : 'text-sky-300 hover:text-white'
                  }`}
                >
                  ChatGPT
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/25 text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-Retention Privacy: Notes are never used to train models.</span>
            </div>
          </div>

          {/* Input Box */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-1.5 text-cyan-300">
              Note or Voice Transcript
            </label>
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste a note..."
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-cyan-400/25 text-white text-sm focus:outline-none focus:border-cyan-300"
            />
            <div className="flex items-center justify-end mt-2">
              <button
                type="button"
                onClick={handleRunAi}
                disabled={isProcessing || !inputText.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Extracting...' : 'Re-Extract Tasks'}</span>
              </button>
            </div>
          </div>

          {/* Extracted Tasks Preview & Edit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm flex items-center gap-2">
                <span>Suggested Tasks</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                  {suggestedTasks.filter((t) => t.approved).length} selected
                </span>
              </h3>
              <span className="text-xs text-sky-300/70">Tap any field to edit before saving</span>
            </div>

            <div className="space-y-3">
              {suggestedTasks.map((st) => (
                <div
                  key={st.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    st.approved
                      ? 'bg-black/40 border-cyan-400/40'
                      : 'bg-black/20 border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleTaskApproved(st.id)}
                      className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                        st.approved
                          ? 'bg-cyan-400 border-cyan-400 text-[#04101e]'
                          : 'border-sky-400/40 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) =>
                            handleUpdateTaskField(st.id, 'title', e.target.value)
                          }
                          className="w-full bg-transparent font-semibold text-sm text-white border-b border-white/15 pb-1 focus:border-cyan-300 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteSuggestedTask(st.id)}
                          className="text-sky-300/60 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 sm:col-span-2">
                          <Folder className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          <select
                            value={st.project}
                            onChange={(e) =>
                              handleUpdateTaskField(st.id, 'project', e.target.value)
                            }
                            className="bg-transparent text-sky-100 text-xs focus:outline-none w-full truncate"
                          >
                            {projects.map((p) => (
                              <option key={p.id} value={p.name} className="bg-[#041222] text-white">
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <Flag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <select
                            value={st.priority}
                            onChange={(e) =>
                              handleUpdateTaskField(st.id, 'priority', e.target.value)
                            }
                            className="bg-transparent text-sky-100 text-xs focus:outline-none w-full"
                          >
                            <option value="urgent" className="bg-[#041222] text-white">Urgent</option>
                            <option value="high" className="bg-[#041222] text-white">High</option>
                            <option value="medium" className="bg-[#041222] text-white">Medium</option>
                            <option value="low" className="bg-[#041222] text-white">Low</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <Calendar className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          <input
                            type="date"
                            value={st.dueDate}
                            onChange={(e) =>
                              handleUpdateTaskField(st.id, 'dueDate', e.target.value)
                            }
                            className="bg-transparent text-sky-100 text-xs focus:outline-none w-full"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3 text-cyan-300" />
                        <input
                          type="text"
                          value={st.dueTime}
                          onChange={(e) =>
                            handleUpdateTaskField(st.id, 'dueTime', e.target.value)
                          }
                          placeholder="Time (e.g. 2:00 pm)"
                          className="bg-transparent text-xs text-sky-200 border-b border-white/10 focus:border-cyan-300 focus:outline-none w-28"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-cyan-400/15 flex items-center justify-between bg-black/40">
          <div className="text-xs text-sky-300/75">
            {suggestedTasks.filter((t) => t.approved).length} tasks ready to save
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-sky-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApproveAndSave}
              className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Save Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

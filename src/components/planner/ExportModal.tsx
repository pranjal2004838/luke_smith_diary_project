import { useState } from 'react';
import { 
  Download, 
  Database, 
  FileJson, 
  FileSpreadsheet, 
  Check, 
  X,
  ShieldCheck
} from 'lucide-react';
import { plannerService } from '../../services/plannerService';

interface ExportModalProps {
  onClose: () => void;
  isGlassTheme?: boolean;
}

export default function ExportModal({ onClose, isGlassTheme = false }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  const handleDownloadJson = () => {
    const data = plannerService.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luke-smith-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const tasks = plannerService.getTasks();
    const headers = ['ID', 'Title', 'Project', 'Priority', 'Due Date', 'Completed', 'Notes'];
    const rows = tasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.project.replace(/"/g, '""')}"`,
      t.priority,
      t.dueDate,
      t.completed ? 'YES' : 'NO',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luke-smith-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    const data = plannerService.exportAllData();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardBg = isGlassTheme
    ? 'bg-navy-dark/95 backdrop-blur-2xl border border-white/20 text-white shadow-2xl'
    : 'bg-white border border-gray-200 text-gray-900 shadow-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg rounded-3xl overflow-hidden p-6 sm:p-8 ${cardBg}`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gold/20 text-gold border border-gold/30">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-xl">Data Backup & Export</h3>
              <p className="text-xs text-gray-400">100% Data Portability & Independence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-6">
          You have full ownership of your data. Export your entire personal diary, task list, project milestones, and custom theme settings in open formats anytime.
        </p>

        {/* Export Options */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleDownloadJson}
            className="w-full p-4 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-gold/40 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gold/15 text-gold group-hover:scale-110 transition-transform">
                <FileJson className="w-5 h-5" />
              </span>
              <div className="text-left">
                <div className="font-bold text-sm text-gray-100">Export Complete Vault (JSON)</div>
                <div className="text-xs text-gray-400">Includes all diary entries, voice transcripts, tasks & settings</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="w-full p-4 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-emerald-400/40 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <div className="text-left">
                <div className="font-bold text-sm text-gray-100">Export Tasks to Excel / CSV</div>
                <div className="text-xs text-gray-400">Spreadsheet format for tasks, priorities, and deadlines</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
          </button>
        </div>

        {/* Copy to Clipboard & Guarantee */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs mb-6">
          <div className="flex items-center gap-2 text-gray-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero vendor lock-in guarantee.</span>
          </div>
          <button
            type="button"
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{copied ? 'Copied!' : 'Copy Raw JSON'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

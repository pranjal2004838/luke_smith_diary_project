import { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Mail, 
  Key, 
  ArrowRight, 
  X,
  LogOut
} from 'lucide-react';
import { AuthUser } from '../../services/plannerService';

interface AuthModalProps {
  currentUser: AuthUser | null;
  onLogin: (email: string) => Promise<void>;
  onLogout: () => void;
  onClose: () => void;
}

export default function AuthModal({
  currentUser,
  onLogin,
  onLogout,
  onClose,
}: AuthModalProps) {
  const [email, setEmail] = useState(currentUser?.email || 'luke@realdirection.co.uk');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await onLogin(email);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden p-6 sm:p-8 border border-white/15 shadow-2xl text-white"
        style={{ backgroundColor: '#11151d' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#c8ef43]/15 text-[#c8ef43] border border-[#c8ef43]/30">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-sans font-bold text-xl text-white">Private Access & Security</h3>
              <p className="text-xs text-gray-400">Encrypted Personal Vault</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#141821] border border-white/10 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#c8ef43]/15 border border-[#c8ef43]/40 flex items-center justify-center text-[#c8ef43] font-bold text-lg font-sans">
                LS
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#9ee4c3]/20 text-[#9ee4c3]">
                    Active
                  </span>
                </div>
                <div className="text-xs text-gray-400 truncate mt-0.5">{currentUser.email}</div>
                <div className="text-[11px] text-[#c8ef43] mt-1">{currentUser.role}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141821] border border-[#9ee4c3]/25 text-xs text-gray-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#9ee4c3]">
                <ShieldCheck className="w-4 h-4" />
                <span>Row-Level Security (RLS) Active</span>
              </div>
              <p className="leading-relaxed">
                Your personal diary and work planner are tied strictly to <code className="text-white">auth.uid()</code>. Even if team workspaces are added later, your diary remains completely private.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold mb-1 text-gray-300">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="luke@realdirection.co.uk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#0d1017] border border-white/15 text-white focus:outline-none focus:border-[#c8ef43]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold mb-1 text-gray-300">
                Private Passphrase
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#0d1017] border border-white/15 text-white focus:outline-none focus:border-[#c8ef43]"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Private Planner'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

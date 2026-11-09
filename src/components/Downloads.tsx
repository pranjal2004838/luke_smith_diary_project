import { useState, useEffect, useRef } from 'react';
import { Download, Mail, Lock, FileText, X, CheckCircle } from 'lucide-react';

const freeDownloads = [
  {
    id: 1,
    title: '10 Questions to Ask Before Any Big Decision',
    description: 'A practical one-page framework that will transform how you approach life\'s most important choices.',
    format: 'PDF',
    pages: '1 page',
    icon: '🎯',
  },
  {
    id: 2,
    title: 'The Weekly Reflection Template',
    description: 'Structure your weekly review with powerful prompts designed to surface insights and set purposeful intentions.',
    format: 'PDF',
    pages: '2 pages',
    icon: '📋',
  },
  {
    id: 3,
    title: 'Conversation Starter Cheat Sheet',
    description: '30 go-to questions for any social or professional situation — from networking events to date nights.',
    format: 'PDF',
    pages: '1 page',
    icon: '💬',
  },
];

const paidDownloads = [
  {
    id: 4,
    title: 'The Deep Questions Workbook',
    description: 'A 40-page interactive workbook with guided exercises, journalling prompts, and self-assessment tools.',
    format: 'PDF',
    pages: '40 pages',
    price: '£9.99',
    icon: '📓',
  },
  {
    id: 5,
    title: 'Leadership Reflection Pack',
    description: 'A complete toolkit for leaders: 90-day reflection plan, team health check, and decision-making framework.',
    format: 'PDF + XLSX',
    pages: '25 pages',
    price: '£14.99',
    icon: '🚀',
  },
  {
    id: 6,
    title: 'Speaker\'s Question Toolkit',
    description: 'Everything you need to create Q&A sessions that energise audiences and create memorable moments.',
    format: 'PDF + PPTX',
    pages: '30 pages',
    price: '£19.99',
    icon: '🎤',
  },
];

interface EmailModalProps {
  download: typeof freeDownloads[0] | null;
  onClose: () => void;
}

function EmailModal({ download, onClose }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (!download) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative bg-[#141414] border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-light text-white mb-2">You're all set!</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your download link for <strong className="text-white">"{download.title}"</strong> has been sent to <strong className="text-white">{email}</strong>.
            </p>
            <button onClick={onClose} className="mt-6 w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4">{download.icon}</div>
            <h3 className="font-heading text-2xl font-light text-white mb-2">
              Get Your Free Download
            </h3>
            <p className="text-gray-300 text-sm mb-1 font-medium">{download.title}</p>
            <p className="text-gray-400 text-xs mb-6 font-light">{download.description}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500">
                No spam, ever. Unsubscribe at any time.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-xl transition-all duration-200 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Send Me the Download
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Downloads() {
  const [selectedFree, setSelectedFree] = useState<typeof freeDownloads[0] | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {selectedFree && (
        <EmailModal download={selectedFree} onClose={() => setSelectedFree(null)} />
      )}

      <section id="downloads" className="py-24 bg-[#050505] text-white border-t border-white/5" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-medium mb-6">
              <Download className="w-3.5 h-3.5 text-gold" />
              Digital Resources
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-white mb-4">
              Downloads & Workbooks
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
              Free and premium resources to help you think deeper, lead better, and live with more intention.
            </p>
          </div>

          {/* Free downloads */}
          <div className="mb-16 reveal">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-white/10" />
              <div className="flex items-center gap-2 bg-white/5 text-gray-300 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-medium border border-white/10">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                Free — Email Gated
              </div>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freeDownloads.map((item, index) => (
                <div
                  key={item.id}
                  className="card reveal bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 group hover:border-white/25 transition-all duration-300"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex gap-2">
                      <span className="bg-white/5 text-gray-300 text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                        <FileText className="w-3 h-3" />
                        {item.format}
                      </span>
                      <span className="bg-white/5 text-gray-400 text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/5">
                        {item.pages}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-white mb-1.5 group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-light">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedFree(item)}
                    className="mt-auto flex items-center justify-center gap-2 border border-white/20 hover:border-white text-gray-200 hover:text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-300 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Get Free Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Paid downloads */}
          <div className="reveal">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-white/10" />
              <div className="flex items-center gap-2 bg-white/5 text-gray-300 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest font-medium border border-white/10">
                <Lock className="w-3.5 h-3.5 text-gold" />
                Premium Downloads
              </div>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paidDownloads.map((item, index) => (
                <div
                  key={item.id}
                  className="card reveal bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 group hover:border-white/25 transition-all duration-300"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex gap-2">
                      <span className="bg-gold/10 text-gold text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 border border-gold/20">
                        <FileText className="w-3 h-3" />
                        {item.format}
                      </span>
                      <span className="bg-white/5 text-gray-400 text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/5">
                        {item.pages}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-white mb-1.5 group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-light">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <span className="font-heading text-xl font-bold text-white">{item.price}</span>
                    <button
                      onClick={() => alert(`Redirecting to Stripe for: ${item.title}\n(Stripe integration placeholder)`)}
                      className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-4 py-2 rounded-xl transition-all duration-200 text-xs"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Buy & Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

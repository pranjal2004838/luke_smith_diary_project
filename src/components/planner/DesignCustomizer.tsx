import { useState } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Check, 
  Layers, 
  Sun
} from 'lucide-react';

export interface DashboardSettings {
  mockupMode: 'clean' | 'background';
  backgroundImageUrl: string;
  backgroundBlur: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  cardOpacity: number; // 50 to 95
  accentColor: string;
}

interface DesignCustomizerProps {
  settings: DashboardSettings;
  onUpdateSettings: (newSettings: Partial<DashboardSettings>) => void;
  onClose: () => void;
}

const presetImages = [
  {
    name: 'Atmospheric Noir Studio',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80',
    thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Nordic Mountain Mist',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Editorial Classical Library',
    url: 'https://images.unsplash.com/photo-1507842229450-782123e445f1?auto=format&fit=crop&w=2000&q=80',
    thumb: 'https://images.unsplash.com/photo-1507842229450-782123e445f1?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Minimal Concrete & Wood Architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80',
  },
];

export default function DesignCustomizer({
  settings,
  onUpdateSettings,
  onClose,
}: DesignCustomizerProps) {
  const [customUrl, setCustomUrl] = useState('');

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      onUpdateSettings({
        backgroundImageUrl: customUrl,
        mockupMode: 'background',
      });
      setCustomUrl('');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md z-50 bg-navy-dark/95 backdrop-blur-2xl border-l border-white/15 text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gold/20 text-gold">
              <Palette className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-lg">Dashboard Mockup & Themes</h3>
              <p className="text-xs text-gray-400">Section 02 Customization Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
          >
            Done
          </button>
        </div>

        {/* 1. Mode Switcher: Clean vs Background Image */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-bold text-gold mb-2.5">
            1. Select Dashboard Mockup
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onUpdateSettings({ mockupMode: 'clean' })}
              className={`p-4 rounded-2xl border text-left transition-all ${
                settings.mockupMode === 'clean'
                  ? 'border-gold bg-gold/15 ring-2 ring-gold/40'
                  : 'border-white/10 bg-black/20 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sun className="w-5 h-5 text-gold" />
                {settings.mockupMode === 'clean' && (
                  <Check className="w-4 h-4 text-gold stroke-[3]" />
                )}
              </div>
              <div className="font-bold text-sm">Mockup 1: Clean</div>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Minimal, distraction-free solid background with maximum contrast.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ mockupMode: 'background' })}
              className={`p-4 rounded-2xl border text-left transition-all ${
                settings.mockupMode === 'background'
                  ? 'border-gold bg-gold/15 ring-2 ring-gold/40'
                  : 'border-white/10 bg-black/20 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ImageIcon className="w-5 h-5 text-sky-400" />
                {settings.mockupMode === 'background' && (
                  <Check className="w-4 h-4 text-gold stroke-[3]" />
                )}
              </div>
              <div className="font-bold text-sm">Mockup 2: Visual</div>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Personalized photo backdrop with frosted glassmorphic cards.
              </p>
            </button>
          </div>
        </div>

        {/* 2. Background Image Presets (Active in background mode) */}
        {settings.mockupMode === 'background' && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gold mb-2">
                2. Choose Wallpaper Preset
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {presetImages.map((img) => {
                  const isSelected = settings.backgroundImageUrl === img.url;
                  return (
                    <div
                      key={img.name}
                      onClick={() =>
                        onUpdateSettings({
                          backgroundImageUrl: img.url,
                          mockupMode: 'background',
                        })
                      }
                      className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-gold ring-2 ring-gold/60 scale-[1.02]'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.thumb}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 p-2 flex items-end">
                        <span className="text-[10px] font-semibold text-white leading-tight">
                          {img.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Image URL Input */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                Or Paste Your Own Image URL
              </label>
              <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gold border border-white/15"
                >
                  Apply
                </button>
              </form>
              <p className="text-[11px] text-gray-400 mt-1">
                You can change and upload your own wallpapers anytime.
              </p>
            </div>

            {/* Glassmorphism Controls: Blur & Opacity */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                  <span>Card Frosted Blur:</span>
                  <span className="font-mono text-gold uppercase">{settings.backgroundBlur}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(['none', 'sm', 'md', 'xl'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => onUpdateSettings({ backgroundBlur: b })}
                      className={`py-1.5 rounded-lg font-mono text-[11px] transition-colors ${
                        settings.backgroundBlur === b
                          ? 'bg-gold text-navy font-bold'
                          : 'bg-white/5 text-gray-300 hover:bg-white/15'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                  <span>Card Surface Opacity (Legibility):</span>
                  <span className="font-mono text-gold">{settings.cardOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  step="5"
                  value={settings.cardOpacity}
                  onChange={(e) =>
                    onUpdateSettings({ cardOpacity: Number(e.target.value) })
                  }
                  className="w-full accent-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section Rearrangement Reassurance */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-gray-300 leading-relaxed">
          <div className="flex items-center gap-2 text-gold font-bold mb-1.5 uppercase tracking-wider text-[11px]">
            <Layers className="w-3.5 h-3.5" />
            <span>Non-Destructive Layouts</span>
          </div>
          Dashboard widgets (Today, Diary, Calendar, Projects) are stored in user preference state. You can rearrange, hide, or resize sections anytime without migrating databases or rebuilding code!
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider shadow-md"
        >
          Confirm & View Mockup
        </button>
      </div>
    </div>
  );
}

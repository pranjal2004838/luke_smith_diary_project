import { useState, useRef } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Check, 
  Layers, 
  Sun,
  Upload,
  Type,
  X,
  Lock,
  Download,
  Smartphone
} from 'lucide-react';

export type TextColorOption = 'ice-blue' | 'white' | 'cream' | 'mint' | 'silver';

export interface DashboardSettings {
  mockupMode: 'clean' | 'background';
  backgroundImageUrl: string;
  backgroundBlur: 'none' | 'sm' | 'md' | 'xl';
  photoVisibility: number; // 15 to 95 (higher = photo more visible)
  textColor: TextColorOption;
}

export const TEXT_COLOR_THEMES: Record<TextColorOption, { label: string; primaryHex: string; subHex: string; swatch: string }> = {
  'ice-blue': {
    label: 'Ice Blue (Default)',
    primaryHex: '#e0f2fe',
    subHex: '#93c5fd',
    swatch: '#7dd3fc',
  },
  white: {
    label: 'Crisp White',
    primaryHex: '#ffffff',
    subHex: '#cbd5e1',
    swatch: '#ffffff',
  },
  cream: {
    label: 'Warm Cream (Soft)',
    primaryHex: '#fef3c7',
    subHex: '#fde68a',
    swatch: '#fde68a',
  },
  mint: {
    label: 'Mint Mist',
    primaryHex: '#d1fae5',
    subHex: '#6ee7b7',
    swatch: '#6ee7b7',
  },
  silver: {
    label: 'Cool Silver',
    primaryHex: '#e2e8f0',
    subHex: '#94a3b8',
    swatch: '#cbd5e1',
  },
};

interface DesignCustomizerProps {
  settings: DashboardSettings;
  onUpdateSettings: (newSettings: Partial<DashboardSettings>) => void;
  onClose: () => void;
  onOpenAuth?: () => void;
  onOpenExport?: () => void;
  onShowPwaInfo?: () => void;
  initialFocus?: 'photo' | 'settings';
}

const presetImages = [
  {
    name: 'Luke Studio Portrait',
    url: '/luke-hero-hoodie.jpg',
    thumb: '/luke-hero-hoodie.jpg',
  },
  {
    name: 'Luke Monochrome',
    url: '/luke-cato-bw-hoodie.jpg',
    thumb: '/luke-cato-bw-hoodie.jpg',
  },
  {
    name: 'Deep Midnight Blue',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Nordic Calm Mist',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
  },
];

// Compress uploaded image so it fits cleanly inside browser storage on iPhone/desktop
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DesignCustomizer({
  settings,
  onUpdateSettings,
  onClose,
  onOpenAuth,
  onOpenExport,
  onShowPwaInfo,
}: DesignCustomizerProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadStatus('Optimizing photo...');
      const compressedDataUrl = await compressImageFile(file);
      onUpdateSettings({
        backgroundImageUrl: compressedDataUrl,
        mockupMode: 'background',
      });
      setUploadStatus('Personal photo updated!');
      setTimeout(() => setUploadStatus(null), 2500);
    } catch {
      setUploadStatus('Could not load image. Please try another photo.');
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onUpdateSettings({
        backgroundImageUrl: customUrl.trim(),
        mockupMode: 'background',
      });
      setCustomUrl('');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md z-50 bg-[#04101e]/95 backdrop-blur-2xl border-l border-cyan-400/25 text-sky-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-400/15">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Palette className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-sans font-bold text-lg">Appearance & Photo</h3>
              <p className="text-xs text-sky-300/75">Personalise background & text legibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200"
            aria-label="Close appearance settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Text Colour Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-cyan-300 mb-2.5">
            <Type className="w-3.5 h-3.5" />
            <span>Text Colour</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(TEXT_COLOR_THEMES) as TextColorOption[]).map((key) => {
              const theme = TEXT_COLOR_THEMES[key];
              const active = settings.textColor === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onUpdateSettings({ textColor: key })}
                  className={`px-3.5 py-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    active
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: theme.swatch }}
                    />
                    <span className="text-sm font-medium" style={{ color: theme.primaryHex }}>
                      {theme.label}
                    </span>
                  </div>
                  {active && <Check className="w-4 h-4 text-cyan-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Personal Background Photo Upload */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-cyan-300">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Personal Background Photo</span>
          </label>

          {/* Direct File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-100 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_18px_rgba(34,211,238,0.18)]"
          >
            <Upload className="w-4 h-4 text-cyan-300" />
            <span>Upload Photo from Device</span>
          </button>

          {uploadStatus && (
            <p className="text-xs text-emerald-300 text-center font-medium">{uploadStatus}</p>
          )}

          {/* Presets */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {presetImages.map((img) => {
              const isSelected = settings.backgroundImageUrl === img.url && settings.mockupMode === 'background';
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
                      ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                      : 'border-white/15 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.thumb}
                    alt={img.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex items-end">
                    <span className="text-[11px] font-semibold text-white leading-tight">
                      {img.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Photo Visibility Slider */}
          <div className="pt-2 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-sky-200 mb-1.5">
                <span>Photo Visibility Behind Dashboard</span>
                <span className="font-mono text-cyan-300 font-bold">{settings.photoVisibility}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={settings.photoVisibility}
                onChange={(e) =>
                  onUpdateSettings({
                    photoVisibility: Number(e.target.value),
                    mockupMode: 'background',
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sky-300/60 mt-0.5">
                <span>Subtle (Max Readability)</span>
                <span>Bright Photo</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-sky-200 mb-1.5">
                <span>Background Softness (Blur)</span>
                <span className="font-mono text-cyan-300 uppercase">{settings.backgroundBlur}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['none', 'sm', 'md', 'xl'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => onUpdateSettings({ backgroundBlur: b })}
                    className={`py-1.5 rounded-lg font-mono text-[11px] transition-colors ${
                      settings.backgroundBlur === b
                        ? 'bg-cyan-400 text-[#04101e] font-bold'
                        : 'bg-white/5 text-sky-200 hover:bg-white/15'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Paste URL */}
          <form onSubmit={handleApplyCustomUrl} className="flex gap-2 pt-1">
            <input
              type="url"
              placeholder="Or paste image URL..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-cyan-300 border border-white/15"
            >
              Use URL
            </button>
          </form>
        </div>

        {/* 3. Layout Mode Toggle (Clean Solid vs Photo Backdrop) */}
        <div className="pt-2 border-t border-white/10">
          <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-cyan-300 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Dashboard Backdrop Mode</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onUpdateSettings({ mockupMode: 'background' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                settings.mockupMode === 'background'
                  ? 'border-cyan-400 bg-cyan-500/15'
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <ImageIcon className="w-4 h-4 text-cyan-300" />
                {settings.mockupMode === 'background' && <Check className="w-3.5 h-3.5 text-cyan-300" />}
              </div>
              <div className="font-semibold text-xs">Photo Glass</div>
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ mockupMode: 'clean' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                settings.mockupMode === 'clean'
                  ? 'border-cyan-400 bg-cyan-500/15'
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Sun className="w-4 h-4 text-cyan-300" />
                {settings.mockupMode === 'clean' && <Check className="w-3.5 h-3.5 text-cyan-300" />}
              </div>
              <div className="font-semibold text-xs">Clean Focus</div>
            </button>
          </div>
        </div>

        {/* 4. Private Vault, Backup & Mobile Setup */}
        {(onOpenAuth || onOpenExport || onShowPwaInfo) && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-cyan-300 mb-2">
              Private Account & Data
            </label>
            <div className="grid grid-cols-1 gap-2">
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-xs font-semibold text-sky-100"
                >
                  <Lock className="w-4 h-4 text-cyan-300" />
                  <span>Private Access & Login</span>
                </button>
              )}
              {onOpenExport && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenExport();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-xs font-semibold text-sky-100"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>Export Backup (JSON / CSV)</span>
                </button>
              )}
              {onShowPwaInfo && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onShowPwaInfo();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 text-xs font-semibold text-sky-100"
                >
                  <Smartphone className="w-4 h-4 text-purple-300" />
                  <span>Add to iPhone Home Screen</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/10 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#04101e] font-bold text-xs uppercase tracking-wider shadow-lg transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

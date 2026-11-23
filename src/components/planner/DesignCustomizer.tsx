import { useState, useRef } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Check, 
  Upload,
  Type,
  X,
  Lock,
  Download,
  Smartphone,
  Watch
} from 'lucide-react';

export type TextColorOption = 'ice-blue' | 'white' | 'cream' | 'mint' | 'silver';

export interface DashboardSettings {
  mockupMode: 'clean' | 'background';
  backgroundImageUrl: string;
  backgroundBlur: 'none' | 'sm' | 'md' | 'xl';
  photoVisibility: number; // 15 to 100
  textColor: TextColorOption;
}

export const TEXT_COLOR_THEMES: Record<TextColorOption, { label: string; primaryHex: string; subHex: string; swatch: string }> = {
  white: {
    label: 'Crisp White (Default)',
    primaryHex: '#ffffff',
    subHex: '#9ca3af',
    swatch: '#ffffff',
  },
  'ice-blue': {
    label: 'Ice Blue',
    primaryHex: '#e0f2fe',
    subHex: '#93c5fd',
    swatch: '#7dd3fc',
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
    swatch: '#9ee4c3',
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
}

const presetImages = [
  {
    name: 'Luke Portrait',
    url: '/luke-cato-clear.jpg',
    thumb: '/luke-cato-clear.jpg',
  },
  {
    name: 'Luke Monochrome',
    url: '/luke-cato-bw-hoodie.jpg',
    thumb: '/luke-cato-bw-hoodie.jpg',
  },
  {
    name: 'Misty Mountains',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Nordic Calm',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
  },
];

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
  const [showWatchInfo, setShowWatchInfo] = useState(false);
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end select-none">
      <div
        className="w-full max-w-md h-full border-l border-white/15 text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right"
        style={{ backgroundColor: '#11151d' }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#c8ef43]/15 text-[#c8ef43] border border-[#c8ef43]/30">
                <Palette className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-sans font-bold text-lg text-white">Settings & Photo</h3>
                <p className="text-xs text-gray-400">Personalise photo, text colour & account</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Personal Photo Upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#c8ef43]">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Personal Photo</span>
            </label>

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
              className="w-full py-3 px-4 rounded-xl bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo from Device</span>
            </button>

            {uploadStatus && (
              <p className="text-xs text-[#9ee4c3] text-center font-medium">{uploadStatus}</p>
            )}

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
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
                        ? 'border-[#c8ef43] ring-2 ring-[#c8ef43]/50'
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
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
                <span>Photo Brightness / Visibility</span>
                <span className="font-mono text-[#c8ef43] font-bold">{settings.photoVisibility}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="100"
                step="5"
                value={settings.photoVisibility}
                onChange={(e) =>
                  onUpdateSettings({
                    photoVisibility: Number(e.target.value),
                  })
                }
                className="w-full accent-[#c8ef43] cursor-pointer"
              />
            </div>

            {/* Optional Paste URL */}
            <form onSubmit={handleApplyCustomUrl} className="flex gap-2 pt-1">
              <input
                type="url"
                placeholder="Or paste image URL..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c8ef43]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-[#1a202c] hover:bg-[#222a38] text-xs font-semibold text-[#c8ef43] border border-white/15"
              >
                Use URL
              </button>
            </form>
          </div>

          {/* 2. Text Colour Selector */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#c8ef43] mb-2.5">
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
                        ? 'border-[#c8ef43] bg-[#c8ef43]/15'
                        : 'border-white/10 bg-[#141821] hover:border-white/25'
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
                    {active && <Check className="w-4 h-4 text-[#c8ef43]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Private Account, Backup & Mobile Setup */}
          {(onOpenAuth || onOpenExport || onShowPwaInfo) && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#c8ef43] mb-2">
                Account & Data
              </label>
              <div className="grid grid-cols-1 gap-2">
                {onOpenAuth && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-white/10 flex items-center gap-2.5 text-xs font-semibold text-gray-200"
                  >
                    <Lock className="w-4 h-4 text-[#c8ef43]" />
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-white/10 flex items-center gap-2.5 text-xs font-semibold text-gray-200"
                  >
                    <Download className="w-4 h-4 text-[#9ee4c3]" />
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-white/10 flex items-center gap-2.5 text-xs font-semibold text-gray-200"
                  >
                    <Smartphone className="w-4 h-4 text-[#63d8d8]" />
                    <span>Add to iPhone Home Screen</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowWatchInfo(!showWatchInfo)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-white/10 flex items-center justify-between text-xs font-semibold text-gray-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Watch className="w-4 h-4 text-[#c8ef43]" />
                    <span>Apple Watch & Wearable Sync</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{showWatchInfo ? 'Hide' : 'View'}</span>
                </button>

                {showWatchInfo && (
                  <div className="p-3.5 rounded-xl bg-[#0d1017] border border-white/10 text-xs text-gray-300 space-y-2">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#c8ef43]" />
                      <span>Supported with current app:</span>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-3.5 leading-relaxed">
                      All task reminders & calendar alerts mirror automatically to your Apple Watch / WearOS when paired with your phone. You can glance at next tasks and dismiss/complete notifications directly on your wrist.
                    </p>
                    <div className="font-semibold text-white flex items-center gap-1.5 pt-1">
                      <span className="w-2 h-2 rounded-full bg-[#63d8d8]" />
                      <span>Future native Watch app:</span>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-3.5 leading-relaxed">
                      Stand-alone wrist voice dictation (recording without your phone nearby) and permanent watch face complications require building a dedicated Apple WatchKit / WearOS companion app.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#c8ef43] hover:bg-[#d7f861] text-[#0b0f14] font-bold text-xs uppercase tracking-wider shadow-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

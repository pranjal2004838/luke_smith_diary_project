import { ExternalLink } from 'lucide-react';

export default function MediaBanner() {
  return (
    <section id="media" className="bg-[#060606] py-16 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        
        {/* Section Heading */}
        <p className="text-neon font-mono font-bold text-xs uppercase tracking-widest mb-3">
          National & Regional Coverage
        </p>
        
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-10 tracking-tight">
          Our work and our story have been featured by national and local media
        </h3>

        {/* Black & White Authentic Media Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-center">
          
          {/* 1. ITV Logo */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <svg viewBox="0 0 120 45" className="h-7 w-auto fill-current text-white/80 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 8h7v28h-7zM24 15h7v21h-7zm0-7h7v4h-7zm12 7h6v3h-6v11c0 2 1 3 3 3h3v4h-5c-5 0-8-3-8-8V15zm14 0h7l4 15 4-15h7l-7 21h-8zM80 8c10 0 17 7 17 17s-7 17-17 17-17-7-17-17 7-17 17-17zm0 7c-6 0-10 4-10 10s4 10 10 10 10-4 10-10-4-10-10-10z" />
              <text x="5" y="32" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="32" letterSpacing="-1">itv</text>
            </svg>
          </div>

          {/* 2. BBC 1Xtra */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-xs">B</span>
                <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-xs">B</span>
                <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-xs">C</span>
              </div>
              <span className="text-white font-black text-sm tracking-tight group-hover:text-neon transition-colors">1Xtra</span>
            </div>
          </div>

          {/* 3. BBC Midlands Today */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5 mb-1">
                <span className="bg-white text-black text-[8px] font-black px-1 py-0.5">B</span>
                <span className="bg-white text-black text-[8px] font-black px-1 py-0.5">B</span>
                <span className="bg-white text-black text-[8px] font-black px-1 py-0.5">C</span>
              </div>
              <span className="text-white text-[11px] font-bold uppercase tracking-tighter leading-tight group-hover:text-neon transition-colors">Midlands</span>
              <span className="text-gray-400 text-[10px] font-medium tracking-tight">Today</span>
            </div>
          </div>

          {/* 4. Capital FM */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <span className="text-white font-black italic text-base tracking-tighter group-hover:text-neon transition-colors font-sans">
              CAPITAL
            </span>
          </div>

          {/* 5. Express & Star */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <div className="text-center">
              <span className="text-white font-serif font-bold text-xs tracking-tight block leading-tight group-hover:text-neon transition-colors">
                Express & Star
              </span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Newspaper</span>
            </div>
          </div>

          {/* 6. Talk TV */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <div className="flex items-center gap-1">
              <span className="text-white font-black text-sm tracking-wider group-hover:text-neon transition-colors">TALK</span>
              <span className="bg-white text-black font-black text-[10px] px-1 py-0.5 rounded">TV</span>
            </div>
          </div>

          {/* 7. Heart FM */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <span className="text-white font-bold text-lg lowercase tracking-tight group-hover:text-neon transition-colors">
              heart
            </span>
          </div>

          {/* 8. BBC Radio WM */}
          <div className="flex items-center justify-center h-20 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-neon/40 hover:bg-white/[0.06] transition-all group">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5 mb-1">
                <span className="bg-white text-black text-[8px] font-black px-1 py-0.5">B</span>
                <span className="bg-white text-black text-[8px] font-black px-1 py-0.5">B</span>
                <span className="bg-white text-black text-[8px] font-black px-1 py-0.5">C</span>
              </div>
              <span className="text-white text-[11px] font-bold tracking-tight group-hover:text-neon transition-colors">RADIO WM</span>
            </div>
          </div>

        </div>

        {/* Prominent Real Direction Link */}
        <div className="mt-12">
          <a
            href="https://www.realdirection.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-neon hover:bg-neon-hover text-black font-bold text-sm md:text-base px-8 py-4 rounded-full transition-all shadow-xl shadow-neon/20 hover:scale-105"
          >
            <span>Explore Real Direction Media & Interactive Films</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

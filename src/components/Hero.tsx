import { ExternalLink, ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] bg-black text-white flex items-center pt-32 pb-24 overflow-hidden">
      {/* Subtle neon ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-neon/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typography & Bio */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Signature Logo */}
            <div className="mb-6">
              <img
                src="/luke-cato-logo-transparent.png"
                alt="Luke Cato"
                className="h-14 md:h-20 w-auto object-contain"
              />
            </div>

            {/* Tagline / Category */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-neon animate-pulse" />
              <p className="text-neon text-xs md:text-sm uppercase tracking-widest font-mono font-bold">
                Social Entrepreneur • Author • Founder of Real Direction Ltd
              </p>
            </div>

            {/* Heading / Lead Opening Statement */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] tracking-tight mb-6">
              Find the words for <span className="text-neon">difficult conversations</span>
            </h1>

            {/* Exact Opening Text Provided by Luke Cato */}
            <div className="space-y-4 text-gray-200 text-base md:text-lg leading-relaxed font-normal max-w-2xl">
              <p>
                Books with <strong className="text-white font-semibold">reflection points</strong> and <strong className="text-neon font-semibold">cue cards</strong> that help parents, carers and communities talk with young people about the pressures, choices and situations that could put them at risk.
              </p>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Rooted in lived experience, each resource gives you a way to start the conversation, questions to keep it going and space for young people to share what they think. Together, you can explore what they might do in a difficult situation, who they could turn to and how to ask for help.
              </p>

              <div className="bg-white/[0.04] border-l-4 border-neon rounded-r-xl p-4 my-2">
                <p className="text-neon font-semibold text-base md:text-lg">
                  Luke’s work has reached 68,000 young people across the UK.
                </p>
              </div>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Created by Real Direction founder <strong className="text-white font-semibold">Luke Cato</strong>, these resources draw on his lived experience and his work with young people. They help adults feel more confident bringing up difficult topics and give young people room to speak openly and feel heard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 mt-10">
              <button
                onClick={() => scrollTo('#books')}
                className="bg-neon hover:bg-neon-hover text-black font-bold px-8 py-4 rounded-full transition-all duration-300 text-sm md:text-base tracking-wide shadow-xl shadow-neon/20 hover:scale-105 flex items-center gap-2"
              >
                <span>Explore Books & Cue Cards</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://www.realdirection.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/30 hover:border-neon text-white hover:text-neon font-bold px-8 py-4 rounded-full transition-all duration-200 text-sm md:text-base flex items-center gap-2 hover:bg-white/5"
              >
                <span>Explore Real Direction</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Studio Portrait Photo (Crisp, High Quality, No Obscuring Overlays) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] md:max-w-[440px]">
              {/* Subtle neon backlight frame */}
              <div className="absolute -inset-1 bg-gradient-to-b from-neon/30 to-transparent rounded-3xl blur-md opacity-60" />
              
              {/* Outer clean border container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-[#0c0c0c] p-2">
                <img
                  src="/luke-hero-hoodie.jpg"
                  alt="Luke Cato - Award Winning Entrepreneur & Author"
                  className="w-full h-auto object-cover rounded-2xl shadow-inner"
                />
              </div>

              {/* Clean caption */}
              <div className="text-center mt-4">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                  Luke Cato • Founder of Real Direction Ltd
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

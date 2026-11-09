import { useState, useEffect } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Signature Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center group"
        >
          <img
            src="/luke-cato-logo-transparent.png"
            alt="Luke Cato"
            className="h-10 md:h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
          />
        </a>

        {/* Minimal Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('#books')}
            className="text-gray-300 hover:text-neon text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Books
          </button>
          <button
            onClick={() => handleNavClick('#cards')}
            className="text-gray-300 hover:text-neon text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Cue Cards
          </button>
          <button
            onClick={() => handleNavClick('#awards')}
            className="text-gray-300 hover:text-neon text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Awards
          </button>
          <button
            onClick={() => handleNavClick('#media')}
            className="text-gray-300 hover:text-neon text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Media
          </button>

          {/* Prominent Real Direction Link */}
          <a
            href="https://www.realdirection.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neon hover:bg-neon-hover text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-lg shadow-neon/20 hover:scale-105 flex items-center gap-1.5"
          >
            <span>Explore Real Direction</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          className="md:hidden text-white hover:text-neon p-2 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-black/98 border-b border-white/10 px-6 py-6 space-y-4">
          <button
            onClick={() => handleNavClick('#books')}
            className="block w-full text-left text-gray-200 hover:text-neon text-sm uppercase tracking-wider py-2 font-medium"
          >
            Books
          </button>
          <button
            onClick={() => handleNavClick('#cards')}
            className="block w-full text-left text-gray-200 hover:text-neon text-sm uppercase tracking-wider py-2 font-medium"
          >
            Cue Cards
          </button>
          <button
            onClick={() => handleNavClick('#awards')}
            className="block w-full text-left text-gray-200 hover:text-neon text-sm uppercase tracking-wider py-2 font-medium"
          >
            Awards
          </button>
          <button
            onClick={() => handleNavClick('#media')}
            className="block w-full text-left text-gray-200 hover:text-neon text-sm uppercase tracking-wider py-2 font-medium"
          >
            Media
          </button>
          <a
            href="https://www.realdirection.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-neon text-black font-bold text-xs uppercase tracking-wider py-3 rounded-full mt-4"
          >
            Explore Real Direction →
          </a>
        </div>
      )}
    </nav>
  );
}

import { Linkedin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black border-t border-white/10 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5 mb-5">
              <img
                src="/luke-cato-logo-transparent.png"
                alt="Luke Cato"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md font-light">
              Award winning entrepreneur, author and founder of <strong className="text-white font-semibold">Real Direction Ltd</strong>. Luke’s work has reached 68,000 young people across the UK, creating interactive educational films, fiction and cue cards that inspire informed choices.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon hover:text-black border border-white/10 flex items-center justify-center text-gray-300 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:Luke.cato@realdirection.co.uk"
                aria-label="Email Luke Cato"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-neon hover:text-black border border-white/10 flex items-center justify-center text-gray-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.realdirection.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-gray-400 hover:text-neon flex items-center gap-1.5 transition-colors pl-2 font-mono"
              >
                realdirection.co.uk <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick navigation to active remaining sections */}
          <div className="md:col-span-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollTo('#books')}
                  className="text-gray-400 hover:text-neon text-xs uppercase tracking-wider transition-colors"
                >
                  Books Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('#cards')}
                  className="text-gray-400 hover:text-neon text-xs uppercase tracking-wider transition-colors"
                >
                  Cue Card Decks
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('#awards')}
                  className="text-gray-400 hover:text-neon text-xs uppercase tracking-wider transition-colors"
                >
                  Awards & Recognition
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('#media')}
                  className="text-gray-400 hover:text-neon text-xs uppercase tracking-wider transition-colors"
                >
                  Media Features
                </button>
              </li>
              <li>
                <a
                  href="https://www.realdirection.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                >
                  Real Direction Ltd <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Amazon Store link */}
          <div className="md:col-span-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-widest mb-4">
              Amazon Collection
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-4 font-light">
              All 16 published books are available on Amazon Kindle and Paperback formats.
            </p>
            <a
              href="https://www.amazon.co.uk/s?k=luke+cato&i=digital-text"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-neon hover:bg-neon-hover text-black font-bold text-xs px-5 py-3 rounded-full transition-all shadow-lg shadow-neon/10 hover:scale-105"
            >
              <span>Luke Cato on Amazon UK</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs font-mono">
            © {new Date().getFullYear()} Luke Cato. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-400 text-xs font-mono">
            <span>Social Entrepreneur & Author</span>
            <span>•</span>
            <span>Real Direction Ltd</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

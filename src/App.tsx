import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Awards from './components/Awards';
import Books from './components/Books';
import Cards from './components/Cards';
import MediaBanner from './components/MediaBanner';
import Footer from './components/Footer';
import PlannerApp from './components/planner/PlannerApp';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';

function App() {
  const [view, setView] = useState<'website' | 'planner'>('planner'); // Default to planner to showcase Luke's requested project!

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#website') {
        setView('website');
      } else if (window.location.hash === '#planner') {
        setView('planner');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const switchToPlanner = () => {
    setView('planner');
    window.location.hash = '#planner';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToWebsite = () => {
    setView('website');
    window.location.hash = '#website';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'planner') {
    return <PlannerApp onBackToWebsite={switchToWebsite} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-neon selection:text-black relative">
      {/* Client Preview Notification Banner */}
      <div className="bg-gradient-to-r from-navy-dark via-navy to-navy-dark border-b border-gold/30 px-4 py-2.5 text-center text-xs text-gray-200 sticky top-0 z-50 flex items-center justify-center gap-3 shadow-lg">
        <span className="flex items-center gap-1.5 font-semibold text-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fiverr Custom Project for Luke:</span>
        </span>
        <span className="hidden sm:inline">
          Personal Diary & Work Planner prototype with Clean & Visual Mockups is ready!
        </span>
        <button
          onClick={switchToPlanner}
          className="px-3 py-1 rounded-full bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all hover:scale-105"
        >
          <span>Open Planner App</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <Nav />
      <main>
        <Hero />
        <Awards />
        <Books />
        <Cards />
        <MediaBanner />
      </main>
      <Footer />

      {/* Floating Action Button for easy jumping */}
      <button
        onClick={switchToPlanner}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-gold hover:bg-gold-dark text-navy font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 border-2 border-navy hover:scale-105 transition-all"
      >
        <Lock className="w-4 h-4" />
        <span>View Diary & Planner App</span>
      </button>
    </div>
  );
}

export default App;

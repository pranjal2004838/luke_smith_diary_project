import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Awards from './components/Awards';
import Books from './components/Books';
import Cards from './components/Cards';
import MediaBanner from './components/MediaBanner';
import Footer from './components/Footer';
import PlannerApp from './components/planner/PlannerApp';

function App() {
  const [view, setView] = useState<'website' | 'planner'>('planner');

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();

      // If URL specifically asks for books/author website
      if (
        hash.includes('#books-site') ||
        hash.includes('#author') ||
        hash.includes('#preview') ||
        path.includes('/books') ||
        search.includes('view=books')
      ) {
        setView('website');
      } else {
        // Default: Pure Standalone Personal Diary & Planner
        setView('planner');
      }
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  // 1. Standalone Personal Diary & Work Planner
  if (view === 'planner') {
    return <PlannerApp />;
  }

  // 2. Standalone Public Author & Books Website (Zero editor chrome, clean preview for Luke to forward)
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-neon selection:text-black">
      <Nav />
      <main>
        <Hero />
        <Awards />
        <Books />
        <Cards />
        <MediaBanner />
      </main>
      <Footer />
    </div>
  );
}

export default App;

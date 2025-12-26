import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WorkflowEngine from './components/WorkflowEngine';
import Manifesto from './components/Manifesto';
import Login from './components/Login';
import InfiniteCanvas from './components/InfiniteCanvas';
import CalibrationLoader from './components/CalibrationLoader';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'LANDING' | 'LOGIN'>('LANDING');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Reveal main app after loader
    if (!loading) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [loading]);

  const handleConnect = () => {
    setView('LOGIN');
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('LANDING');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleBackToLanding = () => {
    setView('LANDING');
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <CalibrationLoader onComplete={() => setLoading(false)} />;
  }

  if (view === 'LOGIN') {
    return (
      <Login 
        onLogin={handleLoginSuccess} 
        onBack={handleBackToLanding} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-swiss-black font-sans selection:bg-swiss-orange selection:text-white">
      <Header 
        onConnect={handleConnect} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
      <main>
        {/* Act I: The Manual (Typography & Metadata) */}
        <Hero />
        
        {/* Act II: The Engine (The Canvas Animation - Restored) */}
        <WorkflowEngine />
        
        {/* Act III: The Field (Infinite Canvas Exploration) */}
        <InfiniteCanvas />
        
        {/* Act IV: The Word (Manifesto) */}
        <div className="relative z-20 bg-white">
            <Manifesto />
        </div>
        
        {/* Footer */}
        <footer className="w-full py-24 border-t border-neutral-200 bg-white flex flex-col items-center justify-center gap-8">
           <div className="w-4 h-4 bg-black"></div>
           <div className="flex gap-12">
              {['Documentation', 'Hardware', 'Protocols', 'Legal'].map(item => (
                <a key={item} href="#" className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest hover:text-black transition-colors">
                  {item}
                </a>
              ))}
           </div>
           <p className="text-neutral-300 font-mono text-[9px] uppercase tracking-[0.3em]">
              System 01 &copy; 2024 — Studio+233 Industrial
           </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
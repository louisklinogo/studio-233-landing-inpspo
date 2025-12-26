
import React, { useState, useEffect } from 'react';

// Define the interface for the Header component props to fix the type error in App.tsx
interface HeaderProps {
  onConnect: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onConnect, isAuthenticated, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-start justify-between z-[100] px-8 pt-8 pointer-events-none font-sans">
      {/* Top Left: Meta */}
      <div className="flex flex-col pointer-events-auto">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-1.5 bg-white"></div>
          <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-white">Manual_V1.0</span>
        </div>
        <span className="text-[9px] font-mono text-white/40 tabular-nums uppercase tracking-widest pl-4">
          {time.toLocaleTimeString('en-GB', { hour12: false })} UTC_REF
        </span>
      </div>

      {/* Top Right: Action - Conditional rendering based on authentication status */}
      <div className="flex items-center gap-8 pointer-events-auto">
        {isAuthenticated ? (
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 group"
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Active Session</span>
            <div className="w-8 h-8 flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-sm group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
              <span className="text-[10px] font-mono uppercase">Exit</span>
            </div>
          </button>
        ) : (
          <button 
            onClick={onConnect}
            className="flex items-center gap-4 group"
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Restricted Access</span>
            <div className="w-8 h-8 flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-sm group-hover:border-white group-hover:bg-white group-hover:text-black transition-all px-6">
              <span className="text-[10px] font-mono uppercase">Login</span>
            </div>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

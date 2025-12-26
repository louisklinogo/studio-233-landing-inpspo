import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Wifi } from 'lucide-react';

interface HeaderProps {
  onConnect?: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onConnect, isAuthenticated, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-neutral-100 flex items-center bg-white/80 backdrop-blur-xl z-50 px-8">
      {/* Left: Branding & Clock */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-black"></div>
          <span className="text-sm font-bold tracking-tight uppercase">System 01</span>
        </div>
        <div className="h-4 w-[1px] bg-neutral-200"></div>
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">UTC_Reference</span>
          <span className="text-[10px] font-mono tabular-nums font-medium">
            {time.toLocaleTimeString('en-GB', { hour12: false })}
          </span>
        </div>
      </div>

      {/* Center: The Void (Swiss Design Essential) */}
      <div className="flex-1"></div>

      {/* Right: Instrument Cluster */}
      <div className="flex items-center gap-10">
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-neutral-400 tracking-widest uppercase">Latency</span>
            <div className="flex items-center gap-1">
              <Activity size={10} className="text-emerald-500" />
              <span className="text-[10px] font-mono tabular-nums">12ms</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-neutral-400 tracking-widest uppercase">VRAM_LOAD</span>
            <div className="flex items-center gap-1">
              <Cpu size={10} className="text-swiss-orange" />
              <span className="text-[10px] font-mono tabular-nums">4.2GB</span>
            </div>
          </div>
        </div>

        {/* Precision Toggle */}
        <button 
          onClick={isAuthenticated ? onLogout : onConnect}
          className="flex items-center bg-neutral-50 border border-neutral-200 rounded-full p-1 group hover:border-black transition-colors"
        >
          <div className={`
            px-3 py-1 text-[9px] font-bold tracking-widest rounded-full transition-all duration-300
            ${!isAuthenticated ? 'bg-black text-white shadow-sm' : 'text-neutral-400'}
          `}>OFF</div>
          <div className={`
            px-3 py-1 text-[9px] font-bold tracking-widest rounded-full transition-all duration-300
            ${isAuthenticated ? 'bg-emerald-500 text-white shadow-sm' : 'text-neutral-400'}
          `}>ON</div>
        </button>
      </div>
    </header>
  );
};

export default Header;
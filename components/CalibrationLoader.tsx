import React, { useEffect, useState } from 'react';

const CalibrationLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState('INITIALIZING_CORE...');

  useEffect(() => {
    const logs = [
      'BOOTSTRAPPING_NEURAL_GRID...',
      'CALIBRATING_OPTICS...',
      'LOAD_ASSET_CACHE: 12.4ms',
      'ESTABLISHING_SUBSTRATE...',
      'SYSTEM_READY'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        
        if (prev % 20 === 0) {
          setLog(logs[currentLogIndex % logs.length]);
          currentLogIndex++;
        }
        
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden">
      {/* Laser Scan Line */}
      <div 
        className="absolute w-full h-[1px] bg-swiss-orange/30 top-0 left-0 animate-[scan_2s_ease-in-out_infinite]"
        style={{ animation: 'scan 2s ease-in-out infinite' }}
      ></div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <div className="relative flex flex-col items-center">
        {/* Central Monolith Dot */}
        <div className="w-1.5 h-1.5 bg-black mb-12"></div>
        
        {/* Horizon Line */}
        <div className="w-64 h-[1px] bg-neutral-100 relative mb-8">
          <div 
            className="absolute top-0 left-0 h-full bg-black transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Technical Data */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-400 uppercase">
            {log}
          </span>
          <span className="text-[14px] font-mono tracking-tighter tabular-nums font-bold">
            {progress.toString().padStart(3, '0')}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalibrationLoader;
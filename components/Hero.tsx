import React, { useEffect, useRef } from 'react';
import WorkflowCanvas from './WorkflowCanvas';

const Hero: React.FC = () => {
  const monolithRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!monolithRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;
      
      monolithRef.current.style.transform = `rotateY(${xPos}deg) rotateX(${-yPos}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-full h-[120vh] bg-white flex flex-col items-center pt-32 px-8 overflow-hidden">
      {/* Background Decal */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <span className="absolute -bottom-20 -right-20 text-[35vw] font-bold text-neutral-50 leading-none tracking-tighter opacity-100">
          01
        </span>
      </div>

      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Headline Column */}
        <div className="lg:col-span-5 flex flex-col pt-24">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 bg-swiss-orange rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-400 uppercase">Live_Substrate_01</span>
          </div>
          <h1 className="text-7xl lg:text-[120px] font-bold tracking-tighter leading-[0.85] text-black mb-12">
            SYSTEM<br/>
            OF LOGIC.
          </h1>
          <p className="max-w-md text-xl text-neutral-400 leading-relaxed font-light">
            An industrial framework for bulk-processing creative intelligence. High signal. Zero noise. Pure performance.
          </p>
          
          <div className="mt-20 flex gap-12">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest mb-2">Throughput</span>
              <span className="text-3xl font-bold tracking-tighter">1.2k / s</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest mb-2">Reliability</span>
              <span className="text-3xl font-bold tracking-tighter">99.98%</span>
            </div>
          </div>
        </div>

        {/* The Monolith Studio Column */}
        <div className="lg:col-span-7 h-[700px] flex items-center justify-center perspective-container">
          <div 
            ref={monolithRef}
            className="w-full h-[600px] bg-white border border-neutral-100 shadow-[0_100px_80px_rgba(0,0,0,0.03)] rounded-sm overflow-hidden transition-transform duration-200 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="w-full h-full relative" style={{ transform: 'translateZ(20px)' }}>
              <div className="absolute inset-0 bg-neutral-50/50"></div>
              <WorkflowCanvas />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Instruction */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
         <span className="text-[9px] font-mono text-neutral-400 tracking-[0.4em] uppercase">Scroll to Expand Viewport</span>
         <div className="w-[1px] h-12 bg-neutral-200"></div>
      </div>
    </section>
  );
};

export default Hero;
import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-swiss-black text-white flex flex-col justify-between p-8 lg:p-12 overflow-hidden select-none font-sans">
      
      {/* Background Subtle Coordinates */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-1 pointer-events-none opacity-40">
        <span className="text-[9px] font-mono tracking-widest">[X].{Math.round(mousePos.x).toString().padStart(3, '0')}PX</span>
        <span className="text-[9px] font-mono tracking-widest">[Y].{Math.round(mousePos.y).toString().padStart(3, '0')}PX</span>
      </div>

      {/* Main Headline Block */}
      <div className="mt-24 lg:mt-32">
        <h1 className="text-[12vw] font-bold tracking-tighter leading-[0.82] flex flex-col">
          <span className="flex items-center gap-[0.02em]">
            The <span className="text-neutral-600">©</span>reative
          </span>
          <span className="flex items-center">
            System Manual<span className="text-[4vw] font-medium align-top mt-[1.2vw] ml-[0.5vw]">™</span>
          </span>
        </h1>
      </div>

      {/* Bottom Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20 items-end">
        
        {/* Identifier Barcode */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-[0.5em] mb-2">Project_By</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Studio+233 / Industrial_Ref</span>
          </div>
          <div className="flex items-end h-20 gap-[2px] opacity-80">
            {[...Array(32)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white transition-all duration-300"
                style={{ 
                  width: i % 4 === 0 ? '3px' : i % 7 === 0 ? '1px' : '2px',
                  height: `${30 + (Math.sin(i + mousePos.x * 0.05) * 50 + 50)}%`,
                  opacity: 0.2 + (i / 32) * 0.8
                }}
              />
            ))}
          </div>
        </div>

        {/* Abstract */}
        <div className="lg:col-span-4 lg:pl-12 border-l border-white/5">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 bg-swiss-orange"></div>
             <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Core_Logic_V1</span>
          </div>
          <p className="text-sm lg:text-base text-neutral-400 leading-relaxed max-w-sm font-normal">
            A comprehensive industrial framework for the calibration and deployment of stand-out digital substrates. Recursive performance logic as standard.
          </p>
        </div>

        {/* Stack & Chapters */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 lg:pt-0 lg:border-t-0">
          <div className="space-y-4">
             <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-[0.4em] block">Active_Ingredients</span>
             <div className="space-y-1.5">
                <span className="text-[10px] font-mono block text-white/80 tracking-wider">GEMINI_3_PRO</span>
                <span className="text-[10px] font-mono block text-white/80 tracking-wider">GSAP_3.12</span>
                <span className="text-[10px] font-mono block text-white/80 tracking-wider">VEO_3.1_GEN</span>
             </div>
          </div>
          <div className="space-y-4">
             <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-[0.4em] block">Chapters</span>
             <div className="space-y-1.5">
                <span className="text-[10px] font-mono block text-white/80 tracking-wider">01_ABOUT_CORE</span>
                <span className="text-[10px] font-mono block text-white/80 tracking-wider">02_NEURAL_FLOW</span>
                <span className="text-[10px] font-mono block text-white/80 tracking-wider">03_MANIFESTO</span>
             </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
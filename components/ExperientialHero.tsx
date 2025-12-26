import React, { useEffect, useRef } from 'react';
import { ArrowRight, Terminal, Box, Layers, Cpu } from 'lucide-react';

declare const gsap: any;
declare const ScrollTrigger: any;

const ExperientialHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const factoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
      }
    });

    // 1. Initial State: The Spark
    tl.fromTo(mainTitleRef.current, 
      { opacity: 0, y: 50, filter: 'blur(10px)' }, 
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }
    );

    // 2. Zoom into the grid
    tl.to(gridRef.current, {
      scale: 4,
      opacity: 0.1,
      duration: 2,
      ease: "power2.inOut"
    }, "<");

    // 3. Shift to "Workflow" logic
    tl.to(mainTitleRef.current, {
        opacity: 0,
        y: -100,
        duration: 1
    });

    tl.fromTo(subTitleRef.current,
        { opacity: 0, scale: 0.9, y: 100 },
        { opacity: 1, scale: 1, y: 0, duration: 1 },
        "-=0.5"
    );

    // 4. Proliferation: The "Factory" Effect
    // Scale out to reveal thousands of tiny processed nodes
    tl.to(subTitleRef.current, {
        opacity: 0,
        scale: 1.5,
        duration: 1
    });

    tl.fromTo(factoryRef.current,
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, duration: 2, ease: "expo.out" },
        "-=0.5"
    );

    return () => {
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-white overflow-hidden font-sans">
      
      {/* Background Interactive Grid */}
      <svg 
        ref={gridRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="master-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#000" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#master-grid)" />
      </svg>

      {/* Act I Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <h1 ref={mainTitleRef} className="text-7xl lg:text-[10rem] font-bold tracking-tighter leading-none text-swiss-black">
          STUDIO<span className="text-swiss-orange">+</span>233
        </h1>
      </div>

      {/* Act II Content: The Logic */}
      <div ref={subTitleRef} className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0">
        <div className="max-w-2xl text-center space-y-8">
            <div className="flex justify-center gap-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Terminal size={32} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Input_Node</span>
                </div>
                <div className="w-24 h-px bg-neutral-200 self-center border-t border-dashed border-neutral-400"></div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border border-swiss-orange flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_#FF4400]">
                        <Cpu size={32} className="text-swiss-orange" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-swiss-orange">Neural_Processor</span>
                </div>
            </div>
            <h2 className="text-4xl font-medium tracking-tight">The Neural Substrate.</h2>
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-wider leading-relaxed">
                Connect intent to execution.<br/>
                Industrial-grade workflows for human creators.
            </p>
        </div>
      </div>

      {/* Act III Content: The Proliferation */}
      <div ref={factoryRef} className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 pointer-events-none">
          <div className="grid grid-cols-10 lg:grid-cols-20 gap-2 opacity-10">
              {Array.from({ length: 200 }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 border border-black transition-colors duration-500 ${i % 7 === 0 ? 'bg-swiss-orange border-swiss-orange' : 'bg-transparent'}`}></div>
              ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="bg-white p-12 border border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-xl text-center">
                <span className="inline-block px-3 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-widest mb-6">Mass Production Active</span>
                <h3 className="text-5xl font-bold tracking-tighter mb-4">Batch Everything.</h3>
                <p className="text-neutral-500 mb-8">Scale your creative vision from one-off artifacts to industrial pipelines. 1,000 assets, one workflow.</p>
                <button className="bg-swiss-orange text-white px-8 py-4 text-xs font-bold tracking-widest uppercase flex items-center gap-4 hover:bg-black transition-colors pointer-events-auto">
                    Initialize System <ArrowRight size={16} />
                </button>
             </div>
          </div>
      </div>

      {/* Persistent Status Bar (The Pako Detail) */}
      <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-neutral-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between z-50">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-swiss-orange animate-pulse"></div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Sys_Status: Optimal</span>
              </div>
              <div className="hidden md:block h-3 w-px bg-neutral-200"></div>
              <div className="hidden md:flex gap-4">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Lat: 0.04ms</span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Mem: 1.2gb/8.0gb</span>
              </div>
          </div>
          <div className="flex items-center gap-4">
               <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Scroll_Progress</span>
               <div className="w-32 h-1 bg-neutral-100 relative">
                  <div id="scroll-progress-bar" className="absolute left-0 top-0 h-full bg-black transition-all duration-100"></div>
               </div>
          </div>
      </div>
    </div>
  );
};

export default ExperientialHero;
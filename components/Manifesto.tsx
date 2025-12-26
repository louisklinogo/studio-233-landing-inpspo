import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

declare const gsap: any;
declare const ScrollTrigger: any;

interface HoverBlockProps {
  word: string;
  imageUrl?: string;
  index?: string;
}

const HoverBlock: React.FC<HoverBlockProps> = ({ word, imageUrl, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isInteractive = !!imageUrl;

  return (
    <div
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => isInteractive && setIsHovered(false)}
      className={`
        relative overflow-hidden px-4 py-2 sm:px-8 sm:py-4 bg-[#1a1a1a] border transition-all duration-500
        ${isInteractive ? 'cursor-none' : 'cursor-default'}
        ${isHovered ? 'border-swiss-orange shadow-[0_0_30px_rgba(255,68,0,0.1)]' : 'border-neutral-800'}
      `}
    >
      {/* Content Shutter */}
      <div className="reveal-content translate-y-full opacity-0">
        <span className={`
          text-2xl md:text-5xl lg:text-7xl font-bold tracking-tighter uppercase leading-none
          ${isInteractive && isHovered ? 'text-white' : isInteractive ? 'text-neutral-300' : 'text-neutral-500'}
        `}>
          {word}
        </span>
      </div>

      {/* Technical Marker for Interactive Blocks */}
      {isInteractive && (
        <div className={`absolute top-1 right-1 w-1.5 h-1.5 transition-colors duration-300 ${isHovered ? 'bg-swiss-orange' : 'bg-neutral-700'}`} />
      )}

      {/* Hover Image Reveal */}
      {imageUrl && (
        <div 
          className={`absolute inset-0 z-10 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={imageUrl} 
            className={`w-full h-full object-cover grayscale transition-transform duration-1000 ${isHovered ? 'scale-100' : 'scale-125'}`}
            alt=""
          />
          <div className="absolute inset-0 bg-swiss-black/40" />
          <div className="absolute bottom-2 left-2 text-[8px] font-mono text-white bg-swiss-orange px-1 uppercase">
            REF_{index}
          </div>
        </div>
      )}
    </div>
  );
};

const Manifesto: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const blocks = containerRef.current?.querySelectorAll('.reveal-content');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self: any) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.height = `${self.progress * 100}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.innerText = `${Math.round(self.progress * 100).toString().padStart(3, '0')}`;
          }
        }
      }
    });

    if (blocks) {
      tl.to(blocks, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
        duration: 1
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  const sentence1 = [
    { w: "We" }, { w: "believe" }, { w: "in" }, { w: "the" }, 
    { w: "purity", img: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=600", idx: "01" },
    { w: "of" },
    { w: "logic.", img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600", idx: "02" }
  ];

  const sentence2 = [
    { w: "Eliminating" }, { w: "the" },
    { w: "noise", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600", idx: "03" },
    { w: "to" }, { w: "reveal" }, { w: "the" },
    { w: "signal", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", idx: "04" },
    { w: "within" }, { w: "the" },
    { w: "machine.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600", idx: "05" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full h-screen bg-swiss-black flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      {/* Precision Scroll Indicator */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 h-64 w-[2px] bg-neutral-900 hidden md:block">
        <div ref={progressBarRef} className="absolute top-0 left-0 w-full bg-swiss-orange transition-all duration-100" />
        <div className="absolute -bottom-8 right-0 flex flex-col items-end">
          <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mb-1">Process_Pos</span>
          <span ref={progressTextRef} className="text-xs font-mono text-swiss-orange tabular-nums">000</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-24 w-full">
        {/* Header Metadata */}
        <div className="mb-12 flex items-center gap-6 opacity-30">
          <div className="w-8 h-px bg-white" />
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">System_Manifesto_Sequence_v4.0</span>
        </div>

        {/* The Grid Workspace */}
        <div ref={containerRef} className="flex flex-col gap-4 md:gap-8 items-start">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-start">
            {sentence1.map((item, i) => (
              <HoverBlock 
                key={`s1-${i}`} 
                word={item.w} 
                imageUrl={item.img} 
                index={item.idx}
              />
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-4 justify-start">
            {sentence2.map((item, i) => (
              <HoverBlock 
                key={`s2-${i}`} 
                word={item.w} 
                imageUrl={item.img} 
                index={item.idx}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Ambient Technical Background */}
      <div className="absolute bottom-10 left-10 pointer-events-none opacity-10">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-white" />)}
          </div>
          <span className="text-[8px] font-mono text-white uppercase tracking-widest">Calibration: Valid</span>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
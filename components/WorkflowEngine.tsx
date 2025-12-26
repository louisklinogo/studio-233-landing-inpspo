import React from 'react';
import WorkflowCanvas from './WorkflowCanvas';

const WorkflowEngine: React.FC = () => {
  return (
    <section className="w-full h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center p-8 lg:p-24 border-y border-neutral-100">
      
      {/* Section Metadata Headers */}
      <div className="absolute top-12 left-12 flex flex-col z-20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-swiss-orange"></div>
          <span className="text-[10px] font-mono text-black uppercase tracking-[0.5em]">Internal_Logic_Schematic</span>
        </div>
        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest pl-4">Substrate_View // [02]</span>
      </div>

      <div className="absolute top-12 right-12 text-right z-20">
        <span className="text-[9px] font-mono text-neutral-300 uppercase tracking-widest">Protocol: Active_Handshake</span>
      </div>

      {/* The Monolith Container */}
      <div className="w-full h-full max-w-[1400px] border border-neutral-100 shadow-[0_80px_100px_rgba(0,0,0,0.04)] rounded-sm overflow-hidden bg-neutral-50 relative z-10 group transition-transform duration-700 hover:scale-[1.01]">
        <WorkflowCanvas />
      </div>

      {/* Industrial Annotation */}
      <div className="absolute bottom-12 right-12 max-w-xs text-right opacity-40 z-20">
        <p className="text-[10px] font-mono leading-relaxed text-neutral-500 uppercase tracking-wider">
          Warning: Manual manipulation of processing nodes may result in high-variance creative output. Maintain thermal equilibrium.
        </p>
      </div>

      {/* Grid Decals */}
      <div className="absolute bottom-12 left-12 flex gap-1 z-20">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-1 h-8 bg-neutral-100"></div>
        ))}
      </div>
    </section>
  );
};

export default WorkflowEngine;
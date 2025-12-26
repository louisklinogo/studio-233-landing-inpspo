import React, { useEffect, useState, useRef } from 'react';
import { AnimationState, NodeData } from '../types';
import { CIRCUIT_NODES, CIRCUIT_CONNECTIONS, CANVAS_CENTER_X, CANVAS_CENTER_Y } from '../constants';
import { Zap, Command, Maximize2, Activity, CornerDownRight, Layers, Sliders, Image as ImageIcon, Play, ArrowRight, Pause, Settings2, Cpu } from 'lucide-react';

// Specialized sub-component for the "Product" being generated
const GeneratedProduct: React.FC<{ stage: 'empty' | 'wireframe' | 'render' | 'edited', opacity: number }> = ({ stage, opacity }) => {
  const isWireframe = stage === 'wireframe';
  const isDark = stage === 'edited';
  
  // Boxy Industrial Design
  const containerClass = `w-40 h-28 rounded-sm border-2 relative transition-all duration-1000 ease-out flex overflow-hidden shadow-xl ${
    isWireframe ? 'border-neutral-300 bg-transparent' : 
    isDark ? 'border-neutral-800 bg-[#1a1a1a]' : 'border-neutral-200 bg-[#f0f0f0]'
  }`;

  const grillClass = `absolute right-4 top-4 bottom-4 w-12 grid grid-cols-4 gap-1 content-center transition-all duration-1000 ${
      isWireframe ? 'opacity-30' : 'opacity-80'
  }`;
  
  const dialClass = `w-8 h-8 rounded-full border border-neutral-300 transition-all duration-1000 relative ${
      isWireframe ? 'bg-transparent' : isDark ? 'bg-[#2a2a2a] border-neutral-700' : 'bg-white'
  }`;

  const dotClass = `w-1 h-1 rounded-full ${isDark ? 'bg-neutral-600' : 'bg-neutral-300'}`;

  return (
    <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity }}
    >
        <div className={`${containerClass} transform ${stage === 'empty' ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
            {/* Left Control Panel */}
            <div className="absolute left-0 top-0 bottom-0 w-20 flex flex-col items-center justify-center gap-3 border-r border-transparent">
                <div className={dialClass}>
                    <div className={`absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 ${isDark ? 'bg-orange-500' : 'bg-orange-500'}`}></div>
                </div>
                <div className={dialClass}>
                    <div className={`absolute top-1/2 left-1/2 w-full h-0.5 -translate-x-1/2 -translate-y-1/2 rotate-45 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                </div>
            </div>

            {/* Right Speaker Grill */}
            <div className={grillClass}>
                {Array.from({length: 24}).map((_, i) => (
                    <div key={i} className={dotClass}></div>
                ))}
            </div>

            {/* Wireframe overlay */}
            {isWireframe && (
                <div className="absolute inset-0 border border-blue-400/30">
                    <div className="absolute top-0 bottom-0 left-20 w-px bg-blue-400/20"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-400/20"></div>
                </div>
            )}
        </div>

        {/* Labels */}
        {stage !== 'empty' && (
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-neutral-400 tracking-widest whitespace-nowrap">
                {stage === 'wireframe' ? 'CALCULATING_GEOMETRY...' : 
                 stage === 'render' ? 'RENDER_PASS_FINAL' : 'MATERIAL_UPDATE_COMPLETE'}
             </div>
        )}
    </div>
  );
};

const WorkflowCanvas: React.FC = () => {
  const [animState, setAnimState] = useState<AnimationState>(AnimationState.SURFACE_IDLE);
  const [nodes] = useState<NodeData[]>(CIRCUIT_NODES);
  const [activePacket, setActivePacket] = useState<string | null>(null);
  
  // UI States
  const [promptText, setPromptText] = useState("");
  const [productStage, setProductStage] = useState<'empty' | 'wireframe' | 'render' | 'edited'>('empty');
  const [passIndex, setPassIndex] = useState(0); // 0 = Gen, 1 = Edit
  const [camera, setCamera] = useState({ x: CANVAS_CENTER_X, y: CANVAS_CENTER_Y, zoom: 1.5 });
  
  // Interaction States
  const [showInput, setShowInput] = useState(true);
  const [submitActive, setSubmitActive] = useState(false);
  const [showPlayBar, setShowPlayBar] = useState(false);
  const [playButtonActive, setPlayButtonActive] = useState(false);

  const sequenceTimeoutRef = useRef<number | null>(null);

  // --- Animation Sequencer ---
  useEffect(() => {
    const runSequence = () => {
      // 1. Reset Scene
      setPassIndex(0);
      setProductStage('empty');
      setPromptText("");
      setShowInput(true);
      setShowPlayBar(false);
      setPlayButtonActive(false);
      setSubmitActive(false);
      setAnimState(AnimationState.SURFACE_IDLE);
      setCamera({ x: CANVAS_CENTER_X, y: CANVAS_CENTER_Y, zoom: 1.5 });

      // 2. Start Typing Prompt (Delay start slightly)
      setTimeout(() => {
        setAnimState(AnimationState.SURFACE_TYPING);
        typewriter("Generate isometric Braun-style radio", 0, () => {
            
            // 3. Simulate Submit Press
            setTimeout(() => {
                setSubmitActive(true);
                
                setTimeout(() => {
                    setSubmitActive(false);
                    setShowInput(false); // Hide Input
                    
                    // 4. Reveal Schematic
                    setAnimState(AnimationState.TRANSITION_TO_SUBSTRATE);
                    setCamera({ x: 500, y: 400, zoom: 0.65 });

                    // 5. Show Play Toolbar (after zoom settles)
                    setTimeout(() => {
                        setShowPlayBar(true);

                        // 6. Simulate Play Button Click
                        setTimeout(() => {
                            setPlayButtonActive(true); // Press animation
                            
                            setTimeout(() => {
                                // 7. Execute Flow
                                setPlayButtonActive(false);
                                setAnimState(AnimationState.SUBSTRATE_PROCESSING);
                                setProductStage('wireframe');
                                runDataFlow(); // Visual packets
                                
                                // 8. Transition back to Surface (after flow)
                                setTimeout(() => {
                                    setShowPlayBar(false);
                                    setAnimState(AnimationState.TRANSITION_TO_SURFACE);
                                    setCamera({ x: CANVAS_CENTER_X, y: CANVAS_CENTER_Y, zoom: 1.5 });

                                    // 9. Show Result
                                    setTimeout(() => {
                                        setAnimState(AnimationState.SURFACE_RESULT);
                                        setProductStage('render');
                                        
                                        // 10. Start Edit Phase
                                        setTimeout(() => {
                                            runEditSequence();
                                        }, 2500);

                                    }, 1500);
                                }, 3500); // Flow duration
                            }, 300); // Button press duration
                        }, 1200); // Wait before pressing play
                    }, 1500); // Zoom duration
                }, 400); // Submit active duration
            }, 500); // Post-typing wait
        });
      }, 1000);
    };

    const runEditSequence = () => {
        setPassIndex(1); // Switch to Edit Mode indicator
        setPromptText("");
        setShowInput(true);
        setAnimState(AnimationState.SURFACE_TYPING);

        // 11. Type Edit Prompt
        typewriter("Change material to matte black", 0, () => {
             // 12. Submit Edit
             setTimeout(() => {
                setSubmitActive(true);
                setTimeout(() => {
                    setSubmitActive(false);
                    setShowInput(false);

                    // 13. Back to Schematic
                    setAnimState(AnimationState.TRANSITION_TO_SUBSTRATE);
                    setCamera({ x: 500, y: 400, zoom: 0.65 });

                    // 14. Auto-Play (Faster this time, no manual play simulation for flow)
                    setTimeout(() => {
                        setAnimState(AnimationState.SUBSTRATE_PROCESSING);
                        runDataFlow();
                        
                        // 15. Back to Surface
                        setTimeout(() => {
                            setAnimState(AnimationState.TRANSITION_TO_SURFACE);
                            setCamera({ x: CANVAS_CENTER_X, y: CANVAS_CENTER_Y, zoom: 1.5 });

                            // 16. Final Result
                            setTimeout(() => {
                                setAnimState(AnimationState.SURFACE_RESULT);
                                setProductStage('edited');

                                // 17. Loop
                                setTimeout(() => {
                                    sequenceTimeoutRef.current = setTimeout(runSequence, 4000);
                                }, 2000);
                            }, 1500);
                        }, 3500);
                    }, 1200);
                }, 400);
             }, 500);
        });
    };

    const initialDelay = setTimeout(runSequence, 100);
    return () => {
        clearTimeout(initialDelay);
        if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    };
  }, []);

  const typewriter = (text: string, i: number, callback: () => void) => {
    if (i < text.length) {
      setPromptText(text.substring(0, i + 1));
      setTimeout(() => typewriter(text, i + 1, callback), 30 + Math.random() * 30);
    } else {
      callback();
    }
  };

  const runDataFlow = () => {
    setActivePacket('stage-1'); // Text/Model -> Sampler
    setTimeout(() => setActivePacket('stage-2'), 1000); // Sampler -> VAE
    setTimeout(() => setActivePacket('stage-3'), 2000); // VAE -> Output
    setTimeout(() => setActivePacket(null), 3000);
  };

  // Orthogonal "Manhattan" Routing
  const getConnectorPath = (source: NodeData, target: NodeData) => {
    const startX = source.x + source.width / 2;
    const startY = source.y;
    const endX = target.x - target.width / 2;
    const endY = target.y;
    const midX = (startX + endX) / 2;
    // M = Move to start, L = Line to...
    return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#f5f5f5] select-none font-sans">
      
      {/* --- SUBSTRATE LAYER (Nodes) --- */}
      <svg className="w-full h-full absolute inset-0 pointer-events-none z-0">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e5e5" strokeWidth="1"/>
          </pattern>
        </defs>

        <g style={{ 
            transform: `translate(50%, 50%) scale(${camera.zoom}) translate(${-camera.x}px, ${-camera.y}px)`,
            transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
            {/* Technical Grid */}
            <rect x={-2000} y={-2000} width={6000} height={6000} fill="url(#grid)" opacity={0.6} />

            {/* Wires */}
            {CIRCUIT_CONNECTIONS.map(conn => {
                const source = nodes.find(n => n.id === conn.sourceId)!;
                const target = nodes.find(n => n.id === conn.targetId)!;
                const path = getConnectorPath(source, target);
                
                return (
                    <g key={conn.id}>
                        <path d={path} fill="none" stroke="#d4d4d4" strokeWidth="2" />
                        {activePacket && (
                           <path d={path} fill="none" stroke={passIndex === 1 ? '#000000' : '#FF4400'} strokeWidth="2" strokeDasharray="100 1000" strokeDashoffset="1000">
                               <animate 
                                  attributeName="stroke-dashoffset" 
                                  from="1000" 
                                  to="0" 
                                  dur="1s" 
                                  begin={
                                    (activePacket === 'stage-1' && (conn.sourceId === 'node-clip' || conn.sourceId === 'node-model')) ? '0s' :
                                    (activePacket === 'stage-2' && conn.sourceId === 'node-ksampler') ? '0.8s' : 
                                    (activePacket === 'stage-3' && conn.sourceId === 'node-vae') ? '1.8s' : '99s'
                                  } 
                                  fill="freeze"
                               />
                           </path>
                        )}
                    </g>
                );
            })}

            {/* Nodes */}
            {nodes.map(node => {
                const isOutput = node.type === 'output';
                const isActive = (activePacket === 'stage-1' && (node.id === 'node-clip' || node.id === 'node-model')) ||
                                 (activePacket === 'stage-2' && node.id === 'node-ksampler') ||
                                 (activePacket === 'stage-3' && node.id === 'node-vae');

                return (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                        <foreignObject 
                            x={-node.width / 2} 
                            y={-node.height / 2} 
                            width={node.width} 
                            height={node.height}
                            className="overflow-visible"
                        >
                            <div className={`
                                w-full h-full bg-white border transition-all duration-300 flex flex-col overflow-hidden rounded-sm
                                ${isActive ? (passIndex === 1 ? 'border-black shadow-lg' : 'border-[#FF4400] shadow-lg') : 'border-neutral-300'}
                                ${isOutput ? 'shadow-2xl border-neutral-300' : ''}
                            `}>
                                {/* Header */}
                                <div className={`
                                    h-6 px-2 flex items-center justify-between border-b text-[9px] font-mono tracking-wider
                                    ${isActive ? (passIndex === 1 ? 'bg-black text-white border-black' : 'bg-[#FF4400] text-white border-[#FF4400]') : 'bg-neutral-50 text-neutral-500 border-neutral-200'}
                                `}>
                                    <span>{node.subLabel}</span>
                                    {isActive && <Activity size={10} className="animate-spin"/>}
                                </div>

                                {/* Body */}
                                <div className="flex-1 p-3 flex flex-col justify-between relative">
                                    <div className="flex items-center gap-2 mb-2">
                                        {node.id.includes('clip') && <Command size={14} className="text-neutral-500" />}
                                        {node.id.includes('model') && <Layers size={14} className="text-neutral-500" />}
                                        {node.id.includes('sampler') && <Sliders size={14} className="text-neutral-500" />}
                                        {node.id.includes('vae') && <Cpu size={14} className="text-neutral-500" />}
                                        {node.type === 'output' && <ImageIcon size={14} className="text-neutral-500" />}
                                        <span className="font-sans font-medium text-xs text-neutral-800">{node.label}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-1 gap-x-2">
                                        {node.metrics.map(m => (
                                            <div key={m.label} className="flex flex-col">
                                                <span className="text-[7px] text-neutral-400 font-mono leading-none mb-0.5">{m.label}</span>
                                                <span className="text-[9px] font-mono text-neutral-700">{m.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {isOutput && (
                                        <div className="absolute inset-0 bg-white z-10">
                                             <GeneratedProduct stage={productStage} opacity={productStage === 'empty' ? 0 : 1} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </foreignObject>
                    </g>
                );
            })}
        </g>
      </svg>


      {/* --- SURFACE UI ELEMENTS --- */}
      
      {/* 1. Top Status Bar */}
      <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start transition-opacity duration-500 ${showInput || productStage !== 'empty' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-3">
             <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 p-2.5 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <Maximize2 size={18} className="text-neutral-500 group-hover:text-black"/>
             </div>
             <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 px-4 py-2.5 rounded-sm shadow-sm flex gap-3 items-center">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${passIndex === 1 ? 'bg-black' : 'bg-[#FF4400]'} animate-pulse`}></span>
                    <span className="text-xs font-bold text-neutral-700 tracking-tight">CANVAS_01</span>
                </div>
                <div className="h-3 w-px bg-neutral-200"></div>
                <span className="text-xs text-neutral-400 font-mono">{passIndex === 0 ? 'GENERATION' : 'EDIT_MODE'}</span>
             </div>
          </div>
      </div>

      {/* 2. Floating Input Bar (Surface Mode) */}
      <div className={`
        absolute bottom-10 left-1/2 transform -translate-x-1/2 
        w-full max-w-xl transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1)
        ${showInput ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
      `}>
          <div className="bg-white/95 backdrop-blur-xl border border-neutral-200/80 shadow-2xl rounded-sm overflow-hidden mx-6">
              <div className="p-1.5 flex items-center gap-3 relative">
                  <div className="pl-4 text-neutral-300">
                      <CornerDownRight size={18} strokeWidth={2.5}/>
                  </div>
                  <input 
                    type="text" 
                    value={promptText}
                    readOnly
                    placeholder="Describe your creation..."
                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-[15px] font-medium text-neutral-900 placeholder-neutral-300 tracking-tight"
                  />
                  <div className="pr-2">
                      <div className={`
                        w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-200
                        ${submitActive ? 'bg-black scale-95' : 'bg-neutral-100'}
                      `}>
                          <ArrowRight 
                            size={18} 
                            className={`transition-colors ${submitActive ? 'text-white' : 'text-neutral-400'}`} 
                          />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. Floating Play Toolbar (Substrate/Node Mode) */}
      <div className={`
        absolute bottom-12 left-1/2 transform -translate-x-1/2 
        transition-all duration-500 ease-out
        ${showPlayBar ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}
      `}>
         <div className="bg-white border border-neutral-200 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-neutral-200 pr-6">
                 <div className="flex flex-col items-start">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-0.5">Flow</span>
                    <span className="text-xs font-bold text-neutral-900">Standard_V2</span>
                 </div>
                 <Settings2 size={16} className="text-neutral-400 hover:text-black cursor-pointer transition-colors"/>
            </div>
            
            {/* The Big Orange Play Button */}
            <button 
                className={`
                    w-12 h-12 rounded-full bg-[#FF4400] flex items-center justify-center shadow-lg shadow-orange-500/30
                    hover:bg-[#ff5511] transition-all duration-200
                    ${playButtonActive ? 'scale-90 bg-[#cc3300]' : 'hover:scale-105'}
                `}
            >
                <Play size={20} fill="currentColor" className="text-white ml-1" />
            </button>
            
             <div className="flex items-center gap-4 border-l border-neutral-200 pl-6">
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-0.5">Est. Time</span>
                    <span className="text-xs font-bold text-neutral-900">2.4s</span>
                 </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default WorkflowCanvas;
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Layers, Maximize2, Trash2, Cpu, Activity, MousePointer2, 
  Hand, Search, Share2, ChevronRight, X, Settings2
} from 'lucide-react';

declare const gsap: any;
declare const ScrollTrigger: any;

interface Asset {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  image: string;
  ref: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: '1', x: 200, y: 150, width: 280, height: 210, label: 'INDUSTRIAL_UNIT_A', ref: 'RX-77', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=600' },
  { id: '2', x: 600, y: 100, width: 280, height: 350, label: 'PROTOTYPE_CHASSIS', ref: 'BX-01', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' },
  { id: '3', x: 150, y: 450, width: 280, height: 210, label: 'THERMAL_ARRAY', ref: 'TX-90', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600' },
  { id: '4', x: 700, y: 500, width: 280, height: 210, label: 'SIGNAL_PROCESSOR', ref: 'SP-12', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600' },
];

const SpatialToolbar: React.FC<{ x: number, y: number, visible: boolean }> = ({ x, y, visible }) => {
  if (!visible) return null;
  return (
    <div 
      className="absolute z-50 transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
      style={{ left: x, top: y, transform: 'translate(-50%, -140%)' }}
    >
      <div className="bg-black text-white rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] flex items-center p-1.5 gap-1 border border-white/10 backdrop-blur-md">
        <button className="h-10 px-4 hover:bg-neutral-800 rounded-sm transition-colors flex items-center gap-3 group">
          <Layers size={14} className="text-swiss-orange group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-mono tracking-[0.2em] font-bold">BATCH_PROC</span>
        </button>
        <div className="w-[1px] h-6 bg-white/10 mx-1" />
        <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-sm transition-colors text-neutral-400 hover:text-white">
          <Settings2 size={16} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-sm transition-colors text-neutral-400 hover:text-white">
          <Share2 size={16} />
        </button>
        <div className="w-[1px] h-6 bg-white/10 mx-1" />
        <button className="w-10 h-10 flex items-center justify-center hover:bg-red-950/50 rounded-sm transition-colors text-neutral-400 hover:text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const InfiniteCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewfinderRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.8 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Interaction State
  const [isPanning, setIsPanning] = useState(false);
  const [dragInfo, setDragInfo] = useState<{ id: string, startX: number, startY: number, initialX: number, initialY: number } | null>(null);
  const [marquee, setMarquee] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    tl.fromTo(viewfinderRef.current, 
      { width: '600px', height: '600px', borderRadius: '4px' },
      { width: '100%', height: '100%', borderRadius: '0px', duration: 2, ease: "power2.inOut" }
    );

    tl.fromTo(innerRef.current,
      { scale: 0.7 },
      { scale: 1, duration: 2, ease: "power2.inOut" },
      "<"
    );

    return () => {
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  const toolbarPos = useMemo(() => {
    if (selectedIds.size === 0) return null;
    const selectedAssets = assets.filter(a => selectedIds.has(a.id));
    const minX = Math.min(...selectedAssets.map(a => a.x));
    const maxX = Math.max(...selectedAssets.map(a => a.x + a.width));
    const minY = Math.min(...selectedAssets.map(a => a.y));
    
    return {
      x: (minX + (maxX - minX) / 2) * camera.zoom + camera.x,
      y: minY * camera.zoom + camera.y
    };
  }, [selectedIds, assets, camera]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const worldX = (clientX - camera.x) / camera.zoom;
    const worldY = (clientY - camera.y) / camera.zoom;

    // Pan with Middle Mouse or Alt+Left
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      return;
    }

    // Asset Selection and Dragging
    const clickedAsset = [...assets].reverse().find(a => 
      worldX >= a.x && worldX <= a.x + a.width && 
      worldY >= a.y && worldY <= a.y + a.height
    );

    if (clickedAsset) {
      if (!e.shiftKey && !selectedIds.has(clickedAsset.id)) {
        setSelectedIds(new Set([clickedAsset.id]));
      } else if (e.shiftKey) {
        const next = new Set(selectedIds);
        if (next.has(clickedAsset.id)) next.delete(clickedAsset.id);
        else next.add(clickedAsset.id);
        setSelectedIds(next);
      }
      
      setDragInfo({
        id: clickedAsset.id,
        startX: clientX,
        startY: clientY,
        initialX: clickedAsset.x,
        initialY: clickedAsset.y
      });
    } else {
      // Background click
      if (!e.shiftKey) setSelectedIds(new Set());
      setMarquee({ x1: clientX, y1: clientY, x2: clientX, y2: clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (isPanning) {
      setCamera(prev => ({
        ...prev,
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    } else if (dragInfo) {
      const dx = (clientX - dragInfo.startX) / camera.zoom;
      const dy = (clientY - dragInfo.startY) / camera.zoom;
      
      setAssets(prev => prev.map(a => {
        if (a.id === dragInfo.id) {
          return { ...a, x: dragInfo.initialX + dx, y: dragInfo.initialY + dy };
        }
        return a;
      }));
    } else if (marquee) {
      setMarquee(prev => prev ? { ...prev, x2: clientX, y2: clientY } : null);
      
      const xMin = (Math.min(marquee.x1, clientX) - camera.x) / camera.zoom;
      const xMax = (Math.max(marquee.x1, clientX) - camera.x) / camera.zoom;
      const yMin = (Math.min(marquee.y1, clientY) - camera.y) / camera.zoom;
      const yMax = (Math.max(marquee.y1, clientY) - camera.y) / camera.zoom;

      const nextSelection = new Set<string>();
      assets.forEach(a => {
        if (a.x < xMax && a.x + a.width > xMin && a.y < yMax && a.y + a.height > yMin) {
          nextSelection.add(a.id);
        }
      });
      setSelectedIds(nextSelection);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDragInfo(null);
    setMarquee(null);
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-neutral-50 flex items-center justify-center overflow-hidden">
      <div 
        ref={viewfinderRef} 
        className="relative bg-white shadow-2xl overflow-hidden flex items-center justify-center border border-neutral-100"
      >
        <div 
          ref={innerRef}
          className={`w-full h-full relative overflow-hidden select-none cursor-crosshair ${isPanning ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={e => e.preventDefault()}
        >
          {/* Background Grid */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #e5e5e5 1.5px, transparent 1.5px)`,
              backgroundSize: `${50 * camera.zoom}px ${50 * camera.zoom}px`,
              backgroundPosition: `${camera.x}px ${camera.y}px`,
            }}
          />

          {/* Interactive Asset Layer */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.zoom})`, transformOrigin: '0 0' }}
          >
            {assets.map(asset => {
              const isSelected = selectedIds.has(asset.id);
              return (
                <div 
                  key={asset.id}
                  className={`absolute bg-white border pointer-events-auto transition-shadow duration-300 ${
                    isSelected ? 'border-swiss-orange shadow-[0_20px_50px_rgba(255,68,0,0.15)] z-20' : 'border-neutral-200 z-10'
                  }`}
                  style={{ 
                    left: asset.x, 
                    top: asset.y, 
                    width: asset.width, 
                    height: asset.height,
                    cursor: isPanning ? 'inherit' : 'grab'
                  }}
                >
                  <div className={`h-7 px-3 flex items-center justify-between border-b text-[9px] font-mono tracking-widest ${
                    isSelected ? 'bg-swiss-orange text-white' : 'bg-neutral-50 text-neutral-400'
                  }`}>
                    <span>{asset.ref}</span>
                    {isSelected && <Activity size={10} className="animate-pulse" />}
                  </div>
                  <div className="relative p-1 h-[calc(100%-56px)] bg-neutral-100 overflow-hidden">
                    <img 
                      src={asset.image} 
                      className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 hover:grayscale-0" 
                      draggable={false} 
                    />
                  </div>
                  <div className="h-7 px-3 flex items-center justify-between text-[10px] font-mono border-t border-neutral-100 bg-white">
                    <span className="font-bold text-neutral-800 tracking-tight uppercase">{asset.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Marquee UI */}
          {marquee && (
            <div 
              className="absolute border border-swiss-orange bg-swiss-orange/5 pointer-events-none z-40"
              style={{
                left: Math.min(marquee.x1, marquee.x2),
                top: Math.min(marquee.y1, marquee.y2),
                width: Math.abs(marquee.x2 - marquee.x1),
                height: Math.abs(marquee.y2 - marquee.y1),
              }}
            />
          )}

          {/* Spatial Instrument Toolbar */}
          {toolbarPos && (
            <SpatialToolbar 
              x={toolbarPos.x} 
              y={toolbarPos.y} 
              visible={selectedIds.size > 0 && !dragInfo && !marquee} 
            />
          )}

          {/* Interface HUD Overlay */}
          <div className="absolute bottom-10 right-10 flex gap-8 pointer-events-none opacity-40">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-1">Grid_Ref</span>
              <span className="text-[12px] font-mono tabular-nums font-bold">
                {Math.round(camera.x).toString().padStart(4, '0')} : {Math.round(camera.y).toString().padStart(4, '0')}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-1">Scale_Mag</span>
              <span className="text-[12px] font-mono tabular-nums font-bold">
                {(camera.zoom * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Interaction Guide */}
          <div className="absolute bottom-10 left-10 flex gap-4 pointer-events-none opacity-30">
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest">
               <div className="w-4 h-4 border border-black flex items-center justify-center text-[7px]">Alt</div>
               <span>Pan</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest">
               <div className="w-4 h-4 border border-black flex items-center justify-center text-[7px]">Sft</div>
               <span>Select</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteCanvas;
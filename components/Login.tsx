import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Fingerprint, ShieldCheck, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'VERIFYING' | 'GRANTED'>('IDLE');
  
  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('VERIFYING');
    
    // Simulate API handshake
    setTimeout(() => {
        setStatus('GRANTED');
        setTimeout(() => {
            onLogin();
        }, 800);
    }, 1500);
  };

  // --- Moiré Pattern Animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = containerRef.current?.clientWidth || 600;
    let height = canvas.height = containerRef.current?.clientHeight || 800;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / width;
        targetY = (e.clientY - rect.top) / height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawGrid = (spacing: number, rotation: number, opacity: number, shiftX: number, shiftY: number) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 68, 0, ${opacity})`; // Brand Orange
        ctx.lineWidth = 1;
        
        ctx.translate(width/2 + shiftX, height/2 + shiftY);
        ctx.rotate(rotation);
        ctx.translate(-width, -height); // Oversize to cover rotation

        const gridSize = Math.max(width, height) * 3;
        
        for(let x = 0; x < gridSize; x += spacing) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, gridSize);
        }
        ctx.stroke();
        ctx.restore();
    };

    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // Smooth mouse lerp
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Base Layer
        drawGrid(8, 0, 0.2, 0, 0);

        // Interference Layer 1
        drawGrid(8, 0.05 + (mouseX * 0.1), 0.3, mouseX * 20, mouseY * 20);

        // Interference Layer 2
        drawGrid(8, -0.05 - (mouseY * 0.1), 0.15, -mouseX * 30, -mouseY * 10);
        
        // Vignette
        const gradient = ctx.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width);
        gradient.addColorStop(0, 'rgba(5,5,5,0)');
        gradient.addColorStop(1, 'rgba(5,5,5,0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    const handleResize = () => {
         width = canvas.width = containerRef.current?.clientWidth || 600;
         height = canvas.height = containerRef.current?.clientHeight || 800;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-[#FF4400] selection:text-white">
      
      {/* Left Column - Interaction */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 lg:p-16 relative z-10 border-r border-neutral-200">
        
        {/* Header */}
        <div className="flex items-start justify-between w-full">
             <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 bg-black rounded-[1px]"></div>
                    <span className="font-bold text-lg tracking-tight">STUDIO+233</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 tracking-widest pl-6">
                    SYSTEM_ACCESS_POINT
                </span>
             </div>
             
             {/* Back Button */}
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-xs font-bold tracking-wide text-neutral-400 hover:text-black transition-colors"
             >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/>
                RETURN
             </button>
        </div>

        {/* Center Form */}
        <div className="w-full max-w-md mx-auto space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-medium tracking-tight text-swiss-black">
                    Authenticate Identity.
                </h1>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                    Enter your secure credentials to access the neural substrate. 
                    All sessions are monitored for quality assurance.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Email Field */}
                <div className="group relative">
                    <label className="block text-[9px] font-mono uppercase text-neutral-400 tracking-widest mb-2 group-focus-within:text-black transition-colors">
                        User_ID_Ref
                    </label>
                    <div className="relative">
                        <input 
                            type="email" 
                            className="w-full bg-transparent border-b border-neutral-300 py-3 pl-0 pr-8 text-lg font-medium rounded-none focus:outline-none focus:border-black transition-all placeholder-neutral-200"
                            placeholder="user@studio.ai"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value); 
                                setIsTyping(true);
                            }}
                            onBlur={() => setIsTyping(false)}
                            required
                        />
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${email.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                            <Fingerprint size={20} className="text-neutral-300" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Password Field */}
                <div className="group relative">
                    <label className="block text-[9px] font-mono uppercase text-neutral-400 tracking-widest mb-2 group-focus-within:text-black transition-colors">
                        Access_Key
                    </label>
                    <div className="relative">
                        <input 
                            type="password" 
                            className="w-full bg-transparent border-b border-neutral-300 py-3 pl-0 pr-8 text-lg font-medium rounded-none focus:outline-none focus:border-black transition-all placeholder-neutral-200"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-[#FF4400] transition-all duration-300 ${isTyping ? 'w-full' : 'w-0'}`}></div>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={status !== 'IDLE'}
                    className="w-full group relative overflow-hidden bg-black text-white h-14 flex items-center justify-between px-6 transition-all hover:bg-[#FF4400] disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-wait"
                >
                    {status === 'IDLE' && (
                        <>
                            <span className="text-xs font-bold tracking-widest uppercase">Initialize Session</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                    
                    {status === 'VERIFYING' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[9px] font-mono tracking-widest text-[#FF4400] animate-pulse">CRYPTOGRAPHIC_HANDSHAKE...</span>
                                <div className="w-32 h-0.5 bg-neutral-800 overflow-hidden">
                                    <div className="h-full bg-[#FF4400] animate-[shimmer_1s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'GRANTED' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500 text-white">
                             <div className="flex items-center gap-2">
                                <ShieldCheck size={18} />
                                <span className="text-xs font-bold tracking-widest uppercase">Access Granted</span>
                             </div>
                        </div>
                    )}
                </button>
                
                <div className="flex justify-between items-center pt-2">
                    <a href="#" className="text-[10px] font-mono text-neutral-400 hover:text-black uppercase tracking-wider border-b border-transparent hover:border-black transition-all pb-0.5">
                        Reset_Key
                    </a>
                    <a href="#" className="text-[10px] font-mono text-neutral-400 hover:text-black uppercase tracking-wider border-b border-transparent hover:border-black transition-all pb-0.5">
                        Request_Access
                    </a>
                </div>

            </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end border-t border-neutral-100 pt-6">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-neutral-400">SERVER_TIME</span>
                <span className="text-xs font-mono">{new Date().toLocaleTimeString('de-CH', { hour12: false })} UTC+1</span>
            </div>
            <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-mono text-neutral-400">NODE_ACTIVE</span>
            </div>
        </div>
      </div>

      {/* Right Column - Moiré Visualization */}
      <div className="hidden lg:block w-[60%] bg-black relative overflow-hidden" ref={containerRef}>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair opacity-60"></canvas>
          <div className="absolute top-8 right-8 text-neutral-500 font-mono text-[10px] tracking-widest">
              VISUALIZATION_ENGINE_V4
          </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { ThreeBackground } from './components/ThreeBackground';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { Console } from './components/Console';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  return (
    <div className="relative min-h-screen text-silver font-sans selection:bg-accent-orange selection:text-black">
      
      {/* Visual Effects Layers */}
      
      {/* Noise Grain */}
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%20%2F%3E%3C%2Fsvg%3E')]"></div>
      
      {/* Vignette */}
      <div className="fixed inset-0 z-[61] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]"></div>

      {/* 3D Canvas */}
      <ThreeBackground mode={mode} />

      {/* Logo */}
      <div className="fixed top-8 left-8 z-[100] opacity-90 hover:opacity-100 transition-opacity">
        <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e303886f8bbf62ab561f34/d48a33d44_logo_resized.png" 
            alt="5DV Logo" 
            className="w-20 h-auto drop-shadow-[0_0_15px_rgba(255,122,26,0.4)]" 
        />
      </div>

      {/* HUD Status - Top Right */}
      <div className="fixed top-8 right-8 z-[100] hidden md:flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-sm tracking-widest">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        5DV.AI // ONLINE
      </div>

      {/* HUD Side - Bottom Left */}
      <div className="fixed bottom-8 left-8 z-[100] hidden md:block text-white/20 text-xs tracking-[0.4em] uppercase [writing-mode:vertical-rl] rotate-180">
        System Ready // Grid Active
      </div>

      {/* UI Content */}
      <main className="relative z-20 w-full min-h-screen flex flex-col items-center">
          <Hero mode={mode} />
          
          {/* Scrollable Content Area */}
          <div className={`${mode === AppMode.CONSOLE ? 'hidden' : 'block'} w-full`}>
             <Dashboard />
             
             {/* CTA to open Console */}
             <div className="flex justify-center pb-20">
                <button 
                    onClick={() => setMode(AppMode.CONSOLE)}
                    className="group relative px-8 py-4 bg-glass-gradient backdrop-blur-md border border-accent-orange/50 text-accent-orange font-bold text-xl uppercase tracking-[0.2em] rounded-xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,122,26,0.3)] hover:scale-105"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Init Neural Uplink
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </span>
                    <div className="absolute inset-0 bg-accent-orange/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
             </div>
          </div>
      </main>

      {/* Overlay Console */}
      <Console mode={mode} onClose={() => setMode(AppMode.HOME)} />
    </div>
  );
}

export default App;
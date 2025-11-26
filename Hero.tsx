import React, { useEffect, useRef } from 'react';
import { AppMode } from '../types';

interface HeroProps {
    mode: AppMode;
}

export const Hero: React.FC<HeroProps> = ({ mode }) => {
    const textRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            
            // Text Effects
            if (textRef.current) {
                const opacity = 1 - Math.min(scrollY / 400, 1);
                const scale = 1 + scrollY * 0.0005;
                
                textRef.current.style.opacity = opacity.toString();
                textRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
                textRef.current.style.display = (opacity <= 0 || mode === AppMode.CONSOLE) ? 'none' : 'block';
            }

            // Scroll Indicator Effects
            if (scrollRef.current) {
                const scrollOpacity = 1 - Math.min(scrollY / 200, 1);
                scrollRef.current.style.opacity = scrollOpacity.toString();
                // Completely hide if console is open or scrolled away
                scrollRef.current.style.display = (scrollOpacity <= 0 || mode === AppMode.CONSOLE) ? 'none' : 'flex';
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mode]);

    return (
        <>
            <div 
                ref={textRef}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full pointer-events-none transition-all duration-700"
            >
                <h1 className="text-[12vw] md:text-9xl font-black uppercase tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-accent-orange to-accent-gold drop-shadow-[0_0_40px_rgba(255,122,26,0.2)]">
                    5DV.ai
                </h1>
                <h2 className="text-xl md:text-4xl font-extrabold text-accent-blue/20 tracking-[0.3em] uppercase backdrop-blur-sm mix-blend-overlay mt-2">
                    Fifth Dimension Vision
                </h2>
            </div>

            <div 
                ref={scrollRef}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-none transition-opacity duration-500"
            >
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold/60 animate-pulse">Initialize</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-accent-gold to-transparent"></div>
            </div>
        </>
    );
};
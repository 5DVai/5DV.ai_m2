import React from 'react';

export const Dashboard: React.FC = () => {
    const cards = [
        {
            title: "Cortex.ai",
            desc: "Neural core processor for high-dimensionality data parsing.",
            tags: ["Core", "Stable"],
            color: "bg-[#050817]",
            artClass: "card-art-cortex",
            link: "https://openai.com"
        },
        {
            title: "SAgents™",
            desc: "Autonomous swarm intelligence for distributed task execution.",
            tags: ["Agent", "V 1.0"],
            color: "bg-[#0d1a38]",
            artClass: "card-art-sagents",
            link: "https://google.com"
        },
        {
            title: "R.O.G.E.R.",
            desc: "Recursive Operation Generator & Entropic Resolver.",
            tags: ["Tool", "Beta"],
            color: "bg-[#0a1f14]",
            statusColor: "bg-orange-500 shadow-[0_0_8px_orange]",
            artClass: "card-art-roger",
            link: "https://anthropic.com"
        },
        {
            title: "5thD.Vibes",
            desc: "Immersive coding environment. System integration pending.",
            tags: ["Offline"],
            color: "bg-neutral-900",
            statusColor: "bg-gray-600",
            artClass: "card-art-tbd",
            disabled: true
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-6 pb-24 relative z-20 mt-[80vh]">
            <div className="flex items-center gap-4 mb-8 border-b border-accent-orange/30 pb-2 w-max">
                <span className="text-2xl font-light tracking-[0.2em] uppercase text-silver">Active Constructs</span>
                <div className="h-2 w-2 bg-accent-orange rounded-full animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <a 
                        key={idx}
                        href={card.disabled ? undefined : card.link}
                        target={card.disabled ? undefined : "_blank"}
                        rel="noreferrer"
                        className={`
                            group relative overflow-hidden rounded-3xl h-[420px] flex flex-col
                            bg-navy-mid/60 backdrop-blur-xl border border-white/10
                            transition-all duration-500 ease-out
                            hover:-translate-y-2 hover:border-accent-orange/50 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]
                            ${card.disabled ? 'cursor-not-allowed opacity-60 grayscale' : 'cursor-pointer'}
                        `}
                    >
                        {/* Header */}
                        <div className="p-6 flex justify-between items-start border-b border-white/5 bg-black/20">
                            <h3 className="text-2xl font-bold text-white tracking-wide">
                                {card.title}
                            </h3>
                            <div className={`w-2 h-2 rounded-full ${card.statusColor || 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]'}`}></div>
                        </div>

                        {/* Art Area */}
                        <div className={`flex-grow relative w-full overflow-hidden ${card.color}`}>
                             {/* Generative Art CSS patterns would go here. For now, simple gradients */}
                             {idx === 0 && (
                                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#2a0a2e_0%,_transparent_70%)] opacity-80">
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-purple-500/30 rounded-full shadow-[0_0_30px_rgba(180,50,255,0.2)]"></div>
                                 </div>
                             )}
                             {idx === 1 && (
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,255,255,0.05)_20px,rgba(0,255,255,0.05)_21px)]"></div>
                             )}
                             {idx === 2 && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 text-6xl font-mono text-green-500 rotate-12">
                                    101010
                                </div>
                             )}
                             {idx === 3 && (
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a_10px,#111_10px,#111_20px)]"></div>
                             )}
                             
                             {/* Hover Glow Overlay */}
                             <div className="absolute inset-0 bg-accent-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                        </div>

                        {/* Body */}
                        <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
                            <p className="text-lg text-silver/90 font-light leading-relaxed mb-4 min-h-[3.5em]">
                                {card.desc}
                            </p>
                            <div className="flex gap-2">
                                {card.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-xs uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5 text-silver tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

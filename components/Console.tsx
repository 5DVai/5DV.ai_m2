import React, { useState, useRef, useEffect } from 'react';
import { Message, AppMode } from '../types';
import { streamResponse } from '../services/geminiService';

interface ConsoleProps {
    mode: AppMode;
    onClose: () => void;
}

export const Console: React.FC<ConsoleProps> = ({ mode, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'system',
            text: 'INITIALIZING NEURAL UPLINK...\nCONNECTION ESTABLISHED.\nR.O.G.E.R. ONLINE. AWAITING INPUT.',
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-focus input when opening
    useEffect(() => {
        if (mode === AppMode.CONSOLE) {
            setTimeout(() => inputRef.current?.focus(), 500);
        }
    }, [mode]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const aiMsgId = (Date.now() + 1).toString();
        // Optimistic empty AI message
        setMessages(prev => [...prev, {
            id: aiMsgId,
            role: 'model',
            text: '',
            timestamp: Date.now(),
            isStreaming: true
        }]);

        let fullResponse = '';

        // Prepare history for API
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
        history.push({ role: 'user', parts: [{ text: userMsg.text }] });

        await streamResponse(history, userMsg.text, (chunk) => {
            fullResponse += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === aiMsgId 
                    ? { ...msg, text: fullResponse } 
                    : msg
            ));
        });

        setIsTyping(false);
        setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId 
                ? { ...msg, isStreaming: false } 
                : msg
        ));
    };

    if (mode !== AppMode.CONSOLE) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full max-w-4xl h-[85vh] bg-[#050817]/90 border border-accent-orange/30 rounded-lg shadow-[0_0_50px_rgba(255,122,26,0.1)] flex flex-col overflow-hidden relative">
                
                {/* Header */}
                <div className="h-12 border-b border-accent-orange/20 flex items-center justify-between px-4 bg-[#02040a]">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-accent-orange text-sm tracking-widest font-mono">NEURAL_UPLINK_V2.5</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-silver hover:text-white uppercase text-xs tracking-wider border border-white/10 px-3 py-1 hover:bg-white/10 transition-colors"
                    >
                        Terminate Session
                    </button>
                </div>

                {/* Terminal Body */}
                <div className="flex-grow overflow-y-auto p-6 font-mono text-sm md:text-base space-y-6 custom-scrollbar" id="console-body">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-sm border-l-2 ${
                                msg.role === 'user' 
                                    ? 'bg-navy-mid/80 border-accent-blue text-blue-100' 
                                    : 'bg-black/40 border-accent-orange text-orange-50'
                            }`}>
                                <div className="text-[10px] uppercase opacity-50 mb-1 tracking-wider">
                                    {msg.role === 'user' ? 'OPERATOR' : 'R.O.G.E.R. SYS'} :: {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                                <div className="whitespace-pre-wrap leading-relaxed">
                                    {msg.text}
                                    {msg.isStreaming && <span className="animate-pulse inline-block w-2 h-4 bg-accent-orange ml-1 align-middle"></span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#02040a] border-t border-accent-orange/20">
                    <form onSubmit={handleSend} className="relative flex items-center gap-3">
                        <span className="text-accent-orange animate-pulse">{'>'}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isTyping ? "PROCESSING STREAM..." : "ENTER COMMAND..."}
                            disabled={isTyping}
                            className="w-full bg-transparent border-none outline-none text-green-400 font-mono text-lg placeholder-green-400/30 focus:ring-0"
                            autoComplete="off"
                        />
                        <button 
                            type="submit" 
                            disabled={!input || isTyping}
                            className="px-6 py-2 bg-accent-orange/10 text-accent-orange border border-accent-orange/50 hover:bg-accent-orange hover:text-black uppercase text-sm tracking-widest transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent-orange"
                        >
                            Send
                        </button>
                    </form>
                </div>
                
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-20"></div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trophy, Search, Paperclip, Zap, Globe, 
  Image as ImageIcon, Code, Play, ArrowUp, PanelLeftClose,
  Maximize2, ChevronDown, Sword, Fingerprint
} from 'lucide-react';

const BattlePage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  return (
    <div className="flex h-screen bg-[#050505] text-white/70 overflow-hidden font-sans">
      {/* 1. Sidebar - Ultra Minimal */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-6 bg-[#050505] z-20">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <Sword className="w-3 h-3 text-black" strokeWidth={3} />
            </div>
            <span className="font-light tracking-tighter text-white uppercase text-lg">Arena</span>
          </div>
          <PanelLeftClose className="w-4 h-4 text-white/20 cursor-pointer hover:text-white transition-colors" />
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<Plus size={16} />} label="New Battle" active />
          <SidebarLink icon={<Trophy size={16} />} label="Standings" />
          <SidebarLink icon={<Fingerprint size={16} />} label="History" />
        </nav>

        {/* Mini Promo */}
        <div className="mt-auto p-6 rounded-3xl border border-white/5 bg-white/[0.01] group cursor-pointer">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3">Community</p>
          <h4 className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">Join the Research Team ↗</h4>
        </div>
      </aside>

      {/* 2. Main Arena Area */}
      <main className="flex-1 flex flex-col relative bg-[#050505]">
        {/* Grain Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 relative z-10">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">Session: Beta_942</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
             <span className="text-[10px] font-mono text-white/40 uppercase">Latency: 24ms</span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12 relative z-10">
          <div className="max-w-4xl mx-auto w-full text-center py-20">
             <h2 className="text-4xl font-serif italic text-white/20 mb-4 leading-tight">"Initiate a battle between <br/> anonymous architectures."</h2>
             <p className="text-[10px] text-white/10 uppercase tracking-[0.4em]">Protocol 2025.A</p>
          </div>
          {/* Messages would map here... */}
        </div>

        {/* 3. The Input Bar - Centerpiece */}
        <div className="p-8 max-w-5xl mx-auto w-full relative z-10">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-3 shadow-2xl focus-within:border-white/20 transition-all">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject prompt for evaluation..."
              rows={1}
              className="w-full bg-transparent border-none outline-none px-6 py-4 text-white text-lg placeholder:text-white/10 resize-none font-light"
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-1">
                <InputToolButton icon={<Paperclip size={16} />} />
                <InputToolButton icon={<Globe size={16} />} />
                <InputToolButton icon={<Code size={16} />} />
              </div>
              <button 
                className={`h-12 w-12 flex items-center justify-center rounded-2xl transition-all ${input ? 'bg-white text-black' : 'bg-white/5 text-white/20'}`}
              >
                <ArrowUp size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          <p className="text-center text-[9px] text-white/10 mt-4 uppercase tracking-[0.3em]">
            Blind Evaluation Active // Both models are unidentified
          </p>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const SidebarLink = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-white/[0.05] text-white border border-white/5' : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}`}>
    <span className={active ? "text-white" : "text-white/20"}>{icon}</span>
    <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
  </div>
);

const InputToolButton = ({ icon }) => (
  <button className="p-3 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
    {icon}
  </button>
);

export default BattlePage;
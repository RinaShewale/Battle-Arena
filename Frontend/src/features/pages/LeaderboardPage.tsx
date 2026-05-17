import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, ArrowUpRight, TrendingUp, Filter, 
  Search, Activity, Zap, ShieldCheck 
} from 'lucide-react';
import { Navbar } from '../component/Navbar';
import { Footer } from '../component/Footer';
import { BackgroundSystem } from '../component/UI/BackgroundSystem';

export const LeaderboardPage = () => {
  const models = [
    { rank: "01", name: "GPT-4.5 Omni", score: 1482, status: "Godlike", trend: "+12", volatility: "Low", category: "General" },
    { rank: "02", name: "Claude 3.7 Opus", score: 1451, status: "Elite", trend: "+5", volatility: "Stable", category: "Reasoning" },
    { rank: "03", name: "Gemini 2.0 Pro", score: 1422, status: "Superior", trend: "-2", volatility: "High", category: "Multimodal" },
    { rank: "04", name: "Llama 4.0 Omni", score: 1390, status: "Stable", trend: "+24", volatility: "Stable", category: "Open Source" },
    { rank: "05", name: "Mistral Large 3", score: 1310, status: "Stable", trend: "+1", volatility: "Low", category: "Efficient" },
    { rank: "06", name: "DeepSeek V3", score: 1295, status: "Emerging", trend: "+45", volatility: "High", category: "Code" },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-white/20">
      <BackgroundSystem />
      <Navbar />

      <main className="relative z-10 pt-44 pb-32 px-6 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 text-emerald-500 mb-4">
              <Activity size={14} className="animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Neural_Network_Leaderboard</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter">
              The <span className="font-serif italic text-zinc-500">Elite.</span>
            </h1>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex flex-col items-end gap-4"
          >
            <div className="flex bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-6 text-[10px] font-mono text-zinc-400">
               <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full"/> 85 Models</span>
               <span className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"/> 1.2M Battles</span>
            </div>
            <div className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
              Last Sync: {new Date().toLocaleTimeString()} UTC // Index_Node_01
            </div>
          </motion.div>
        </header>

        {/* RANK #1 HERO PODIUM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            <div className="relative p-10 md:p-16 border border-white/10 bg-white/[0.02] backdrop-blur-3xl rounded-3xl flex flex-col md:flex-row justify-between items-center gap-12 overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                    <Crown size={120} className="text-white/[0.03] -rotate-12" />
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
                    <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                        <Crown size={40} />
                    </div>
                    <div>
                        <span className="text-xs font-mono text-emerald-500 mb-2 block tracking-widest">CURRENT CHAMPION</span>
                        <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-2 uppercase">{models[0].name}</h2>
                        <div className="flex gap-4 opacity-40 text-[10px] font-mono justify-center md:justify-start">
                            <span>CATEGORY: {models[0].category}</span>
                            <span>VOLATILITY: {models[0].volatility}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center md:text-right relative z-10">
                    <div className="text-7xl md:text-8xl font-extralight tracking-tighter text-white mb-2">
                        {models[0].score}
                    </div>
                    <div className="text-xs font-mono text-emerald-500 flex items-center justify-center md:justify-end gap-2">
                        <TrendingUp size={14} /> {models[0].trend} PTS THIS WEEK
                    </div>
                </div>
            </div>
        </motion.div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 px-10 py-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest border-b border-white/5">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Model Identity</div>
            <div className="col-span-2 text-center">Trend</div>
            <div className="col-span-2 text-center">Stability</div>
            <div className="col-span-2 text-right">ELO Score</div>
        </div>

        {/* REMAINING MODELS */}
        <div className="space-y-2 mt-4">
          {models.slice(1).map((model, i) => (
            <LeaderboardRow key={model.name} model={model} index={i} />
          ))}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-20 p-8 border border-white/5 bg-white/[0.01] rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 opacity-30 grayscale italic font-serif text-sm">
                <span>Verified by Consensus</span>
                <span>Open Data Initiative</span>
                <span>Neural Integrity Protocol</span>
            </div>
            <button className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 hover:text-white transition-colors">
                VIEW FULL ARCHIVE [85+] <ArrowUpRight size={14} />
            </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const LeaderboardRow = ({ model, index }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group grid grid-cols-12 items-center p-10 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 rounded-2xl transition-all cursor-pointer"
    >
      <div className="col-span-1 font-mono text-xs text-zinc-600">
        {model.rank}
      </div>
      
      <div className="col-span-5 flex items-center gap-6">
        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white/30 transition-all">
            <Zap size={18} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-2xl font-light tracking-tight text-zinc-200 group-hover:text-white transition-colors uppercase">
            {model.name}
          </h3>
          <span className="text-[9px] font-mono text-zinc-600 tracking-wider">TAG: {model.category}</span>
        </div>
      </div>

      <div className={`col-span-2 text-center font-mono text-sm ${model.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
        {model.trend}
      </div>

      <div className="col-span-2 flex justify-center">
        <div className="px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
            {model.volatility}
        </div>
      </div>
      
      <div className="col-span-2 text-right">
        <div className="text-3xl font-light tracking-tighter">
          {model.score}
        </div>
        <div className="text-[8px] text-zinc-600 uppercase font-mono tracking-tighter">Verified_Rating</div>
      </div>
    </motion.div>
);
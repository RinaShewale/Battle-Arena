import { motion } from 'framer-motion';
import { MoveRight, Zap, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroScene } from './HeroScene';
import { BackgroundSystem } from '../component/UI/BackgroundSystem';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center bg-[#050505] text-white overflow-hidden">
     <BackgroundSystem />
      {/* 1. THE 3D SCENE (Refracted Glass) */}
      <HeroScene />

      {/* 2. OVERLAYS FOR DEPTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]" />

      <div className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-16 relative z-20 pt-20">
        
        {/* LEFT SIDE: SIMPLE MESSAGE */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
              <span className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                <Sparkles size={12} /> Live Lab Active
              </span>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
            <h1 className="text-6xl md:text-[110px] font-extralight leading-[0.85] tracking-tighter mb-10">
              Find the AI <br />
              <span className="font-serif italic text-white/30">that fits you.</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-lg mb-12 font-light leading-relaxed"
          >
            Stop guessing which AI is better. We test them side-by-side on real tasks so you can use the smartest tools for your work.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-5"
          >
            <button 
              onClick={() => navigate('/battlearena')}
              className="h-16 px-10 bg-white text-black rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-3 group shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Start Your Test <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => navigate('/working')}
              className="h-16 px-8 border border-white/10 rounded-full font-medium hover:bg-white/5 transition-all text-white/70"
            >
              How it works
            </button>
          </motion.div>
        </div>

        {/* RIGHT SIDE: LIVE FEED & STATS */}
        <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 justify-center">
          
          <div className="grid grid-cols-2 gap-4">
             <MetricCard 
                icon={<Brain size={20} className="text-blue-400" />} 
                label="AIs Tested" 
                value="1,402" 
                delay={0.4} 
             />
             <MetricCard 
                icon={<MessageSquare size={20} className="text-emerald-400" />} 
                label="Daily Battles" 
                value="89.4k" 
                delay={0.5} 
             />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden"
          >
             <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Live Activity Feed</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             
             <div className="space-y-4">
                <BattleLogItem AI1="GPT-4o" AI2="Claude 3.5" status="Testing Logic..." />
                <BattleLogItem AI1="Llama 3" AI2="Gemini 1.5" status="Winner: Llama 3" winner />
                <BattleLogItem AI1="Mistral" AI2="GPT-4" status="Comparing Speed..." />
             </div>

             {/* Decorative background light */}
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* FOOTER COORDINATES */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4 text-[10px] font-mono text-white/20 tracking-widest hidden md:flex">
        <div className="w-8 h-[1px] bg-white/10" />
        <span>NETWORK_STABLE // 204.11.0.1</span>
      </div>
    </section>
  );
};

/* --- MINI COMPONENTS --- */

const MetricCard = ({ icon, label, value, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/20 transition-all group"
  >
    <div className="mb-4">{icon}</div>
    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1 font-bold">{label}</div>
    <div className="text-3xl font-light text-white">{value}</div>
  </motion.div>
);

const BattleLogItem = ({ AI1, AI2, status, winner = false }: any) => (
  <div className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
    <div className="flex justify-between text-[11px] font-mono">
      <span className="text-white/70">{AI1} <span className="text-white/20 mx-1 text-[8px]">VS</span> {AI2}</span>
      <span className={winner ? "text-emerald-400" : "text-white/40"}>{status}</span>
    </div>
    {/* Animated progress bar for the "live" feel */}
    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: winner ? '0%' : '20%' }}
        transition={{ duration: 2, repeat: winner ? 0 : Infinity }}
        className={`h-full w-full ${winner ? 'bg-emerald-500/50' : 'bg-blue-500/50'}`}
      />
    </div>
  </div>
);
import { motion } from 'framer-motion';
import { Crown, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Navbar } from '../component/Navbar';
import { Footer } from '../component/Footer';

export const LeaderboardPage = () => {
  const models = [
    { rank: "01", name: "GPT-4.5 Arena", score: 1482, status: "Godlike", active: true },
    { rank: "02", name: "Claude 3.7 Opus", score: 1451, status: "Elite" },
    { rank: "03", name: "Gemini 2.0 Pro", score: 1422, status: "Superior" },
    { rank: "04", name: "Llama 4.0 Omni", score: 1390, status: "Stable" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <Navbar />
      <main className="pt-48 pb-20 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6 border-b border-white/5 pb-12">
          <div>
            <div className="flex items-center gap-2 text-green-500 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Live_Tracking_Active</span>
            </div>
            <h1 className="text-6xl font-light tracking-[-0.04em]">Leaderboard</h1>
          </div>
          <div className="text-white/20 text-[10px] font-mono uppercase tracking-widest pb-2">
            Last Reset: 02:14 UTC // Node_09
          </div>
        </div>

        <div className="space-y-px bg-white/5 border border-white/5 rounded-sm overflow-hidden">
          {models.map((model, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={model.name}
              className="group flex items-center justify-between p-10 bg-[#050505] hover:bg-white/[0.02] transition-all cursor-pointer relative"
            >
              {model.active && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
              
              <div className="flex items-center gap-12">
                <span className="font-mono text-xs text-white/20 w-8">{model.rank}</span>
                <div>
                  <h3 className="font-light text-3xl tracking-tight group-hover:translate-x-2 transition-transform duration-500 uppercase">{model.name}</h3>
                  <span className="text-[10px] text-white/30 font-serif italic tracking-[0.1em]">{model.status} Tier</span>
                </div>
              </div>
              
              <div className="flex items-center gap-16">
                <div className="text-right">
                  <div className="text-4xl font-light tracking-tighter mb-1">
                    {model.score}
                  </div>
                  <div className="text-[9px] text-white/20 uppercase font-mono tracking-widest">ELO Score</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-white transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};
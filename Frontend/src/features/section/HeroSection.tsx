import { motion } from 'framer-motion';
import { MoveRight, Globe, Fingerprint, Cpu, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroScene } from './HeroScene';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center bg-[#050505] text-white overflow-hidden">
      {/* 3D Background */}
      <HeroScene />

      {/* Subtle Grain Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10" />
      
      {/* Soft Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-12 relative z-20 pt-20">
        
        {/* Main Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="h-[1px] w-10 bg-white/20" />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.6em] font-medium">
              Intelligence Protocol 4.0.2
            </span>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
            <h1 className="text-6xl md:text-[100px] font-extralight leading-[0.9] tracking-tighter mb-10">
              Battle the <br />
              <span className="font-serif italic text-white/40">Neural Core.</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl max-w-xl mb-12 font-light leading-relaxed"
          >
            A high-fidelity simulation environment for the next generation of Large Language Models. 
            Deploy, validate, and benchmark performance in real-time.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-5"
          >
            <button 
              onClick={() => navigate('/battlearena')}
              className="h-14 px-10 bg-white text-black rounded-full font-medium transition-all hover:bg-neutral-200 flex items-center gap-3 group"
            >
              Enter Arena <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="h-14 px-10 border border-white/10 rounded-full text-white/80 font-medium hover:bg-white/5 transition-all flex items-center gap-2">
              The Methodology <ArrowUpRight size={16} className="opacity-40" />
            </button>
          </motion.div>
        </div>

        {/* Sidebar System Info */}
        <div className="lg:col-span-5 hidden lg:flex flex-col gap-3 justify-center">
          <div className="grid grid-cols-2 gap-3">
             <MetricCard icon={<Globe size={16}/>} label="Global Nodes" value="142" delay={0.4} />
             <MetricCard icon={<Cpu size={16}/>} label="Throughput" value="1.2M/s" delay={0.5} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-3xl relative overflow-hidden group hover:border-white/20 transition-all"
          >
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <Fingerprint size={18} className="text-white/20" />
                   <span className="text-[10px] font-medium text-white/40 tracking-[0.3em] uppercase">Status_Monitor</span>
                </div>
                <div className="flex gap-1">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
                   ))}
                </div>
             </div>
             
             <div className="space-y-4 font-light text-xs text-white/30">
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span>GPT-4o Challenge</span>
                   <span className="text-white/60">Verified</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span>Claude 3.5 Active</span>
                   <span className="text-white/60">Benchmarking</span>
                </div>
                <div className="flex justify-between text-white/60 pt-2">
                   <span>System Latency</span>
                   <span className="font-mono">12ms</span>
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Spatial Coordinates */}
      <div className="absolute bottom-10 left-10 text-[10px] font-mono text-white/10 tracking-[0.4em] uppercase hidden md:block">
        Lat: 40.7128° N // Lon: 74.0060° W
      </div>
    </section>
  );
};

const MetricCard = ({ icon, label, value, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group"
  >
    <div className="text-white/20 mb-4 group-hover:text-white/50 transition-colors">
      {icon}
    </div>
    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1 font-medium">{label}</div>
    <div className="text-2xl font-light tracking-tight text-white/90">
      {value}
    </div>
  </motion.div>
);
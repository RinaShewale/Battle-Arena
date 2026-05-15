import { motion } from 'framer-motion';
import { Shield, Zap, Activity, Users, Award, MoveRight } from 'lucide-react';
import { Footer } from '../component/Footer';
import { Navbar } from '../component/Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-sans">
      <Navbar />
      <main className="pt-48 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Branding */}
          <div className="grid lg:grid-cols-2 gap-24 items-start mb-40">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="h-[1px] w-8 bg-white/20" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-mono">Mission_Manifesto</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-light mb-10 tracking-[-0.04em] leading-[0.9]">
                The Code <br/>
                <span className="font-serif italic opacity-40">Protocol.</span>
              </h1>
              <p className="text-white/40 text-xl font-light leading-relaxed mb-12 max-w-lg">
                Arena is the world's most rigorous benchmarking ecosystem. We bridge the gap between "prompting" and "production" through adversarial testing.
              </p>
              
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/20 mb-2 font-mono">Battles Processed</p>
                  <p className="text-4xl font-light tracking-tighter italic font-serif">1.2M+</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/20 mb-2 font-mono">Verified Votes</p>
                  <p className="text-4xl font-light tracking-tighter italic font-serif">482K</p>
                </div>
              </div>
            </motion.div>
            
            <div className="relative aspect-square rounded-[3rem] border border-white/5 bg-white/[0.02] flex items-center justify-center overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
               <Activity className="w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-1000" strokeWidth={1} />
            </div>
          </div>

          {/* Value Props - Bento Style */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <Award className="text-white/40 mb-8 w-10 h-10" strokeWidth={1} />
              <h3 className="text-3xl font-light tracking-tight mb-6 text-white/90">Adversarial <br/>Evaluation</h3>
              <p className="text-white/40 leading-relaxed font-light text-lg">
                Models aren't just tested for accuracy; they are pitted against edge cases, legacy code constraints, and complex requirements to determine true utility.
              </p>
            </div>
            <div className="p-12 rounded-[3rem] border border-white/5 hover:bg-white/[0.01] transition-all">
              <Users className="text-white/40 mb-8 w-10 h-10" strokeWidth={1} />
              <h3 className="text-3xl font-light tracking-tight mb-6 text-white/90">Community <br/>Verified</h3>
              <p className="text-white/40 leading-relaxed font-light text-lg">
                Our ELO scores are derived from thousands of blind A/B tests, ensuring our leaderboard reflects real-world developer preference.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
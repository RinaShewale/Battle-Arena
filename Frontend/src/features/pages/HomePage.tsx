import React, { useLayoutEffect, useRef, useEffect } from "react";
import { motion } from 'framer-motion';
import {
  Plus, MoveRight, Layers, Cpu, Fingerprint,
  Search, ShieldCheck, Quote, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// GSAP & Smooth Scroll
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis';

// Components (Assuming these exist in your project)
import { Navbar } from "../component/Navbar";
import { Footer } from "../component/Footer";
import { HeroScene } from "../section/HeroScene";
import { HeroSection } from "../section/HeroSection";

gsap.registerPlugin(ScrollTrigger);

/* --- TYPES --- */
interface LeaderboardProps {
  rank: string;
  name: string;
  elo: string | number;
  trend: string;
  active?: boolean;
}

interface FeatureProps {
  icon: React.ReactElement;
  title: string;
  desc: string;
  img?: string;

}

const HomePage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Initialize Smooth Scroll (Lenis)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Content Parallax
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 150,
        opacity: 0,
      });

      // Staggered Reveal for all sections
      const revealOnScroll = (className: string) => {
        gsap.from(className, {
          scrollTrigger: {
            trigger: className,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
      };

      revealOnScroll(".ranking-row");
      revealOnScroll(".bento-item");

      // Magnetic Button Effect
      const magnets = document.querySelectorAll('.magnetic-btn');
      magnets.forEach((btn) => {
        btn.addEventListener('mousemove', (e: any) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-[#050505] text-white selection:bg-white/10 font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="hero-section relative min-h-screen flex flex-col justify-center px-6 md:px-12 overflow-hidden">
          <HeroScene />

          <div className="hero-content max-w-7xl mx-auto w-full pt-20 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-[110px] font-light tracking-[-0.04em] leading-[0.9] mb-10"
            >
              Intelligence <br />
              <span className="font-serif italic opacity-50 text-white">Defined.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl text-white/40 text-lg md:text-xl font-light leading-relaxed mb-12"
            >
              The global benchmark for neural architectures. We evaluate the models that will shape the next decade of computation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="magnetic-btn h-14 px-10 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 group">
                Enter Arena <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="magnetic-btn h-14 px-10 border border-white/10 rounded-full text-sm font-medium hover:bg-white/5 transition-all">
                The Methodology
              </button>
            </motion.div>
          </div>
        </section>

        {/* RANKINGS SECTION */}
        <section className="ranking-section py-20 md:py-32 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">Live Feed: Node_01</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-white">Global Standings</h2>
              <p className="text-white/40 font-light italic font-serif text-base md:text-lg">
                The definitive cross-architecture benchmark.
              </p>
            </div>

            <button
              onClick={() => navigate('/leaderboard')}
              className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors border-b border-white/10 pb-2"
            >
              Full Leaderboard <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-xl md:rounded-sm">
            <LeaderboardPreviewCard rank="01" name="GPT-4o" elo="1284" trend="+12" active />
            <LeaderboardPreviewCard rank="02" name="Claude 3.5" elo="1271" trend="+08" />
            <div
              className="ranking-row bg-[#050505] p-10 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => navigate('/leaderboard')}
            >
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-white/30 transition-all">
                <Plus className="text-white/40" />
              </div>
              <p className="text-xs uppercase tracking-widest text-white/30 font-mono">Explore 150+ Models</p>
            </div>
          </div>
        </section>

        {/* BENTO GRID */}
        <section className="bento-section py-20 md:py-32 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(300px,_auto)]">

            {/* LARGE ITEM: Neural Consistency */}
            <div className="bento-item md:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group">
              {/* Background Image */}
              <img
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop"
                alt="Neural Network"
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
                <Search className="text-white/40 mb-6" size={32} strokeWidth={1} />
                <h3 className="text-3xl md:text-5xl font-light tracking-tight mb-4">Neural Consistency</h3>
                <p className="text-white/40 max-w-sm text-base md:text-lg font-light leading-relaxed">
                  Automated agents simulate production stress and adversarial logic traps.
                </p>
              </div>
            </div>

            {/* MEDIUM ITEM: Verified (White) */}
            <div className="bento-item md:col-span-4 bg-[#242424] rounded-[2rem] md:rounded-[3rem] text-white overflow-hidden relative group">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
                alt="Cyber Security"
                className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
                <Fingerprint size={48} strokeWidth={1} className="text-white/80" />
                <div>
                  <h3 className="text-3xl font-medium tracking-tight mb-2">Verified.</h3>
                  <p className="text-white/40 text-sm leading-relaxed">Cryptographically hashed outcomes stored on-chain.</p>
                </div>
              </div>
            </div>

            {/* SMALL ITEM: Hardware (With Image) */}
            <div className="bento-item md:col-span-4 h-full">
              <FeatureCard
                icon={<Cpu />}
                title="Hardware Parity"
                desc="A100 environments for fair latency benchmarking."
                img="https://images.unsplash.com/photo-1591815302525-756a9bcc3425?q=80&w=1000&auto=format&fit=crop"
              />
            </div>

            {/* SMALL ITEM: Architecture */}
            <div className="bento-item md:col-span-4 h-full">
              <FeatureCard
                icon={<Layers />}
                title="Architecture Agnostic"
                desc="Testing MoE and State-Space models side by side."
                img="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop"
              />
            </div>

            {/* SMALL ITEM: Zero Bias */}
            <div className="bento-item md:col-span-4 h-full">
              <FeatureCard
                icon={<ShieldCheck />}
                title="Zero Bias"
                desc="Models are blinded to their competitors during rounds."
                img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
              />
            </div>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-6">
          <HeroSection />
        </section>

        {/* QUOTE SECTION */}
        <section className="quote-section py-32 md:py-48 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Quote className="mx-auto mb-12 text-white/10" size={48} strokeWidth={1} />
            <h2 className="quote-text text-3xl md:text-5xl font-serif italic font-light leading-tight text-white/80">
              "The Arena isn't just about finding the smartest model; it's about defining the safety boundaries of our digital future."
            </h2>
            <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-white/30">— Dr. Aris Thorne, Lead Researcher</p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 md:py-48 text-center relative px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-[100px] font-light tracking-tighter mb-12 leading-none">
              Step into the <br />
              <span className="opacity-20">next generation.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button className="magnetic-btn h-20 w-full sm:w-auto px-16 bg-white text-black rounded-full text-lg font-medium hover:bg-neutral-200 transition-all">
                Get Early Access
              </button>
              <button className="magnetic-btn h-20 w-full sm:w-auto px-16 border border-white/10 rounded-full text-lg font-medium hover:bg-white/5 transition-all">
                View Docs
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* --- REFINED SUB-COMPONENTS --- */

const LeaderboardPreviewCard = ({ rank, name, elo, trend, active = false }: LeaderboardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/leaderboard')}
      className={`ranking-row group relative p-8 md:p-10 bg-[#050505] transition-all cursor-pointer hover:bg-white/[0.04] ${active ? 'overflow-hidden' : ''}`}
    >
      {active && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      )}

      <div className="flex justify-between items-start mb-12">
        <span className="font-mono text-xs text-white/20">{rank}</span>
        <span className="text-[10px] font-mono text-green-500/80">{trend} ELO</span>
      </div>

      <div>
        <h4 className="text-2xl md:text-3xl font-light tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-500">{name}</h4>
        <div className="flex items-center gap-3">
          <div className="h-px w-4 bg-white/20" />
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Current ELO: {elo}</p>
        </div>
      </div>

      <ArrowUpRight className="absolute bottom-10 right-10 text-white/10 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: FeatureProps) => (
  <div className="rounded-[2rem] md:rounded-[3rem] border border-white/5 p-8 md:p-12 hover:bg-white/[0.02] hover:border-white/10 transition-all group h-full flex flex-col">
    <div className="text-white/20 mb-8 group-hover:text-white group-hover:scale-110 transition-all duration-500">
      {React.cloneElement(icon, { size: 28, strokeWidth: 1 })}
    </div>
    <h3 className="text-xl font-medium mb-4 text-white/80">{title}</h3>
    <p className="text-white/40 text-sm leading-relaxed font-light">{desc}</p>
  </div>
);

export default HomePage;
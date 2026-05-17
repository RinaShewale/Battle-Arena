import React, { useLayoutEffect, useRef, useEffect } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, EyeOff, BarChart3, Cpu, Search, 
  ArrowRight, Shield, Zap, Globe, Layers, Database 
} from 'lucide-react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis';

import { Navbar } from "../component/Navbar";
import { Footer } from "../component/Footer";
import { BackgroundSystem } from "../component/UI/BackgroundSystem";

gsap.registerPlugin(ScrollTrigger);

const HowItWorksPage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, lerp: 0.1 });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(".reveal-item", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
      });

      // Stats Stagger
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });

      // Global Scroll Reveals
      gsap.utils.toArray<HTMLElement>(".step-reveal").forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden">
      <BackgroundSystem />
      <Navbar />

      <main className="relative z-10 pt-32">
        {/* HERO SECTION */}
        <section className="px-6 py-24 max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center">
          <div className="reveal-item">
            <span className="inline-block px-3 py-1 border border-white/10 bg-white/5 text-[9px] font-mono text-zinc-500 uppercase tracking-[0.4em] mb-8">
              System Specification v4.0.1
            </span>
          </div>
          <h1 className="reveal-item text-7xl md:text-[140px] font-extralight tracking-tighter leading-[0.8] mb-12">
            Decoding <br /> 
            <span className="font-serif italic text-zinc-600">Intelligence.</span>
          </h1>
          <p className="reveal-item max-w-2xl text-zinc-500 text-xl md:text-2xl font-light leading-relaxed">
            We’ve built a neutral ground for the world’s most powerful models. 
            Stripping away marketing to reveal raw computational truth.
          </p>

          {/* QUICK STATS */}
          <div className="stats-section mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12">
            <StatItem label="Daily Battles" value="142,000+" />
            <StatItem label="Models Evaluated" value="85" />
            <StatItem label="Human Judges" value="2.4M" />
            <StatItem label="Data Freshness" value="< 6 Hours" />
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className="py-20 px-6 max-w-6xl mx-auto space-y-72">
          
          <ProcessStep 
            num="01" icon={<EyeOff size={22}/>} title="Double-Blind Duals"
            desc="The most dangerous bias is a brand name. We strip all metadata and identifiers. You judge the logic, the tone, and the accuracy—not the logo."
            img="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000"
            align="left"
          />

          <ProcessStep 
            num="02" icon={<Shield size={22}/>} title="Hallucination Shield"
            desc="Every winning response is cross-checked against our neural-guard. We flag logical loops and factual errors that human eyes might miss."
            img="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000"
            align="right"
          />

          <ProcessStep 
            num="03" icon={<BarChart3 size={22}/>} title="The ELO Engine"
            desc="Based on the Glicko-2 ranking system used in Grandmaster Chess. AIs gain prestige by defeating stronger opponents, creating a fluid, merit-based leaderboard."
            img="https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2000"
            align="left"
          />

          <ProcessStep 
            num="04" icon={<Globe size={22}/>} title="Global Consensus"
            desc="Wisdom of the crowd meets expert verification. Thousands of daily interactions converge to define what 'better' actually means for humanity."
            img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000"
            align="right"
          />

        </section>

        {/* TECHNICAL SPECIFICATIONS (BENTO) */}
        <section className="py-40 px-6 max-w-7xl mx-auto">
          <div className="mb-20">
             <h2 className="text-4xl font-light mb-4">Laboratory Infrastructure</h2>
             <p className="text-zinc-500">The invisible layers ensuring total parity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <BentoCard 
                Icon={Cpu} title="Hardware Sync" 
                desc="All models run on identical H100 clusters to ensure latency doesn't influence your vote." 
             />
             <BentoCard 
                Icon={Zap} title="Zero Caching" 
                desc="We bypass model memory. Every prompt is treated as a first-of-its-kind interaction." 
             />
             <BentoCard 
                Icon={Search} title="Prompt Rotation" 
                desc="Our adversarial prompts are updated every 6 hours to prevent training data leakage." 
             />
             <BentoCard 
                Icon={Layers} title="Multi-Modal" 
                desc="Support for vision, code execution, and long-context reasoning battles." 
                className="md:col-span-2"
             />
             <BentoCard 
                Icon={Database} title="Open Data" 
                desc="All battle logs are anonymized and released for public research." 
             />
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-60 text-center relative border-t border-white/5 bg-zinc-900/10">
          <h2 className="text-6xl md:text-9xl font-extralight tracking-tighter mb-16 relative z-10">
            Witness the <br /> <span className="italic font-serif text-zinc-500 text-5xl md:text-8xl">Evolution.</span>
          </h2>
          
          <button 
            onClick={() => navigate('/battlearena')}
            className="group relative px-20 py-8 bg-white text-black rounded-full font-bold text-xl overflow-hidden hover:scale-105 transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-4">
              Enter Battle Arena <ArrowRight strokeWidth={3} />
            </span>
            <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

          <div className="mt-32 opacity-10 flex flex-wrap justify-center gap-10 md:gap-20">
             {["OPENAI", "ANTHROPIC", "GOOGLE", "META", "MISTRAL", "XAI"].map(brand => (
               <span key={brand} className="font-mono text-sm tracking-[0.5em]">{brand}</span>
             ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="stat-item">
    <div className="text-3xl md:text-4xl font-light mb-1 tracking-tighter">{value}</div>
    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{label}</div>
  </div>
);

const BentoCard = ({ Icon, title, desc, className = "" }: any) => (
  <div className={`p-10 border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] hover:bg-white/[0.05] hover:border-white/10 transition-all group ${className}`}>
    <Icon className="text-zinc-600 mb-6 group-hover:text-white transition-colors" size={28} strokeWidth={1.2} />
    <h3 className="text-xl font-medium mb-3 text-zinc-200">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed font-light">{desc}</p>
  </div>
);

const ProcessStep = ({ num, icon, title, desc, align, img }: any) => {
  const imgRef = useRef(null);

  const handleMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    gsap.to(imgRef.current, { 
      rotationY: x * 12, 
      rotationX: -y * 12, 
      transformPerspective: 1200, 
      duration: 0.6,
      ease: "power2.out"
    });
  };

  return (
    <div className={`flex flex-col md:flex-row items-center gap-16 md:gap-24 step-reveal ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
            {icon}
          </div>
          <span className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase bg-white/5 px-3 py-1 rounded">Module {num}</span>
        </div>
        <h3 className="text-5xl md:text-6xl font-extralight mb-8 tracking-tighter leading-tight">{title}</h3>
        <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed">{desc}</p>
      </div>

      <div 
        onMouseMove={handleMove} 
        onMouseLeave={() => gsap.to(imgRef.current, { rotationY: 0, rotationX: 0, duration: 0.8 })} 
        className="flex-[1.4] w-full aspect-[16/10] perspective-1000"
      >
        <div 
          ref={imgRef} 
          className="w-full h-full bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 relative shadow-2xl shadow-white/5"
        >
          <img src={img} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" alt={title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
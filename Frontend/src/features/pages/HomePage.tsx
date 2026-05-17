import React, { useLayoutEffect, useRef, useEffect } from "react";
import { motion } from 'framer-motion';
import {
  Brain, Zap, ShieldCheck, Quote, 
  MessageSquare, Code2, Search, 
  CheckCircle2, Globe
} from 'lucide-react';

// GSAP & Smooth Scroll
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis';

// Components
import { Navbar } from "../component/Navbar";
import { Footer } from "../component/Footer";
import { HeroSection } from "../section/HeroSection"; // This includes HeroScene
import { BackgroundSystem } from "../component/UI/BackgroundSystem";

gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initialize Smooth Scroll (Lenis)
    const lenis = new Lenis({ 
      duration: 1.2, 
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
      // Reveal items as you scroll
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        });
      });
    }, mainRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <BackgroundSystem />
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <Navbar />

      <main>
        {/* 1. HERO SECTION (3D Scene + Main Headlines + Live Feed) */}
        <HeroSection />

        {/* 2. HOW IT WORKS SECTION */}
        <section className="py-32 max-w-7xl mx-auto px-6 border-t border-white/5 relative z-20">
          <div className="mb-24">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.5em] mb-4 block">Process</span>
            <h2 className="text-4xl md:text-6xl font-light mb-6 reveal">How we test the brains.</h2>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl reveal">
              We don't just listen to what AI companies say. We run real-world experiments to see which models actually follow through.
            </p>
          </div>

          <div className="grid grid-cols- 1 md:grid-cols-3 gap-16">
            <StepCard 
              icon={<MessageSquare size={28} className="text-blue-400" />}
              step="01"
              title="Ask anything"
              desc="We give two different AI models the exact same difficult prompt at the same time."
            />
            <StepCard 
              icon={<Search size={28} className="text-purple-400" />}
              step="02"
              title="Compare results"
              desc="Our system looks for mistakes, hallucinations, and how helpful the answer actually is."
            />
            <StepCard 
              icon={<CheckCircle2 size={28} className="text-emerald-400" />}
              step="03"
              title="Pick a winner"
              desc="Real people and automated logic-traps decide which AI wins. No bias, just data."
            />
          </div>
        </section>

        {/* 3. BENTO GRID - CAPABILITIES */}
        <section className="py-32 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Logic Card */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-10 h-[550px] flex flex-col justify-end reveal">
              <div className="absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale" 
                  alt="Abstract Data" 
                />
              </div>
              <div className="relative z-10">
                <Brain className="text-white/40 mb-6" size={48} strokeWidth={1} />
                <h3 className="text-4xl md:text-5xl font-light mb-4">Deep Reasoning</h3>
                <p className="max-w-md text-white/40 text-lg font-light leading-relaxed">
                  We test if an AI can solve complex riddles or if it gets confused by trick questions designed to fool it.
                </p>
              </div>
            </div>

            {/* Coding Card */}
            <div className="md:col-span-4 rounded-[2.5rem] bg-[#111] border border-white/5 p-10 flex flex-col justify-between hover:border-white/20 transition-colors reveal">
              <Code2 size={48} strokeWidth={1} className="text-blue-500/50" />
              <div>
                <h3 className="text-3xl font-light mb-4">Coding Skills</h3>
                <p className="text-white/40 text-base font-light leading-relaxed">
                  We measure how well the AI writes software and fixes bugs in Javascript, Python, and C++.
                </p>
              </div>
            </div>

            {/* Fast Card */}
            <div className="md:col-span-4 rounded-[2rem] border border-white/5 p-8 flex flex-col gap-4 bg-white/[0.01] reveal">
              <Zap className="text-yellow-500/50" size={24} />
              <h4 className="text-lg font-medium">Speed Test</h4>
              <p className="text-sm text-white/40 font-light leading-relaxed">We track response times down to the millisecond.</p>
            </div>

            {/* Security Card */}
            <div className="md:col-span-4 rounded-[2rem] border border-white/5 p-8 flex flex-col gap-4 bg-white/[0.01] reveal">
              <ShieldCheck className="text-emerald-500/50" size={24} />
              <h4 className="text-lg font-medium">Privacy Check</h4>
              <p className="text-sm text-white/40 font-light leading-relaxed">Ensuring the AI handles your data safely and follows ethical rules.</p>
            </div>

            {/* Global Card */}
            <div className="md:col-span-4 rounded-[2rem] border border-white/5 p-8 flex flex-col gap-4 bg-white/[0.01] reveal">
              <Globe className="text-blue-400/50" size={24} />
              <h4 className="text-lg font-medium">Global IQ</h4>
              <p className="text-sm text-white/40 font-light leading-relaxed">Testing intelligence across 40+ languages and cultures.</p>
            </div>

          </div>
        </section>

        {/* 4. QUOTE SECTION */}
        <section className="py-40 border-y border-white/5 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center reveal">
            <Quote className="mx-auto mb-10 text-white/10" size={50} />
            <h2 className="text-3xl md:text-5xl font-serif italic text-white/70 leading-tight">
              "The goal isn't just to find the biggest AI, but the one that actually solves your problems."
            </h2>
            <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-white/30">— The Arena Team</p>
          </div>
        </section>

        {/* 5. FINAL CTA */}
        <section className="py-48 text-center px-6 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 reveal">
            <h2 className="text-6xl md:text-[100px] font-light tracking-tighter leading-[0.9] mb-16">
              Ready to see <br /> <span className="opacity-20">the winners?</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="h-20 px-16 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Enter the Arena
              </button>
              <button className="h-20 px-16 border border-white/10 rounded-full font-medium text-xl hover:bg-white/5 transition-colors">
                View Methodology
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* --- MINI HELPER COMPONENT --- */

const StepCard = ({ icon, step, title, desc }: any) => (
  <div className="flex flex-col reveal">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-mono text-xs text-white/20 tracking-widest">STEP {step}</span>
    </div>
    <h3 className="text-2xl font-light mb-4">{title}</h3>
    <p className="text-white/40 font-light leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;
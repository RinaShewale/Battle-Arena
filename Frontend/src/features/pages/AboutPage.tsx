import { useLayoutEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Shield, MoveRight, Fingerprint, Microscope, Scale 
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Footer } from '../component/Footer';
import { Navbar } from '../component/Navbar';
import { BackgroundSystem } from '../component/UI/BackgroundSystem';

gsap.registerPlugin(ScrollTrigger);

// ... (Rest of component same)
const AboutPage = () => {
  const mainRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });

      gsap.from(".hero-image", {
        scrollTrigger: {
          trigger: ".hero-image",
          start: "top 90%",
          end: "bottom top",
          scrub: true
        },
        scale: 1.1,
        filter: "grayscale(100%)",
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-[#020202] text-white selection:bg-white/20 font-sans overflow-x-hidden">
      <BackgroundSystem />
      <Navbar />

      <main className="relative z-10 pt-48">
        <section className="px-6 max-w-7xl mx-auto mb-60">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8">
              <div className="reveal-item flex items-center gap-3 mb-8">
                <span className="h-[1px] w-8 bg-zinc-800" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-mono">Arena_Protocol_v4</span>
              </div>
              
              <h1 className="reveal-item text-7xl md:text-[140px] font-extralight tracking-tighter leading-[0.8] mb-16">
                The Science <br />
                <span className="font-serif italic text-zinc-600">of Truth.</span>
              </h1>
              
              <p className="reveal-item text-zinc-400 text-xl md:text-2xl font-light leading-relaxed max-w-2xl">
                We believe that intelligence shouldn't be a marketing claim. 
                Arena was founded to replace hype with data, creating a transparent laboratory where the world’s most powerful models prove their worth in real-time.
              </p>
            </div>

            <div className="lg:col-span-4 lg:pt-32">
                <div className="reveal-item space-y-12">
                    <StatBlock label="Battles Processed" value="1.2M+" />
                    <StatBlock label="Success Rate" value="99.98%" />
                    <StatBlock label="Verification Nodes" value="48" />
                </div>
            </div>
          </div>
        </section>

        <section className="px-6 mb-60">
            <div className="max-w-7xl mx-auto h-[600px] rounded-[3rem] overflow-hidden border border-white/5 relative group">
                <img 
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000" 
                    className="hero-image w-full h-full object-cover opacity-60"
                    alt="Abstract data"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                    <h2 className="text-4xl font-light tracking-tight">Neutral Ground.</h2>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">Laboratory Location: Distributed_Cloud</p>
                </div>
            </div>
        </section>

        <section className="px-6 max-w-7xl mx-auto mb-60">
            <div className="grid md:grid-cols-3 gap-6">
                <PillarCard 
                    Icon={Scale}
                    title="Absolute Neutrality"
                    desc="Our systems are air-gapped from Big Tech influence. We do not accept sponsorship from model providers, ensuring every ELO score is earned, not bought."
                />
                <PillarCard 
                    Icon={Fingerprint}
                    title="Adversarial Rigor"
                    desc="We don't just ask easy questions. Our automated red-teaming units inject edge cases and logical paradoxes to find the breaking point of every LLM."
                />
                <PillarCard 
                    Icon={Microscope}
                    title="Atomic Verification"
                    desc="Every vote in the Arena is cross-referenced with 42 distinct quality markers to filter out low-effort or biased human feedback."
                />
            </div>
        </section>

        <section className="py-40 px-6 bg-zinc-900/20 border-y border-white/5 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <Shield className="w-16 h-16 text-zinc-700 mx-auto mb-10" strokeWidth={1} />
                <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-8">The Integrity Protocol</h2>
                <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed italic font-serif">
                    "We pledge to maintain an ecosystem where raw computational performance is the only metric of success. 
                    No model is too famous to fail, and no model is too small to lead."
                </p>
                <div className="mt-12 h-px w-20 bg-zinc-800 mx-auto" />
            </div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-bold text-white/[0.02] select-none pointer-events-none whitespace-nowrap">
                UNBIASED DATA UNBIASED DATA
            </div>
        </section>

        <section className="py-60 px-6 text-center">
            <h3 className="text-5xl md:text-7xl font-extralight tracking-tighter mb-12">Join the Research.</h3>
            <button 
                onClick={() => navigate('/battlearena')}
                className="group inline-flex items-center gap-6 bg-white text-black px-12 py-6 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all active:scale-95"
            >
                Start a Battle
                <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </button>
        </section>

      </main>

      <Footer />
    </div>
  );
};

const StatBlock = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2 font-mono">{label}</p>
        <p className="text-5xl font-light tracking-tighter italic font-serif text-zinc-200">{value}</p>
    </div>
);

const PillarCard = ({ Icon, title, desc }: any) => (
    <div className="p-12 rounded-[2.5rem] bg-zinc-900/10 border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Icon size={120} />
        </div>
        <Icon className="text-zinc-500 mb-8 w-12 h-12 group-hover:text-white transition-colors" strokeWidth={1} />
        <h3 className="text-3xl font-light tracking-tight mb-6 text-zinc-100">{title}</h3>
        <p className="text-zinc-500 leading-relaxed font-light text-lg">
            {desc}
        </p>
    </div>
);

export default AboutPage;
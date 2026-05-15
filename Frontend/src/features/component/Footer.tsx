import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const footerLinks = {
    Platform: ['Benchmarks', 'Neural Arena', 'Pricing', 'Documentation'],
    Science: ['Research', 'Whitepaper', 'Safety', 'Changelog'],
    Network: ['GitHub', 'Discord', 'X / Twitter', 'LinkedIn']
  };

  return (
    <footer className="relative z-10 bg-[#050505] border-t border-white/5 pt-32 pb-12 px-6 overflow-hidden">
      {/* Subtle Background Detail */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Identity Section */}
          <div className="lg:col-span-5 space-y-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                    <div className="w-1 h-4 bg-white/40 rotate-12" />
                 </div>
                 <span className="font-semibold text-xl tracking-tight text-white uppercase">Arena Labs</span>
              </div>
              <p className="text-white/30 text-lg font-light max-w-sm leading-relaxed">
                Defining the standard for high-fidelity <br /> 
                <span className="font-serif italic opacity-80 text-white">neural architecture evaluation.</span>
              </p>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white/20 font-medium mb-8 text-[10px] uppercase tracking-[0.4em]">
                  {title}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-white/40 hover:text-white transition-all text-xs font-light tracking-wide flex items-center group"
                      >
                        {link} <ArrowUpRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-2">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.5em]">
              © 2025 Arena Protocol // All Rights Reserved
            </p>
            <div className="flex gap-6 text-[9px] font-mono text-white/10 tracking-widest uppercase">
               <span>Deploy: 40.7128° N</span>
               <span>Nodes: 14 Global</span>
            </div>
          </div>

          {/* Social Icons - Minimalist Style */}
          <div className="flex items-center gap-3">
            <SocialIcon icon="GH" />
            <SocialIcon icon="TW" />
            <SocialIcon icon="LI" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: string }) => (
  <a 
    href="#" 
    className="w-10 h-10 flex items-center justify-center border border-white/5 rounded-full text-[10px] font-mono text-white/20 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
  >
    {icon}
  </a>
);
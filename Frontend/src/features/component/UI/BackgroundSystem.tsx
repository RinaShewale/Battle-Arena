import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion'; // Added this import to fix the error

export const BackgroundSystem: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const spotlight = spotlightRef.current;
    const container = containerRef.current;

    if (!container || !spotlight || !grid) return;

    // High-performance GSAP setters
    const xSet = gsap.quickSetter(spotlight, "x", "px");
    const ySet = gsap.quickSetter(spotlight, "y", "px");

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      xSet(x);
      ySet(y);

      gsap.to(grid, {
        x: (x - rect.width / 2) * 0.015,
        y: (y - rect.height / 2) * 0.015,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202]">
      {/* 1. Technical Grid */}
      <div 
        ref={gridRef}
        className="absolute inset-[-10%] opacity-[0.15]" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
        }} 
      />

      {/* 2. GSAP Follower Spotlight */}
      <div 
        ref={spotlightRef}
        className="absolute w-[800px] h-[800px] -left-[400px] -top-[400px] bg-white/[0.03] blur-[120px] rounded-full"
      />

      {/* 3. Floating Data Nodes (Fixed motion error) */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.1, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{ 
            duration: Math.random() * 4 + 2, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%` 
          }}
        />
      ))}

      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
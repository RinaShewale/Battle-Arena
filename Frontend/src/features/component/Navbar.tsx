import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoveRight } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo - Architectural & Minimal */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-6 h-6 border border-white flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700">
            <div className="w-2 h-2 bg-white" />
          </div>
          <span className="font-medium text-sm tracking-[0.4em] uppercase text-white">
            BATTLE<span className="opacity-40">ARENA</span>
          </span>
        </Link>

        {/* Center Nav - Spatial Typography */}
        <div className="hidden md:flex items-center gap-10 ">
          <NavLink label="Arena" to="/battlearena" />
          <NavLink label="LEADERBOARD" to="/leaderboard" />
          <NavLink label="Methodology" to="/about" />
        </div>

        {/* Right Side - Clean Action */}
        <div className="flex items-center gap-8">
          <button className="hidden sm:block text-[10px] font-medium text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors">
            Identity
          </button>

          <button className="h-10 px-6 bg-white text-black text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-full flex items-center gap-2 group">
            Join <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ label, to }: { label: string, to: string }) => (
  <Link
    to={to}
   className="relative group text-[15px] font-light text-white/50 hover:text-white uppercase tracking-[0.25em] transition-colors"
  >
    {label}
    <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full group-hover:left-0 opacity-20" />
  </Link>
);
import { Link, useNavigate } from "react-router-dom";
import {
  MoveRight,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

export const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false); // Desktop dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when navigating
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  if (loading) return <nav className="h-20 bg-black border-b border-white/5" />;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO (Desktop & Mobile) */}
          <Link to="/" className="flex items-center gap-3 group z-[1001]" onClick={closeMenu}>
            <div className="w-6 h-6 border border-white flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700">
              <div className="w-2 h-2 bg-white" />
            </div>
            <span className="font-medium text-sm tracking-[0.4em] uppercase text-white">
              BATTLE <span className="opacity-40">ARENA</span>
            </span>
          </Link>

          {/* DESKTOP NAV (Keep Original) */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink label="Home" to="/" />
            <NavLink label="Arena" to="/battlearena" />
            <NavLink label="Leaderboard" to="/leaderboard" />
            <NavLink label="Methodology" to="/about" />
          </div>

          {/* RIGHT SIDE (Keep Original) */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative hidden md:block" ref={menuRef}>
                <button onClick={() => setOpen(!open)} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </button>
                {open && (
                  <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-black shadow-2xl p-2">
                    <button onClick={() => { navigate('/profile'); setOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white/70 hover:bg-white/5 rounded-xl transition-all">
                      <User size={16} /> Profile
                    </button>
                    <button onClick={logout} className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" className="hidden md:block">
                <button className="h-10 px-6 bg-white text-black text-[11px] font-semibold uppercase tracking-widest rounded-full flex items-center gap-2 transition-all">
                  Get Started <MoveRight size={14} />
                </button>
              </Link>
            )}

            {/* MOBILE TOGGLE BUTTON */}
            <button 
              className="md:hidden text-white z-[1001] p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* NEW SIMPLE MOBILE VIEW (Matching 2nd Image) */}
      <div 
        className={`fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center gap-10 text-center">
          <MobileNavLink label="Home" to="/" onClick={closeMenu} />
          <MobileNavLink label="Arena" to="/battlearena" onClick={closeMenu} />
          <MobileNavLink label="Leaderboard" to="/leaderboard" onClick={closeMenu} />
          <MobileNavLink label="Methodology" to="/about" onClick={closeMenu} />
          
          {user ? (
            <>
              <MobileNavLink label="Profile" to="/profile" onClick={closeMenu} />
              <button 
                onClick={() => { logout(); closeMenu(); }}
                className="text-red-500/80 text-2xl font-light tracking-tight mt-4"
              >
               Logout
              </button>
            </>
          ) : (
            <Link to="/register" onClick={closeMenu} className="mt-4">
              <button className="px-12 py-3 bg-gradient-to-b from-[#d35400] to-[#a04000] text-white text-base font-bold rounded-xl shadow-lg active:scale-95 transition-transform border border-white/10">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

// Desktop Link Component (Keep Original)
const NavLink = ({ label, to }: { label: string; to: string }) => (
  <Link
    to={to}
    className="text-[11px] font-light text-white/50 hover:text-white uppercase tracking-[0.25em] transition-colors"
  >
    {label}
  </Link>
);

// New Simple Mobile Link Component
const MobileNavLink = ({ label, to, onClick }: { label: string; to: string; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-3xl font-light text-white hover:text-white/60 transition-colors tracking-tight"
  >
    {label}
  </Link>
);
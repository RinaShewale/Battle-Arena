import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  MoveRight,
  LogOut,
  User,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";

import { useAuth } from "../../auth/AuthContext";

export const Navbar = () => {
  const { user, logout, loading } = useAuth();

  const [open, setOpen] =
    useState(false);



    const navigate = useNavigate();

  const menuRef =
    useRef<HTMLDivElement>(null);

  // CLOSE POPUP ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (
      e: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // GET INITIAL
  const getInitial = () => {
    if (!user) return "U";

    const nameToUse =
      user.name || user.email;

    return nameToUse
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  if (loading) {
    return (
      <nav className="h-20 bg-black border-b border-white/5" />
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-6 h-6 border border-white flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700">
            <div className="w-2 h-2 bg-white" />
          </div>

          <span className="font-medium text-sm tracking-[0.4em] uppercase text-white">
            BATTLE
            <span className="opacity-40">
              ARENA
            </span>
          </span>
        </Link>

        {/* CENTER NAV */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink
            label="Arena"
            to="/battlearena"
          />

          <NavLink
            label="Leaderboard"
            to="/leaderboard"
          />

          <NavLink
            label="Methodology"
            to="/about"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {user && user.email ? (
            <div
              className="relative"
              ref={menuRef}
            >
              {/* PROFILE BUTTON */}
              <button
                onClick={() =>
                  setOpen(!open)
                }
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm hover:scale-105 transition-all"
              >
                {getInitial()}
              </button>

              {/* POPUP */}
              {open && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-[#0d0d0d] backdrop-blur-xl shadow-2xl overflow-hidden">

                  {/* USER INFO */}
                  <div className="px-4 py-4 border-b border-white/5">
                    <p className="text-white text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="text-white/40 text-xs mt-1 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* PROFILE */}
                  <button onClick={() => navigate('/profile')} className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white/70 hover:bg-white/5 transition-all">
                    <User size={16} />
                    Profile
                  </button>

                  {/* LOGOUT */}
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/register">
              <button className="h-10 px-6 bg-white text-black text-[11px] font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-full flex items-center gap-2 group">
                Get Started

                <MoveRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({
  label,
  to,
}: {
  label: string;
  to: string;
}) => (
  <Link
    to={to}
    className="relative group text-[11px] font-light text-white/50 hover:text-white uppercase tracking-[0.25em] transition-colors"
  >
    {label}

    <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full group-hover:left-0 opacity-20" />
  </Link>
);
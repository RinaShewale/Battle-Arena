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

  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Prevent body scroll when mobile menu opens
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen
      ? "hidden"
      : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group z-[1001]"
            onClick={closeMenu}
          >
            <div className="w-6 h-6 border border-white flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700">
              <div className="w-2 h-2 bg-white" />
            </div>

            <span className="font-medium text-sm tracking-[0.4em] uppercase text-white">
              BATTLE <span className="opacity-40">ARENA</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink label="Home" to="/" />
            <NavLink label="Arena" to="/battlearena" />
            <NavLink label="Leaderboard" to="/leaderboard" />
            <NavLink label="Methodology" to="/about" />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* LOADING STATE */}
            {loading ? (
              <div className="hidden md:flex w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div
                className="relative hidden md:block"
                ref={menuRef}
              >
                <button
                  onClick={() => setOpen(!open)}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-black shadow-2xl p-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-white/70 hover:bg-white/5 rounded-xl transition-all"
                    >
                      <User size={16} />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" className="hidden md:block">
                <button className="h-10 px-6 bg-white text-black text-[11px] font-semibold uppercase tracking-widest rounded-full flex items-center gap-2 transition-all hover:scale-105">
                  Get Started
                  <MoveRight size={14} />
                </button>
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-white z-[1001] p-2"
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
            >
              {isMobileMenuOpen ? (
                <X size={32} strokeWidth={1.5} />
              ) : (
                <Menu size={28} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center gap-10 text-center">
          <MobileNavLink
            label="Home"
            to="/"
            onClick={closeMenu}
          />

          <MobileNavLink
            label="Arena"
            to="/battlearena"
            onClick={closeMenu}
          />

          <MobileNavLink
            label="Leaderboard"
            to="/leaderboard"
            onClick={closeMenu}
          />

          <MobileNavLink
            label="Methodology"
            to="/about"
            onClick={closeMenu}
          />

          {loading ? (
            <div className="w-32 h-12 rounded-xl bg-white/10 animate-pulse mt-4" />
          ) : user ? (
            <>
              <MobileNavLink
                label="Profile"
                to="/profile"
                onClick={closeMenu}
              />

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="text-red-500/80 text-2xl font-light tracking-tight mt-4"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={closeMenu}
              className="mt-4"
            >
              <button className="px-12 py-3 bg-[#406ea9] text-white text-base font-bold rounded-xl shadow-lg active:scale-95 transition-transform border border-white/10">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

/* DESKTOP NAV LINK */
const NavLink = ({
  label,
  to,
}: {
  label: string;
  to: string;
}) => (
  <Link
    to={to}
    className="text-[11px] font-light text-white/50 hover:text-white uppercase tracking-[0.25em] transition-colors"
  >
    {label}
  </Link>
);

/* MOBILE NAV LINK */
const MobileNavLink = ({
  label,
  to,
  onClick,
}: {
  label: string;
  to: string;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-3xl font-light text-white hover:text-white/60 transition-colors tracking-tight"
  >
    {label}
  </Link>
);
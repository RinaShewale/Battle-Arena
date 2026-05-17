import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

/* ✅ IMPORT FROM CONTEXT */
import { useAuth } from "../auth/AuthContext";

import { googleLogin } from "../services/auth.api";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------- EMAIL LOGIN ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);

      /* ✅ NAVIGATE AFTER LOGIN */
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            Welcome back
          </h1>

          <p className="text-slate-400 text-sm">
            Please enter your details to sign in to your account.
          </p>
        </div>

        <div className="space-y-6">
          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-lg flex items-center justify-center gap-3 text-sm font-medium hover:bg-white/[0.06] transition-all active:scale-[0.98]"
          >
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>

            <span className="relative px-4 text-[10px] uppercase tracking-widest text-slate-500 bg-[#050505]">
              or continue with email
            </span>
          </div>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1">
                Email Address
              </label>

              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors"
                  size={16}
                />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1">
                Password
              </label>

              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors"
                  size={16}
                />

                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={isLoading}
              className="w-full h-11 bg-white text-black rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white hover:underline underline-offset-4 transition-all font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
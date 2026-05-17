import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { googleLogin } from "../services/auth.api";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------- EMAIL REGISTER ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleSignup = () => {
    googleLogin(); // redirect to backend
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* background (UNCHANGED) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/[0.02] mb-6">
            <ShieldCheck className="text-white/80" size={24} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            Create an account
          </h1>

          <p className="text-slate-400 text-sm">
            Join our community and start building today.
          </p>
        </div>

        <div className="space-y-6">

          {/* ---------------- GOOGLE BUTTON FIXED ---------------- */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-lg flex items-center justify-center gap-3 text-sm font-medium hover:bg-white/[0.06] transition-all"
          >
            Sign up with Google
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <span className="relative px-4 text-[10px] uppercase tracking-widest text-slate-500 bg-[#050505]">
              or provide details
            </span>
          </div>

          {/* ---------------- FORM ---------------- */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1">
                Username
              </label>

              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={16} />

                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="yourname"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1">
                Email Address
              </label>

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={16} />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1">
                Password
              </label>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={16} />

                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={isLoading}
              className="w-full h-11 bg-white text-black rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:underline underline-offset-4 transition-all font-medium"
            >
              Log in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;
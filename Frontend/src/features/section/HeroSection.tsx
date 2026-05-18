import { motion } from "framer-motion";
import { MoveRight, Zap, Brain, MessageSquare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroScene } from "./HeroScene";
import { BackgroundSystem } from "../component/UI/BackgroundSystem";
import { useEffect, useState } from "react";
import { getBattlesAPI } from "../../services/battle.api";

export const HeroSection = () => {
  const navigate = useNavigate();

  // 🔥 ONLY ONE LATEST BATTLE
  const [latestBattle, setLatestBattle] = useState<any | null>(null);

  // 🔥 FETCH LATEST BATTLE
  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const res = await getBattlesAPI();

        const latest = (res?.battles || [])
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )[0]; // 👈 ONLY ONE

        setLatestBattle(latest || null);
      } catch (err) {
        console.log("Live feed error:", err);
      }
    };

    fetchBattle();

    // 🔥 LIVE UPDATE
    const interval = setInterval(fetchBattle, 5000);

    return () => clearInterval(interval);
  }, []);

  const winner = latestBattle
    ? latestBattle.solution_1_score > latestBattle.solution_2_score
      ? "Mistral"
      : latestBattle.solution_2_score > latestBattle.solution_1_score
      ? "Cohere"
      : "Tie"
    : null;

  return (
    <section className="relative min-h-screen flex items-center bg-[#050505] text-white overflow-hidden">
      <BackgroundSystem />

      <HeroScene />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]" />

      <div className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-16 relative z-20 pt-20">

        {/* LEFT SIDE */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div className="flex items-center gap-3 mb-8">
            <div className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10">
              <span className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                <Sparkles size={12} /> Live Lab Active
              </span>
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-[110px] font-extralight leading-[0.85] tracking-tighter mb-10">
            Find the AI <br />
            <span className="font-serif italic text-white/30">
              that fits you.
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-lg mb-12 font-light leading-relaxed">
            Stop guessing which AI is better. We test them side-by-side.
          </p>

          <div className="flex flex-wrap gap-5">
            <button
              onClick={() => navigate("/battlearena")}
              className="h-16 px-10 bg-white text-black rounded-full font-semibold flex items-center gap-3 hover:scale-105 transition-all"
            >
              Start Your Test <MoveRight size={18} />
            </button>

            <button
              onClick={() => navigate("/working")}
              className="h-16 px-8 border border-white/10 rounded-full text-white/70 hover:bg-white/5"
            >
              How it works
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 justify-center">

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={<Brain size={20} className="text-blue-400" />}
              label="AIs Tested"
              value="1,402"
            />
            <MetricCard
              icon={<MessageSquare size={20} className="text-emerald-400" />}
              label="Daily Battles"
              value="89.4k"
            />
          </div>

          {/* 🔥 SINGLE LIVE FEED */}
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] relative overflow-hidden">

            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Live Activity Feed
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* ONLY ONE ITEM */}
            <div className="space-y-4">
              {!latestBattle && (
                <p className="text-white/30 text-xs">
                  Loading latest battle...
                </p>
              )}

              {latestBattle && (
                <BattleLogItem
                  AI1="Mistral"
                  AI2="Cohere"
                  status={
                    winner === "Tie"
                      ? "Draw Match"
                      : `Winner: ${winner}`
                  }
                  winner={winner !== "Tie"}
                />
              )}
            </div>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- COMPONENTS ---------- */

const MetricCard = ({ icon, label, value }: any) => (
  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
    <div className="mb-4">{icon}</div>
    <div className="text-[10px] text-white/30 uppercase">{label}</div>
    <div className="text-3xl font-light">{value}</div>
  </div>
);

const BattleLogItem = ({ AI1, AI2, status, winner = false }: any) => (
  <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
    <div className="flex justify-between text-[11px] font-mono">
      <span className="text-white/70">
        {AI1} <span className="text-white/20">VS</span> {AI2}
      </span>
      <span className={winner ? "text-emerald-400" : "text-white/40"}>
        {status}
      </span>
    </div>

    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: winner ? "0%" : "20%" }}
        transition={{ duration: 2, repeat: winner ? 0 : Infinity }}
        className={`h-full w-full ${
          winner ? "bg-emerald-500/50" : "bg-blue-500/50"
        }`}
      />
    </div>
  </div>
);
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Trophy,
  Brain,
  Zap,
  BarChart3,
  RefreshCw,
} from "lucide-react";

import { Navbar } from "../component/Navbar";
import { Footer } from "../component/Footer";
import { BackgroundSystem } from "../component/UI/BackgroundSystem";
import { getBattlesAPI } from "../../services/battle.api";

type Battle = {
  _id: string;
  solution_1_score: number;
  solution_2_score: number;
  createdAt: string;
};

type LeaderboardModel = {
  rank: string;
  name: string;
  score: number;
  wins: number;
  battles: number;
  category: string;
};

export const LeaderboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<LeaderboardModel[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await getBattlesAPI();
      const battles: Battle[] = (res?.battles || []).sort(
        (a: Battle, b: Battle) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      let mistralWins = 0;
      let cohereWins = 0;

      battles.forEach((battle) => {
        if (battle.solution_1_score > battle.solution_2_score) mistralWins++;
        if (battle.solution_2_score > battle.solution_1_score) cohereWins++;
      });

      const latestBattle = battles[0];
      const leaderboardData: LeaderboardModel[] = [
        {
          rank: "01",
          name: "Mistral",
          score: latestBattle?.solution_1_score || 0,
          wins: mistralWins,
          battles: battles.length,
          category: "Reasoning",
        },
        {
          rank: "02",
          name: "Cohere",
          score: latestBattle?.solution_2_score || 0,
          wins: cohereWins,
          battles: battles.length,
          category: "Code",
        },
      ].sort((a, b) => b.score - a.score);

      leaderboardData.forEach((model, index) => {
        model.rank = (index + 1).toString().padStart(2, "0");
      });

      setModels(leaderboardData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const topModel = useMemo(() => models[0], [models]);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100">
      <BackgroundSystem />
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        {/* SIMPLE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <Brain size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Neural Rankings</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">Arena Leaderboard</h1>
          </div>
          <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Last Updated: Live
          </div>
        </header>

        {/* CHAMPION HERO - Simple & Clean */}
        {topModel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                <Trophy size={32} />
              </div>
              <div>
                <span className="text-yellow-500 text-[10px] uppercase tracking-widest font-bold">Top Performer</span>
                <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter">{topModel.name}</h2>
                <p className="text-zinc-500 text-xs uppercase mt-1 tracking-widest">{topModel.category}</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-6xl md:text-8xl font-thin font-mono leading-none">{topModel.score}</div>
              <div className="flex items-center justify-center md:justify-end gap-2 text-emerald-500 text-sm mt-2">
                <TrendingUp size={16} />
                <span>{topModel.wins} Wins Total</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TABLE HEADINGS - Desktop Only */}
        <div className="hidden md:grid grid-cols-12 px-8 py-4 text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white/5">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Model</div>
          <div className="col-span-2 text-center">Wins</div>
          <div className="col-span-2 text-center">Battles</div>
          <div className="col-span-2 text-right">Latest Score</div>
        </div>

        {/* LIST */}
        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="animate-spin text-zinc-700" />
            </div>
          ) : (
            models.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 items-center p-6 md:px-8 md:py-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
              >
                {/* Rank */}
                <div className="hidden md:block col-span-1 font-mono text-zinc-500">{model.rank}</div>

                {/* Name & Info */}
                <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium uppercase tracking-tight">{model.name}</h3>
                    <div className="md:hidden text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Rank {model.rank} • {model.category}</div>
                    <div className="hidden md:block text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">{model.category}</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 md:contents mt-6 pt-6 border-t border-white/5 md:mt-0 md:pt-0 md:border-0">
                  <div className="md:col-span-2 text-left md:text-center">
                    <span className="md:hidden block text-[9px] text-zinc-600 uppercase mb-1">Wins</span>
                    <span className="text-emerald-500 font-mono text-xl">{model.wins}</span>
                  </div>
                  <div className="md:col-span-2 text-center">
                    <span className="md:hidden block text-[9px] text-zinc-600 uppercase mb-1">Battles</span>
                    <span className="text-zinc-400 font-mono text-xl">{model.battles}</span>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <span className="md:hidden block text-[9px] text-zinc-600 uppercase mb-1">Score</span>
                    <span className="text-white font-mono text-xl md:text-2xl font-light">{model.score}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
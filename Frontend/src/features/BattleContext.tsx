import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createBattleAPI,
  getBattlesAPI,
  judgeBattleAPI,
} from "../services/battle.api";

// ================= TYPES =================
export type Battle = {
  _id: string;
  problem: string;
  solution_1: string;
  solution_2: string;
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
  winner: string;
  createdAt?: string;
};

type BattleContextType = {
  battles: Battle[];
  loading: boolean;
  createBattle: (problem: string) => Promise<{ success: boolean; battle?: Battle }>;
  judgeBattle: (battleId: string, winner: "A" | "B") => Promise<{ success: boolean; battle?: Battle }>;
  refreshBattles: () => Promise<void>;
};

// ================= CONTEXT =================
export const BattleContext =
  createContext<BattleContextType | undefined>(undefined);

// ================= PROVIDER =================
export const BattleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD =================
  const refreshBattles = async () => {
    try {
      setLoading(true);

      const res = await getBattlesAPI();

      if (res?.success) {
        setBattles(res.battles || []);
      }
    } catch (error) {
      console.log("GET BATTLES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE =================
  const createBattle = async (problem: string) => {
    try {
      setLoading(true);

      const res = await createBattleAPI(problem);

      if (res?.success && res.battle) {
        setBattles((prev) => [res.battle, ...prev]);
      }

      return res;
    } catch (error) {
      console.log("CREATE BATTLE ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ================= JUDGE (user vote) =================
  const judgeBattle = async (battleId: string, winner: "A" | "B") => {
    try {
      const res = await judgeBattleAPI(battleId, winner);

      if (res?.success && res.battle) {
        setBattles((prev) =>
          prev.map((b) => (b._id === battleId ? res.battle : b))
        );
      }

      return res;
    } catch (error) {
      console.log("JUDGE BATTLE ERROR:", error);
      throw error;
    }
  };

  useEffect(() => {
    refreshBattles();
  }, []);

  return (
    <BattleContext.Provider
      value={{
        battles,
        loading,
        createBattle,
        judgeBattle,
        refreshBattles,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};

export const useBattleContext = () => {
  const ctx = useContext(BattleContext);
  if (!ctx) {
    throw new Error("useBattleContext must be used within BattleProvider");
  }
  return ctx;
};
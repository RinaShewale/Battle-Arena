import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  appendBattleMessageAPI,
  createBattleAPI,
  deleteBattleAPI,
  getBattlesAPI,
  judgeBattleAPI,
  renameBattleAPI,
} from "../services/battle.api";
import type { BattleMessagePayload } from "../types/battleMessage";

export type BattleTurn = {
  _id?: string;
  message: string;
  solution_1: string;
  solution_2: string;
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
};

export type Battle = {
  _id: string;
  title?: string;
  problem: string;
  solution_1: string;
  solution_2: string;
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
  winner: string;
  turns?: BattleTurn[];
  createdAt?: string;
};

export const getBattleTurns = (battle: Battle): BattleTurn[] => {
  if (battle.turns?.length) {
    return battle.turns;
  }

  return [
    {
      message: battle.problem,
      solution_1: battle.solution_1,
      solution_2: battle.solution_2,
      solution_1_score: battle.solution_1_score,
      solution_2_score: battle.solution_2_score,
      solution_1_reasoning: battle.solution_1_reasoning,
      solution_2_reasoning: battle.solution_2_reasoning,
    },
  ];
};

export const getBattleTitle = (battle: Battle): string => {
  if (battle.title?.trim()) {
    return battle.title.trim();
  }

  const fallback = battle.problem || getBattleTurns(battle)[0]?.message || "";

  if (!fallback) {
    return "Untitled chat";
  }

  return fallback.length > 48 ? `${fallback.slice(0, 48)}…` : fallback;
};

type BattleContextType = {
  battles: Battle[];
  loading: boolean;
  createBattle: (
    payload: BattleMessagePayload
  ) => Promise<{ success: boolean; battle?: Battle }>;
  appendBattleMessage: (
    battleId: string,
    payload: BattleMessagePayload
  ) => Promise<{ success: boolean; battle?: Battle }>;
  judgeBattle: (
    battleId: string,
    winner: "A" | "B"
  ) => Promise<{ success: boolean; battle?: Battle }>;
  renameBattle: (
    battleId: string,
    title: string
  ) => Promise<{ success: boolean; battle?: Battle }>;
  deleteBattle: (battleId: string) => Promise<{ success: boolean }>;
  refreshBattles: () => Promise<void>;
};

export const BattleContext =
  createContext<BattleContextType | undefined>(undefined);

export const BattleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(false);

  const updateBattleInList = (battle: Battle) => {
    setBattles((prev) =>
      prev.map((b) => (b._id === battle._id ? battle : b))
    );
  };

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

  const createBattle = async (payload: BattleMessagePayload) => {
    try {
      setLoading(true);

      const res = await createBattleAPI(payload);

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

  const appendBattleMessage = async (
    battleId: string,
    payload: BattleMessagePayload
  ) => {
    try {
      const res = await appendBattleMessageAPI(battleId, payload);

      if (res?.success && res.battle) {
        updateBattleInList(res.battle);
      }

      return res;
    } catch (error) {
      console.log("APPEND MESSAGE ERROR:", error);
      throw error;
    }
  };

  const judgeBattle = async (battleId: string, winner: "A" | "B") => {
    try {
      const res = await judgeBattleAPI(battleId, winner);

      if (res?.success && res.battle) {
        updateBattleInList(res.battle);
      }

      return res;
    } catch (error) {
      console.log("JUDGE BATTLE ERROR:", error);
      throw error;
    }
  };

  const renameBattle = async (battleId: string, title: string) => {
    try {
      const res = await renameBattleAPI(battleId, title);

      if (res?.success && res.battle) {
        updateBattleInList(res.battle);
      }

      return res;
    } catch (error) {
      console.log("RENAME BATTLE ERROR:", error);
      throw error;
    }
  };

  const deleteBattle = async (battleId: string) => {
    try {
      const res = await deleteBattleAPI(battleId);

      if (res?.success) {
        setBattles((prev) => prev.filter((b) => b._id !== battleId));
      }

      return res;
    } catch (error) {
      console.log("DELETE BATTLE ERROR:", error);
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
        appendBattleMessage,
        judgeBattle,
        renameBattle,
        deleteBattle,
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

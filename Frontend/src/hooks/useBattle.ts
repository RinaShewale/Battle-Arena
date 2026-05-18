import { useEffect, useState } from "react";
import {
  appendBattleMessageAPI,
  createBattleAPI,
  deleteBattleAPI,
  getBattlesAPI,
  renameBattleAPI,
} from "../services/battle.api";
import type { BattleMessagePayload } from "../types/battleMessage";

export const useBattle = () => {
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBattles = async () => {
    try {
      setLoading(true);
      const res = await getBattlesAPI();
      setBattles(res.battles || []);
    } catch (err) {
      console.log("LOAD ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBattles();
  }, []);

  const createBattle = async (payload: BattleMessagePayload) => {
    try {
      setLoading(true);
      const res = await createBattleAPI(payload);

      setBattles((prev) => [res.battle, ...prev]);

      return res;
    } catch (err) {
      console.log("CREATE ERROR", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const appendBattleMessage = async (
    battleId: string,
    payload: BattleMessagePayload
  ) => {
    try {
      setLoading(true);
      const res = await appendBattleMessageAPI(battleId, payload);

      if (res?.success && res.battle) {
        setBattles((prev) =>
          prev.map((b) => (b._id === battleId ? res.battle : b))
        );
      }

      return res;
    } catch (err) {
      console.log("APPEND ERROR", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const renameBattle = async (battleId: string, title: string) => {
    try {
      const res = await renameBattleAPI(battleId, title);
      if (res?.success && res.battle) {
        setBattles((prev) =>
          prev.map((b) => (b._id === battleId ? res.battle : b))
        );
      }
      return res;
    } catch (err) {
      console.log("RENAME ERROR", err);
      throw err;
    }
  };

  const deleteBattle = async (battleId: string) => {
    try {
      const res = await deleteBattleAPI(battleId);
      if (res?.success) {
        setBattles((prev) => prev.filter((b) => b._id !== battleId));
      }
      return res;
    } catch (err) {
      console.log("DELETE ERROR", err);
      throw err;
    }
  };

  return {
    battles,
    loading,
    createBattle,
    appendBattleMessage,
    renameBattle,
    deleteBattle,
    refresh: loadBattles,
  };
};

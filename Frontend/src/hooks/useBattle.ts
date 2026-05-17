import { useEffect, useState } from "react";
import { createBattleAPI, getBattlesAPI } from "../services/battle.api";

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

  const createBattle = async (problem: string) => {
    try {
      setLoading(true);
      const res = await createBattleAPI(problem);

      setBattles((prev) => [res.battle, ...prev]);

      return res;
    } catch (err) {
      console.log("CREATE ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    battles,
    loading,
    createBattle,
    refresh: loadBattles,
  };
};
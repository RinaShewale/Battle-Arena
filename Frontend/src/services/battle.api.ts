import api from "./api";

import type { BattleMessagePayload } from "../types/battleMessage";

export const createBattleAPI = async (payload: BattleMessagePayload) => {
  const res = await api.post("/battle", payload);
  return res.data;
};

export const getBattlesAPI = async () => {
  const res = await api.get("/battle");
  return res.data;
};

export const appendBattleMessageAPI = async (
  battleId: string,
  payload: BattleMessagePayload
) => {
  const res = await api.post(`/battle/${battleId}/message`, payload);
  return res.data;
};

export const webSearchAPI = async (query: string, enabled: boolean) => {
  const res = await api.post("/battle/web-search", { query, enabled });
  return res.data;
};

export const renameBattleAPI = async (
  battleId: string,
  title: string
) => {
  const res = await api.patch(`/battle/${battleId}`, { title });
  return res.data;
};

export const deleteBattleAPI = async (battleId: string) => {
  const res = await api.delete(`/battle/${battleId}`);
  return res.data;
};

export const judgeBattleAPI = async (battleId: string, winner: "A" | "B") => {
  const res = await api.post(`/battle/judge/${battleId}`, {
    winner,
  });
  return res.data;
};

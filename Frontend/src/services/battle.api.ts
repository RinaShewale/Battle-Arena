import api from "./api";



export const createBattleAPI = async (problem: string) => {
  const res = await api.post("/battle", { problem });
  return res.data;
};

export const getBattlesAPI = async () => {
  const res = await api.get("/battle");
  return res.data;
};



export const judgeBattleAPI = async (battleId: string, winner: "A" | "B") => {
  const res = await api.post(`/battle/judge/${battleId}`, {
    winner,
  });
  return res.data;
};
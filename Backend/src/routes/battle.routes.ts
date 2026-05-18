import express from "express";

import { protect } from "../middlewares/auth.middleware.js";

import {
  appendBattleMessage,
  createBattle,
  deleteBattle,
  getBattles,
  judgeBattle,
  renameBattle,
  webSearch,
} from "../controllers/battle.controller.js";

const router = express.Router();

/* 🔐 All routes protected */
router.post("/", protect, createBattle);

router.post("/web-search", protect, webSearch);

router.get("/", protect, getBattles);

router.post("/judge/:id", protect, judgeBattle);

router.post("/:id/message", protect, appendBattleMessage);

router.patch("/:id", protect, renameBattle);

router.delete("/:id", protect, deleteBattle);

export default router;
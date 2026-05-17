import express from "express";

import {
  createBattle,
  getBattles,
  judgeBattle,
} from "../controllers/battle.controller.js";

const router = express.Router();

router.post("/", createBattle);

router.get("/", getBattles);

router.post("/judge/:id", judgeBattle);

export default router;
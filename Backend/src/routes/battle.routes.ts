import express from "express";

import {
  createBattle,
  getBattles,
} from "../controllers/battle.controller.js";

const router = express.Router();

router.post("/", createBattle);

router.get("/", getBattles);

export default router;
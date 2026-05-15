import express from "express";
import type { Request, Response } from "express";

import cors from "cors";
import passport from "passport";

import runGraph from "../src/ai/graph.ai.js";

import authRoutes from "../src/routes/auth.routes.js";
import battleRoutes from "../src/routes/battle.routes.js";

import "../src/config/passport.js"; // 🔥 IMPORTANT (register google strategy)

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(passport.initialize()); // 🔥 IMPORTANT

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req: Request, res: Response) => {
  res.send("Battle Arena API Running 🚀");
});

/* ---------------- TEST AI ---------------- */
app.get("/test-ai", async (req: Request, res: Response) => {
  try {
    const result = await runGraph(
      "Write a function to reverse a string in JavaScript"
    );

    console.log("🔥 RESULT:", JSON.stringify(result, null, 2));

    res.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/battle", battleRoutes);

export default app;
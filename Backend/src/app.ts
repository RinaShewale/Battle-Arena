import express from "express";
import type { Request, Response } from "express";

import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";

import runGraph from "../src/ai/graph.ai.js";

import authRoutes from "../src/routes/auth.routes.js";
import battleRoutes from "../src/routes/battle.routes.js";

import "../src/config/passport.js";

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(morgan("dev"));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://battle-arena-589s.onrender.com/"
    ],
    credentials: true
  })
);

app.use(passport.initialize());

/* ---------------- API ROUTES ---------------- */

app.get("/", (req: Request, res: Response) => {
  res.send("Battle Arena API Running 🚀");
});

app.get("/test-ai", async (req: Request, res: Response) => {
  try {
    const result = await runGraph(
      "Write a function to reverse a string in JavaScript"
    );

    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/battle", battleRoutes);

/* ---------------- FRONTEND (RENDER SETUP) ---------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// adjust path depending on your build structure
const frontendPath = path.join(__dirname, "../../Frontend/dist");

// serve static files
app.use(express.static(frontendPath));

// React fallback (IMPORTANT FIX)
app.get("*name", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
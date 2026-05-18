import type { Request, Response } from "express";

import runGraph from "../ai/graph.ai.js";
import { generateBattleTitle } from "../ai/title.ai.js";
import { describeImage } from "../ai/vision.ai.js";
import { searchInternet } from "../ai/tavily.ai.js";

import Battle from "../models/battle.model.js";

import {
  buildConversationContext,
  createTurnFromGraphResult,
  enrichMessage,
  syncBattleLatestFields,
  type MessageAttachments,
} from "../services/battle.service.js";

/* ---------------- SAFE ID HELPER ---------------- */
const getSafeId = (id: unknown): string | null => {
  if (typeof id !== "string") return null;
  return id.trim() || null;
};

/* ---------------- USER HELPER ---------------- */
const getUserId = (req: Request): string => {
  return (req as any).user?.id;
};

/* ---------------- SMART WEB ROUTER ---------------- */
const shouldUseWebSearch = (query: string) => {
  const q = query.toLowerCase();

  return (
    q.includes("latest") ||
    q.includes("news") ||
    q.includes("today") ||
    q.includes("current") ||
    q.includes("price") ||
    q.includes("rate") ||
    q.includes("2026") ||
    q.includes("who is") ||
    q.includes("what is") ||
    q.includes("stock") ||
    q.includes("live")
  );
};

/* ---------------- ATTACHMENTS ---------------- */
const parseAttachments = async (
  body: Record<string, unknown>
): Promise<MessageAttachments | undefined> => {
  const attachments: MessageAttachments = {};

  if (typeof body.fileName === "string" && body.fileName.trim()) {
    attachments.fileName = body.fileName;
  }

  if (typeof body.fileContent === "string" && body.fileContent.trim()) {
    attachments.fileContent = body.fileContent;
  }

  if (typeof body.imageName === "string" && body.imageName.trim()) {
    attachments.imageName = body.imageName;
  }

  if (typeof body.imageDataUrl === "string" && body.imageDataUrl.trim()) {
    attachments.imageDataUrl = body.imageDataUrl;

    attachments.imageDescription = await describeImage(
      body.imageDataUrl,
      attachments.imageName ?? "image"
    );
  }

  if (typeof body.webSearchResult === "string" && body.webSearchResult.trim()) {
    attachments.webSearchResult = body.webSearchResult;
  }

  return Object.keys(attachments).length ? attachments : undefined;
};

/* ---------------- MESSAGE ---------------- */
const getRawMessage = (body: Record<string, unknown>): string => {
  const message =
    typeof body.message === "string"
      ? body.message
      : typeof body.problem === "string"
      ? body.problem
      : "";

  return message.trim();
};

/* =========================================================
   CREATE BATTLE
========================================================= */
export const createBattle = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const rawMessage = getRawMessage(req.body);

    if (!rawMessage) {
      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const attachments = await parseAttachments(req.body);

    /* -------- WEB SEARCH (SMART) -------- */
    let webResults = "";

    if (shouldUseWebSearch(rawMessage)) {
      webResults = await searchInternet({ query: rawMessage });
    }

    /* -------- FINAL CONTEXT -------- */
    const enrichedProblem = enrichMessage(
      `
USER QUESTION:
${rawMessage}

${webResults ? `LATEST WEB RESULTS:\n${webResults}` : ""}

INSTRUCTIONS:
- Use web data if available
- Otherwise use reasoning
      `,
      attachments
    );

    const result = await runGraph(enrichedProblem);

    const turn = createTurnFromGraphResult(rawMessage, result);

    let title = await generateBattleTitle(rawMessage);
    if (!title) title = rawMessage.slice(0, 40);

    const battle = await Battle.create({
      userId,
      title: title.trim(),
      problem: rawMessage,

      turns: [
        {
          message: rawMessage,
          solution_1: turn.solution_1,
          solution_2: turn.solution_2,
          solution_1_score: turn.solution_1_score ?? 0,
          solution_2_score: turn.solution_2_score ?? 0,
          solution_1_reasoning: turn.solution_1_reasoning,
          solution_2_reasoning: turn.solution_2_reasoning,
        },
      ],

      solution_1: turn.solution_1,
      solution_2: turn.solution_2,
      solution_1_score: turn.solution_1_score ?? 0,
      solution_2_score: turn.solution_2_score ?? 0,
      solution_1_reasoning: turn.solution_1_reasoning,
      solution_2_reasoning: turn.solution_2_reasoning,

      winner:
        turn.solution_1_score > turn.solution_2_score
          ? "Mistral"
          : turn.solution_2_score > turn.solution_1_score
          ? "Cohere"
          : "Tie",
    });

    return res.status(201).json({ success: true, battle });
  } catch (error) {
    console.log("CREATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Battle failed",
    });
  }
};

/* =========================================================
   APPEND MESSAGE
========================================================= */
export const appendBattleMessage = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const id = getSafeId(req.params.id);
    const rawMessage = getRawMessage(req.body);

    if (!id || !rawMessage) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    const battle = await Battle.findOne({ _id: id, userId });
    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    const attachments = await parseAttachments(req.body);

    /* -------- WEB SEARCH (SMART) -------- */
    let webResults = "";

    if (shouldUseWebSearch(rawMessage)) {
      webResults = await searchInternet({ query: rawMessage });
    }

    const enrichedMessage = enrichMessage(
      `
USER QUESTION:
${rawMessage}

${webResults ? `LATEST WEB RESULTS:\n${webResults}` : ""}
      `,
      attachments
    );

    const context = buildConversationContext(battle, enrichedMessage);

    const result = await runGraph(context);

    const turn = createTurnFromGraphResult(rawMessage, result);

    battle.turns = battle.turns || [];
    battle.turns.push(turn);

    syncBattleLatestFields(battle, turn);

    battle.winner = "";

    await battle.save();

    return res.status(200).json({ success: true, battle });
  } catch (error) {
    console.log("APPEND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to append message",
    });
  }
};

/* =========================================================
   OTHER APIs (UNCHANGED)
========================================================= */

export const getBattles = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const battles = await Battle.find({ userId }).sort({ createdAt: -1 });
  return res.status(200).json({ success: true, battles });
};

export const renameBattle = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = getSafeId(req.params.id);
  const { title } = req.body;

  const battle = await Battle.findOne({ _id: id, userId });
  if (!battle)
    return res.status(404).json({ success: false, message: "Not found" });

  battle.title = title.trim();
  await battle.save();

  return res.status(200).json({ success: true, battle });
};

export const deleteBattle = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = getSafeId(req.params.id);

  await Battle.findOneAndDelete({ _id: id, userId });

  return res.status(200).json({
    success: true,
    message: "Deleted",
  });
};

export const judgeBattle = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = getSafeId(req.params.id);
  const { winner } = req.body;

  const battle = await Battle.findOne({ _id: id, userId });
  if (!battle)
    return res.status(404).json({ success: false, message: "Not found" });

  battle.winner = winner === "A" ? "Mistral" : "Cohere";
  await battle.save();

  return res.status(200).json({ success: true, battle });
};

export const webSearch = async (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "OK",
  });
};
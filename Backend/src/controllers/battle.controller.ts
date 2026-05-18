import type { Request, Response } from "express";

import runGraph from "../ai/graph.ai.js";
import { generateBattleTitle } from "../ai/title.ai.js";
import { describeImage } from "../ai/vision.ai.js";
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

/* ---------------- CREATE BATTLE ---------------- */
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
    const enrichedProblem = enrichMessage(rawMessage, attachments);

    const result = await runGraph(enrichedProblem);
    const turn = createTurnFromGraphResult(rawMessage, result);

    const title = await generateBattleTitle(rawMessage);

    const battle = await Battle.create({
      userId,
      title,
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

    return res.status(201).json({
      success: true,
      battle,
    });
  } catch (error) {
    console.log("CREATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Battle failed",
    });
  }
};

/* ---------------- GET BATTLES ---------------- */
export const getBattles = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const battles = await Battle.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      battles,
    });
  } catch (error) {
    console.log("GET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------- APPEND MESSAGE ---------------- */
export const appendBattleMessage = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const id = getSafeId(req.params.id);

    const rawMessage = getRawMessage(req.body);

    if (!id || !rawMessage) {
      return res.status(400).json({
        success: false,
        message: "Invalid battle ID or message",
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
    const enrichedMessage = enrichMessage(rawMessage, attachments);
    const context = buildConversationContext(battle, enrichedMessage);

    const result = await runGraph(context);
    const turn = createTurnFromGraphResult(rawMessage, result);

    battle.turns = battle.turns || [];
    battle.turns.push(turn);

    syncBattleLatestFields(battle, turn);

    battle.winner = "";

    await battle.save();

    return res.status(200).json({
      success: true,
      battle,
    });
  } catch (error) {
    console.log("APPEND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to append message",
    });
  }
};

/* ---------------- RENAME BATTLE ---------------- */
export const renameBattle = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const id = getSafeId(req.params.id);
    const { title } = req.body;

    if (!id || !title?.trim()) {
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

    battle.title = title.trim();
    await battle.save();

    return res.status(200).json({
      success: true,
      battle,
    });
  } catch (error) {
    console.log("RENAME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Rename failed",
    });
  }
};

/* ---------------- DELETE BATTLE ---------------- */
export const deleteBattle = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const id = getSafeId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid battle ID",
      });
    }

    const battle = await Battle.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Battle deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/* ---------------- JUDGE BATTLE ---------------- */
export const judgeBattle = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const id = getSafeId(req.params.id);
    const { winner } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const battle = await Battle.findOne({ _id: id, userId });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    battle.winner = winner === "A" ? "Mistral" : "Cohere";

    await battle.save();

    return res.status(200).json({
      success: true,
      battle,
    });
  } catch (error) {
    console.log("JUDGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Judge failed",
    });
  }
};

/* ---------------- WEB SEARCH ---------------- */
export const webSearch = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Web search endpoint working",
  });
};
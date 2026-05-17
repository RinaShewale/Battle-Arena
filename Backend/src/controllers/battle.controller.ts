import type {
  Request,
  Response,
} from "express";

import runGraph from "../ai/graph.ai";
import Battle from "../models/battle.model";

export const createBattle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { problem } = req.body;

    if (!problem) {
      res.status(400).json({
        success: false,
        message: "Problem required",
      });

      return;
    }

    const result = await runGraph(problem);

    const winner =
      result.judge.solution_1_score >
      result.judge.solution_2_score
        ? "Mistral"
        : "Cohere";

    const battle = await Battle.create({
      problem,

      solution_1: result.solution_1,

      solution_2: result.solution_2,

      solution_1_score:
        result.judge.solution_1_score,

      solution_2_score:
        result.judge.solution_2_score,

      solution_1_reasoning:
        result.judge.solution_1_reasoning,

      solution_2_reasoning:
        result.judge.solution_2_reasoning,

      winner,
    });

    res.status(201).json({
      success: true,
      battle,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Battle failed",
    });
  }
};

export const getBattles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const battles = await Battle.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      battles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const judgeBattle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { winner } = req.body;

    if (!id || !winner) {
      return res.status(400).json({
        success: false,
        message: "Battle ID and winner required",
      });
    }

    const battle = await Battle.findById(id);

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    // ⭐ update winner
    battle.winner = winner;

    // optional scoring logic
    if (winner === "A") {
      battle.solution_1_score += 1;
    } else {
      battle.solution_2_score += 1;
    }

    await battle.save();

    res.json({
      success: true,
      battle,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Judge failed",
    });
  }
};
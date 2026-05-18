import mongoose, { Schema, Document } from "mongoose";

/* ---------------- TURN ---------------- */

export interface IBattleTurn {
  message: string;
  solution_1: string;
  solution_2: string;
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
}

/* ---------------- BATTLE ---------------- */

export interface IBattle extends Document {
  userId: mongoose.Types.ObjectId; // 🔐 FIX ADDED

  title: string;
  problem: string;

  solution_1: string;
  solution_2: string;

  solution_1_score: number;
  solution_2_score: number;

  solution_1_reasoning: string;
  solution_2_reasoning: string;

  winner: string;

  turns: IBattleTurn[];
}

/* ---------------- TURN SCHEMA ---------------- */

const turnSchema = new Schema<IBattleTurn>(
  {
    message: { type: String, required: true },
    solution_1: { type: String, required: true },
    solution_2: { type: String, required: true },
    solution_1_score: { type: Number, default: 0 },
    solution_2_score: { type: Number, default: 0 },
    solution_1_reasoning: { type: String, default: "" },
    solution_2_reasoning: { type: String, default: "" },
  },
  { _id: true }
);

/* ---------------- BATTLE SCHEMA ---------------- */

const battleSchema = new Schema<IBattle>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ⚡ faster queries per user
    },

    title: {
      type: String,
      default: "",
    },

    problem: {
      type: String,
      required: true,
    },

    solution_1: {
      type: String,
      required: true,
    },

    solution_2: {
      type: String,
      required: true,
    },

    solution_1_score: {
      type: Number,
      default: 0,
    },

    solution_2_score: {
      type: Number,
      default: 0,
    },

    solution_1_reasoning: {
      type: String,
      default: "",
    },

    solution_2_reasoning: {
      type: String,
      default: "",
    },

    winner: {
      type: String,
      default: "",
    },

    turns: {
      type: [turnSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Battle = mongoose.model<IBattle>("Battle", battleSchema);

export default Battle;
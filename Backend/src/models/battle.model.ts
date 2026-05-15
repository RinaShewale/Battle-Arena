import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IBattle extends Document {
  problem: string;

  solution_1: string;

  solution_2: string;

  solution_1_score: number;

  solution_2_score: number;

  solution_1_reasoning: string;

  solution_2_reasoning: string;

  winner: string;
}

const battleSchema = new Schema<IBattle>(
  {
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
  },
  {
    timestamps: true,
  }
);

const Battle = mongoose.model<IBattle>(
  "Battle",
  battleSchema
);

export default Battle;
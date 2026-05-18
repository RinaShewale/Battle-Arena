import mongoose, { Schema, Document } from "mongoose";
/* ---------------- TURN SCHEMA ---------------- */
const turnSchema = new Schema({
    message: { type: String, required: true },
    solution_1: { type: String, required: true },
    solution_2: { type: String, required: true },
    solution_1_score: { type: Number, default: 0 },
    solution_2_score: { type: Number, default: 0 },
    solution_1_reasoning: { type: String, default: "" },
    solution_2_reasoning: { type: String, default: "" },
}, { _id: true });
/* ---------------- BATTLE SCHEMA ---------------- */
const battleSchema = new Schema({
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
}, {
    timestamps: true,
});
const Battle = mongoose.model("Battle", battleSchema);
export default Battle;
//# sourceMappingURL=battle.model.js.map
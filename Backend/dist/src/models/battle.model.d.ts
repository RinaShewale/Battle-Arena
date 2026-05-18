import mongoose, { Document } from "mongoose";
export interface IBattleTurn {
    message: string;
    solution_1: string;
    solution_2: string;
    solution_1_score: number;
    solution_2_score: number;
    solution_1_reasoning: string;
    solution_2_reasoning: string;
}
export interface IBattle extends Document {
    userId: mongoose.Types.ObjectId;
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
declare const Battle: mongoose.Model<IBattle, {}, {}, {}, mongoose.Document<unknown, {}, IBattle, {}, mongoose.DefaultSchemaOptions> & IBattle & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBattle>;
export default Battle;
//# sourceMappingURL=battle.model.d.ts.map
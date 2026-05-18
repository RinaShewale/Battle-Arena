import type { IBattle, IBattleTurn } from "../models/battle.model.js";
type GraphResult = {
    solution_1: string;
    solution_2: string;
    judge: {
        solution_1_score: number;
        solution_2_score: number;
        solution_1_reasoning: string;
        solution_2_reasoning: string;
    };
};
export declare const getBattleTurns: (battle: IBattle) => IBattleTurn[];
export declare const buildConversationContext: (battle: IBattle, newMessage: string) => string;
export declare const createTurnFromGraphResult: (message: string, result: GraphResult) => IBattleTurn;
export declare const getAiWinnerLabel: (turn: IBattleTurn) => string;
export declare const syncBattleLatestFields: (battle: IBattle, turn: IBattleTurn) => void;
export type MessageAttachments = {
    fileName?: string;
    fileContent?: string;
    imageName?: string;
    imageDataUrl?: string;
    imageDescription?: string;
    webSearchResult?: string;
};
export declare const enrichMessage: (message: string, attachments?: MessageAttachments) => string;
export {};
//# sourceMappingURL=battle.service.d.ts.map
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

export const getBattleTurns = (battle: IBattle): IBattleTurn[] => {
  if (battle.turns?.length) {
    return battle.turns;
  }

  return [
    {
      message: battle.problem,
      solution_1: battle.solution_1,
      solution_2: battle.solution_2,
      solution_1_score: battle.solution_1_score,
      solution_2_score: battle.solution_2_score,
      solution_1_reasoning: battle.solution_1_reasoning,
      solution_2_reasoning: battle.solution_2_reasoning,
    },
  ];
};

export const buildConversationContext = (
  battle: IBattle,
  newMessage: string
): string => {
  const priorTurns = getBattleTurns(battle);

  if (priorTurns.length === 0) {
    return newMessage;
  }

  const history = priorTurns
    .map(
      (turn, index) =>
        `Message ${index + 1} (user): ${turn.message}`
    )
    .join("\n");

  return `You are continuing an existing conversation. Use the prior messages for context.

${history}

Latest user message:
${newMessage}`;
};

export const createTurnFromGraphResult = (
  message: string,
  result: GraphResult
): IBattleTurn => ({
  message,
  solution_1: result.solution_1,
  solution_2: result.solution_2,
  solution_1_score: result.judge.solution_1_score,
  solution_2_score: result.judge.solution_2_score,
  solution_1_reasoning: result.judge.solution_1_reasoning,
  solution_2_reasoning: result.judge.solution_2_reasoning,
});

export const getAiWinnerLabel = (turn: IBattleTurn): string => {
  if (turn.solution_1_score > turn.solution_2_score) {
    return "Mistral";
  }

  if (turn.solution_2_score > turn.solution_1_score) {
    return "Cohere";
  }

  return "Tie";
};

export const syncBattleLatestFields = (
  battle: IBattle,
  turn: IBattleTurn
): void => {
  battle.solution_1 = turn.solution_1;
  battle.solution_2 = turn.solution_2;
  battle.solution_1_score = turn.solution_1_score;
  battle.solution_2_score = turn.solution_2_score;
  battle.solution_1_reasoning = turn.solution_1_reasoning;
  battle.solution_2_reasoning = turn.solution_2_reasoning;
  battle.winner = getAiWinnerLabel(turn);
};

export type MessageAttachments = {
  fileName?: string;
  fileContent?: string;
  imageName?: string;
  imageDataUrl?: string;
  imageDescription?: string;
  webSearchResult?: string;
};

export const enrichMessage = (
  message: string,
  attachments?: MessageAttachments
): string => {
  let enriched = message.trim();

  if (!attachments) {
    return enriched;
  }

  if (attachments.fileName) {
    enriched += `\n\n[Attached file: ${attachments.fileName}]`;

    if (attachments.fileContent) {
      const content = attachments.fileContent.slice(0, 12000);
      enriched += `\n\`\`\`\n${content}\n\`\`\``;
    }
  }

  if (attachments.imageName) {
    enriched += `\n\n[Attached image: ${attachments.imageName}]`;

    if (attachments.imageDescription) {
      enriched += `\nImage context: ${attachments.imageDescription}`;
    } else if (attachments.imageDataUrl) {
      enriched += "\n(Image data provided for visual analysis.)";
    }
  }

  if (attachments.webSearchResult) {
    enriched += `\n\n[Live web search results]\n${attachments.webSearchResult}`;
  }

  return enriched;
};

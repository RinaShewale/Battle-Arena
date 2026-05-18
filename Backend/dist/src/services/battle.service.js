export const getBattleTurns = (battle) => {
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
export const buildConversationContext = (battle, newMessage) => {
    const priorTurns = getBattleTurns(battle);
    if (priorTurns.length === 0) {
        return newMessage;
    }
    const history = priorTurns
        .map((turn, index) => `Message ${index + 1} (user): ${turn.message}`)
        .join("\n");
    return `You are continuing an existing conversation. Use the prior messages for context.

${history}

Latest user message:
${newMessage}`;
};
export const createTurnFromGraphResult = (message, result) => ({
    message,
    solution_1: result.solution_1,
    solution_2: result.solution_2,
    solution_1_score: result.judge.solution_1_score,
    solution_2_score: result.judge.solution_2_score,
    solution_1_reasoning: result.judge.solution_1_reasoning,
    solution_2_reasoning: result.judge.solution_2_reasoning,
});
export const getAiWinnerLabel = (turn) => {
    if (turn.solution_1_score > turn.solution_2_score) {
        return "Mistral";
    }
    if (turn.solution_2_score > turn.solution_1_score) {
        return "Cohere";
    }
    return "Tie";
};
export const syncBattleLatestFields = (battle, turn) => {
    battle.solution_1 = turn.solution_1;
    battle.solution_2 = turn.solution_2;
    battle.solution_1_score = turn.solution_1_score;
    battle.solution_2_score = turn.solution_2_score;
    battle.solution_1_reasoning = turn.solution_1_reasoning;
    battle.solution_2_reasoning = turn.solution_2_reasoning;
    battle.winner = getAiWinnerLabel(turn);
};
export const enrichMessage = (message, attachments) => {
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
        }
        else if (attachments.imageDataUrl) {
            enriched += "\n(Image data provided for visual analysis.)";
        }
    }
    if (attachments.webSearchResult) {
        enriched += `\n\n[Live web search results]\n${attachments.webSearchResult}`;
    }
    return enriched;
};
//# sourceMappingURL=battle.service.js.map
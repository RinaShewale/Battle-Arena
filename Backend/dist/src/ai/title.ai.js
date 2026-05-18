import { geminiModel } from "./model.ai.js";
import { TITLE_PROMPT } from "./prompt.ai.js";
const extractText = (content) => {
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .map((part) => part.text ?? "")
            .join("");
    }
    return String(content);
};
export const generateBattleTitle = async (message) => {
    try {
        const response = await geminiModel.invoke(TITLE_PROMPT(message));
        const raw = extractText(response.content)
            .trim()
            .replace(/^["'`]+|["'`]+$/g, "")
            .replace(/\s+/g, " ");
        if (!raw) {
            return fallbackTitle(message);
        }
        const words = raw.split(" ").filter(Boolean);
        return words.slice(0, 8).join(" ");
    }
    catch (error) {
        console.log("TITLE GENERATION ERROR:", error);
        return fallbackTitle(message);
    }
};
const fallbackTitle = (message) => {
    const cleaned = message
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 48);
    if (!cleaned) {
        return "New Arena Chat";
    }
    return cleaned.length < message.trim().length
        ? `${cleaned}…`
        : cleaned;
};
//# sourceMappingURL=title.ai.js.map
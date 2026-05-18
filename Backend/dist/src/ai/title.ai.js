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
    return String(content ?? "");
};
const cleanTitle = (title) => {
    return title
        .replace(/^["'`]+|["'`]+$/g, "")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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
export const generateBattleTitle = async (message) => {
    try {
        if (!message?.trim()) {
            return "New Arena Chat";
        }
        const response = await geminiModel.invoke(TITLE_PROMPT(message));
        const rawText = extractText(response.content);
        const cleaned = cleanTitle(rawText);
        if (!cleaned) {
            return fallbackTitle(message);
        }
        // keep only first 8 words
        const words = cleaned.split(" ").filter(Boolean);
        const shortTitle = words.slice(0, 8).join(" ");
        if (!shortTitle.trim()) {
            return fallbackTitle(message);
        }
        return shortTitle;
    }
    catch (error) {
        console.log("TITLE GENERATION ERROR:", error);
        return fallbackTitle(message);
    }
};
//# sourceMappingURL=title.ai.js.map
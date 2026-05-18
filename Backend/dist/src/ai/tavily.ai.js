import { tavily as Tavily } from "@tavily/core";
import config from "../config/config.js";
const tavily = Tavily({
    apiKey: config.TAVILY_API_KEY,
});
export const searchInternet = async ({ query, }) => {
    try {
        const isDeepSearch = query.toLowerCase().includes("latest") ||
            query.toLowerCase().includes("2026") ||
            query.toLowerCase().includes("news") ||
            query.toLowerCase().includes("research") ||
            query.toLowerCase().includes("compare");
        const result = await tavily.search(query, {
            searchDepth: isDeepSearch
                ? "advanced"
                : "basic",
            topic: "general",
            maxResults: isDeepSearch ? 10 : 5,
            includeAnswer: true,
            includeRawContent: false,
            includeImages: false,
        });
        return JSON.stringify(result, null, 2);
    }
    catch (error) {
        console.error("Tavily Error:", error);
        return "Failed to search the internet.";
    }
};
//# sourceMappingURL=tavily.ai.js.map
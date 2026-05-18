import { HumanMessage } from "@langchain/core/messages";
import { mistralModel } from "./model.ai.js";
/**
 * Robustly extracts text from various LangChain response formats
 */
const extractText = (content) => {
    if (typeof content === "string")
        return content;
    if (Array.isArray(content)) {
        return content.map((c) => (typeof c === "string" ? c : c.text || "")).join("");
    }
    return "";
};
export const describeImage = async (imageDataUrl, imageName) => {
    try {
        // 1. Validate the image data exists
        if (!imageDataUrl)
            return `[System]: Image ${imageName} was attached but could not be read.`;
        // 2. Format specifically for Google Gemini 1.5 
        // Using the HumanMessage class is more reliable than raw objects
        const message = new HumanMessage({
            content: [
                {
                    type: "text",
                    text: `You are a technical vision assistant. Describe this image ("${imageName}") for a coding AI. 
                 Focus on OCR (reading code), UI layouts, or diagrams. Be concise (2-3 sentences).`,
                },
                {
                    type: "image_url",
                    image_url: imageDataUrl, // LangChain handles the 'data:image/...' prefix automatically
                },
            ],
        });
        // 3. Invoke the model
        const response = await mistralModel.invoke([message]);
        const description = extractText(response.content).trim();
        return description || `User attached an image named ${imageName}.`;
    }
    catch (error) {
        // This prevents a crash in the Arena if Gemini is down or the image is too large
        console.error("CRITICAL VISION ERROR:", error.message);
        // Return a descriptive fallback so the other models still have some context
        return `[Image Attachment: ${imageName} - Vision analysis failed: ${error.status === 413 ? "File too large" : "Service unavailable"}]`;
    }
};
//# sourceMappingURL=vision.ai.js.map
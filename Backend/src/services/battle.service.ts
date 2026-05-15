import {
  geminiModel,
  mistralModel,
  cohereModel,
} from "../ai/model.ai";

export type AIModelType =
  | "gemini"
  | "mistral"
  | "cohere";

const getAIResponse = async (
  prompt: string,
  model: AIModelType
): Promise<string> => {
  try {
    let response;

    switch (model) {
      case "gemini":
        response = await geminiModel.invoke(prompt);
        break;

      case "mistral":
        response = await mistralModel.invoke(prompt);
        break;

      case "cohere":
        response = await cohereModel.invoke(prompt);
        break;

      default:
        response = await geminiModel.invoke(prompt);
    }

    return response.content.toString();
  } catch (error) {
    console.log(error);

    return "AI Error";
  }
};

export default getAIResponse;
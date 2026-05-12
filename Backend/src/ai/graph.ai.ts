import { StateGraph, StateSchema, START, END, type GraphNode } from "@langchain/langgraph";
import z from "zod"
// import createAgent
import { createAgent, HumanMessage, providerStrategy } from "langchain";

import { mistralModel, geminiModel, cohereModel } from "../ai/model.ai.js";
import { es } from "zod/v4/locales";

const state = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    Solution_1_resoning: z.string().default(""),
    Solution_2_resoning: z.string().default("")
  })
})

const solutionNode: GraphNode<typeof state> = async (state) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);
  return {
    solution_1: mistralResponse.text,
    solution_2: cohereResponse.text,
  }
}
const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  const prompt = `
You are a judge evaluating two solutions.

Return ONLY valid JSON:
{
  "solution_1_score": number (0-10),
  "solution_2_score": number (0-10),
  "solution_1_reasoning": string,
  "solution_2_reasoning": string
}

Problem: ${problem}
Solution 1: ${solution_1}
Solution 2: ${solution_2}
`;

  const response = await geminiModel.invoke(prompt);

  let text = "";

  // handle string
  if (typeof response.content === "string") {
    text = response.content;
  }

  // handle array (ContentBlock[])
  else if (Array.isArray(response.content)) {
    text = response.content
      .map((c: any) => c.text ?? "")
      .join("");
  }

  const parsed = JSON.parse(text);

  return {
    judge: parsed
  };
};


const graph = new StateGraph(state)
  .addNode("solutionNode", solutionNode)
  .addNode("judgeNode", judgeNode)
  .addEdge(START, "solutionNode")
  .addEdge("solutionNode", "judgeNode")
  .addEdge("judgeNode", END)
  .compile()


export default async function (problem: string) {

  const result = await graph.invoke({
    problem: problem
  })

  return result;
}
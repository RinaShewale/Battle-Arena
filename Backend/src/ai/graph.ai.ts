import {
  StateGraph,
  StateSchema,
  START,
  END,
  type GraphNode,
} from "@langchain/langgraph";

import z from "zod";

import {
  mistralModel,
  geminiModel,
  cohereModel,
} from "../ai/model.ai";

import {
  JUDGE_PROMPT,
  SYSTEM_PROMPT,
} from "../ai/prompt.ai";

// ---------------- STATE ----------------
const state = new StateSchema({
  problem: z.string().default(""),

  solution_1: z.string().default(""),

  solution_2: z.string().default(""),

  judge: z.object({
    solution_1_score: z.number().default(0),

    solution_2_score: z.number().default(0),

    solution_1_reasoning: z.string().default(""),

    solution_2_reasoning: z.string().default(""),
  }),
});

// ---------------- HELPERS ----------------
const extractText = (res: any) => {
  if (typeof res.content === "string") {
    return res.content;
  }

  if (Array.isArray(res.content)) {
    return res.content
      .map((c: any) => c.text ?? "")
      .join("");
  }

  return String(res.content);
};

// ---------------- SOLUTION NODE ----------------
const solutionNode: GraphNode<typeof state> = async (state) => {
  const prompt = `
${SYSTEM_PROMPT}

Problem:
${state.problem}
`;

  const [mistralResponse, cohereResponse] =
    await Promise.all([
      mistralModel.invoke(prompt),
      cohereModel.invoke(prompt),
    ]);

  return {
    solution_1: extractText(mistralResponse),
    solution_2: extractText(cohereResponse),
  };
};

// ---------------- JUDGE NODE ----------------
const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  const prompt = JUDGE_PROMPT(
    problem,
    solution_1,
    solution_2
  );

  const response = await geminiModel.invoke(prompt);

  let text = extractText(response);

  // remove markdown formatting
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    console.log("⚠️ Judge JSON parse failed:", error);

    parsed = {
      solution_1_score: 5,
      solution_2_score: 5,
      solution_1_reasoning: "Parsing failed",
      solution_2_reasoning: "Parsing failed",
    };
  }

  return {
    judge: parsed,
  };
};

// ---------------- GRAPH ----------------
const graph = new StateGraph(state)
  .addNode("solutionNode", solutionNode)
  .addNode("judgeNode", judgeNode)
  .addEdge(START, "solutionNode")
  .addEdge("solutionNode", "judgeNode")
  .addEdge("judgeNode", END)
  .compile();

// ---------------- RUN ----------------
const runGraph = async (problem: string) => {
  return await graph.invoke({
    problem,
  });
};

export default runGraph;
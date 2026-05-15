export const SYSTEM_PROMPT = `
You are an expert AI coding assistant.

Rules:
- Give optimized code
- Explain clearly
- Use best practices
- Write production-ready solutions
`;

export const JUDGE_PROMPT = (
  problem: string,
  solution1: string,
  solution2: string
) => `
You are an expert AI judge.

Evaluate both solutions carefully.

Return ONLY valid JSON.

{
  "solution_1_score": number,
  "solution_2_score": number,
  "solution_1_reasoning": string,
  "solution_2_reasoning": string
}

Problem:
${problem}

Solution 1:
${solution1}

Solution 2:
${solution2}
`;
import { geminiModel } from "../ai/model.ai.js";

const stripHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const fetchUrlSummary = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "BattleArenaBot/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL (${response.status})`);
  }

  const html = await response.text();
  const text = stripHtml(html).slice(0, 4000);

  return `Source URL: ${url}\n\nPage excerpt:\n${text}`;
};

const fetchDuckDuckGo = async (query: string): Promise<string> => {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("DuckDuckGo search failed");
  }

  const data = (await response.json()) as {
    AbstractText?: string;
    Heading?: string;
    RelatedTopics?: Array<{ Text?: string } | { Topics?: Array<{ Text?: string }> }>;
  };

  const parts: string[] = [];

  if (data.Heading) {
    parts.push(`Topic: ${data.Heading}`);
  }

  if (data.AbstractText) {
    parts.push(data.AbstractText);
  }

  const related = (data.RelatedTopics ?? [])
    .flatMap((topic) => {
      if ("Text" in topic && topic.Text) {
        return [topic.Text];
      }

      if ("Topics" in topic && topic.Topics) {
        return topic.Topics.map((t) => t.Text).filter(Boolean) as string[];
      }

      return [];
    })
    .slice(0, 5);

  if (related.length) {
    parts.push("Related:\n" + related.join("\n"));
  }

  return parts.join("\n\n");
};

const summarizeWithGemini = async (query: string, raw: string): Promise<string> => {
  try {
    const prompt = `Summarize the following web search results for "${query}" in 4-6 bullet points:

${raw}`;

    const response = await geminiModel.invoke(prompt);

    return typeof response.content === "string"
      ? response.content.trim()
      : String(response.content).trim();

  } catch (err) {
    console.log("⚠️ AI summary failed, using fallback text");

    return `Web results for "${query}":

${raw.slice(0, 2000)}`;
  }
};


export const performWebSearch = async (query: string): Promise<string> => {
  const trimmed = query.trim();

  if (!trimmed) {
    throw new Error("Search query required");
  }

  let raw = "";

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      raw = await fetchUrlSummary(trimmed);
    } else {
      raw = await fetchDuckDuckGo(trimmed);
    }
  } catch (error) {
    console.log("WEB SEARCH FETCH ERROR:", error);
    raw = `Query: ${trimmed}\n(No direct search API result. Use general knowledge.)`;
  }

  if (!raw || raw.length < 20) {
    raw = `Query: ${trimmed}`;
  }

  return summarizeWithGemini(trimmed, raw);
};

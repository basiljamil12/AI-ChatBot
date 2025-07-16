import { NextRequest } from "next/server";
import OpenAI from "openai";
console.log(process.env.OPENROUTER_API_KEY);
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
const modelMap: Record<string, string> = {
  "kimi-k2": "moonshotai/kimi-k2:free",
  "mistral-small-3.2": "mistralai/mistral-small-3.2-24b-instruct:free",
  // Add more mappings here as needed
};
export async function POST(req: NextRequest) {
  const { prompt, model: selectedModel } = await req.json();

  if (!prompt || !selectedModel) {
    return new Response(
      JSON.stringify({ error: "Prompt and model are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const model = modelMap[selectedModel];
  if (!model) {
    return new Response(
      JSON.stringify({ error: "Unknown or unsupported model" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const message = completion.choices?.[0]?.message?.content || "No response";
    return new Response(JSON.stringify({ response: message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from OpenRouter API" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

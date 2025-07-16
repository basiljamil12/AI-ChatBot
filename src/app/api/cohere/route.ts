import { NextRequest } from "next/server";
import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await cohere.chat({
      model: "command-a-03-2025", // or "command-a-03-2025" if you're using that
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    console.log("Cohere Response:", response);
    const content = response?.message?.content?.[0]?.text ?? "No response";
    return new Response(JSON.stringify({ response: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cohere error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Cohere API" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

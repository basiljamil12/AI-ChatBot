"use client";

import { useState } from "react";
import { marked } from "marked";
import { routes } from "./api/routes";
import { apiFetch } from "./utils/apiFetch";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [formattedHtml, setFormattedHtml] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse("");
    setFormattedHtml("");

    try {
      const result: any = await apiFetch(
        selectedModel === "chatgpt" ? routes.chatgpt : routes.gemini,
        {
          method: "POST",
          body: { prompt },
        }
      );
      console.log("API Response:", result);
      setResponse(result.response || "No response");
      const html = await marked.parse(result.response);
      setFormattedHtml(html);
    } catch (err) {
      setResponse("Error calling API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <h1 className="text-3xl font-bold mb-4">AI Chat Bot</h1>

      <div className="relative w-full max-w-xl mb-4">
        {/* Dropdown in top-right corner */}
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="absolute bottom-3 left-2 bg-black border border-gray-300 text-sm rounded px-2 py-1 shadow-sm"
        >
          <option value="chatgpt">ChatGPT</option>
          <option value="gemini">Gemini</option>
        </select>

        {/* Textarea */}
        <textarea
          className="w-full p-2 border rounded"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Submit"}
      </button>

      {response && (
        <div className="mt-6 w-full max-w-xl bg-black p-4 border rounded">
          <h2 className="font-semibold mb-2">Response:</h2>
          <p dangerouslySetInnerHTML={{ __html: formattedHtml }} />
        </div>
      )}
    </main>
  );
}

"use client";

import { useState } from "react";
import { marked } from "marked";
import { routes } from "./api/routes";
import { apiFetch } from "./api/apiFetch";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [formattedHtml, setFormattedHtml] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini");

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse("");
    setFormattedHtml("");
    let endpoint;

    // Use switch-case to determine the correct route
    switch (selectedModel) {
      case "chatgpt":
        endpoint = routes.chatgpt;
        break;
      case "gemini":
        endpoint = routes.gemini;
        break;
      case "cohere":
        endpoint = routes.cohere;
        break;
      case "kimi-k2":
      case "mistral-small-3.2":
        endpoint = routes.openRouter;
        break;
      default:
        setResponse("❌ Unknown model selected");
        setLoading(false);
        return;
    }
    try {
      const result: any = await apiFetch(endpoint, {
        method: "POST",
        body: { prompt, model: selectedModel },
      });
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4  bg-black">
      <h1 className="text-3xl font-bold mb-4">Generative AI Chat Bot</h1>

      <div className="relative w-full max-w-2xl mb-4 overflow-visible">
        {/* Textarea */}
        <textarea
          className="w-full p-2 border rounded"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
        />
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="relative  bg-black border border-gray-300 text-sm rounded px-2 py-1 shadow-sm"
        >
          <option value="gemini">Gemini</option>
          <option value="chatgpt">ChatGPT</option>
          <option value="cohere">Cohere</option>
          <option value="kimi-k2">OpenRouter-Kimi-k2</option>
          <option value="mistral-small-3.2">
            OpenRouter-Mistral-small-3.2
          </option>
        </select>
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

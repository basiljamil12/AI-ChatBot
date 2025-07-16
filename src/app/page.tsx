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

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse("");

    try {
      const result: any = await apiFetch(routes.gemini, {
        method: "POST",
        body: { prompt },
      });
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

      <textarea
        className="w-full max-w-xl p-2 border rounded mb-4"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt here..."
      />

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

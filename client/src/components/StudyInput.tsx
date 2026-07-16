import React, { useState } from "react";
import { Sparkles, Brain, Cpu, MessageSquare } from "lucide-react";

interface StudyInputProps {
  onSubmit: (topic: string, notes: string, difficulty: string) => void;
  isLoading: boolean;
}

export const StudyInput: React.FC<StudyInputProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [error, setError] = useState("");

  const suggestedTopics = [
    { label: "⚛️ React Hooks", topic: "React Hooks & Functional Components", notes: "Focus on useState, useEffect, dependency arrays, custom hooks, and hook rules (calling at top level)." },
    { label: "🌱 Photosynthesis", topic: "Photosynthesis & Plant Biology", notes: "Explain chloroplasts, light-dependent reactions in thylakoids, light-independent reactions (Calvin cycle) in stroma, and the chemical equation." },
    { label: "🌐 HTTP Protocols", topic: "HTTP Protocol & REST APIs", notes: "Explain HTTP methods (GET, POST, PUT, DELETE), status codes (200, 201, 400, 401, 404, 500), headers, statelessness, and REST design principles." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !notes.trim()) {
      setError("Please specify a topic or paste notes to begin.");
      return;
    }
    setError("");
    onSubmit(topic.trim(), notes.trim(), difficulty);
  };

  const handleSuggestionClick = (sug: typeof suggestedTopics[0]) => {
    setTopic(sug.topic);
    setNotes(sug.notes);
    setError("");
  };

  return (
    <div style={{ maxWidth: "680px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(135deg, #fff 30%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Accelerate Your Learning
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Paste notes, code snippets, or a general topic, and watch the AI construct summaries, interactive flashcards, and quizzes in seconds.
        </p>
      </div>

      <div className="card card-glowing">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Brain size={16} color="var(--primary)" /> Topic Name
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. JavaScript Closures, Cell Division, Calculus..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MessageSquare size={16} color="var(--primary)" /> Notes, Text, or Code Snippet (Optional)
              </span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Paste any detailed study notes, textbook paragraphs, or source code here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Cpu size={16} color="var(--primary)" /> Difficulty Level
              </span>
            </label>
            <div className="segmented-control">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`segmented-control-btn ${difficulty === level ? "active" : ""}`}
                  onClick={() => setDifficulty(level)}
                  disabled={isLoading}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ color: "var(--error)", fontSize: "0.875rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", height: "48px" }}
            disabled={isLoading}
          >
            <Sparkles size={18} />
            {isLoading ? "Analyzing & Generating Study Set..." : "Generate Custom Study Guide"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
            Or try these popular topics:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {suggestedTopics.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary"
                style={{ padding: "8px 12px", fontSize: "0.8rem", borderRadius: "20px" }}
                onClick={() => handleSuggestionClick(sug)}
                disabled={isLoading}
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

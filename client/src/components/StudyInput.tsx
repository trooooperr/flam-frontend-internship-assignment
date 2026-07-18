import React, { useState } from "react";
import { Sparkles } from "lucide-react";

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
    <div style={{ maxWidth: "680px", margin: "60px auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 className="landing-title">
          Accelerate <span className="serif-highlight">your learning.</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "560px", margin: "0 auto", lineHeight: 1.5 }}>
          Paste notes, code snippets, or a general topic, and watch the AI construct summaries, interactive flashcards, and quizzes in seconds.
        </p>
      </div>

      <div className="card card-glowing">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Topic Name</label>
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
            <label className="form-label">Notes, Text, or Code Snippet (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Paste any detailed study notes, textbook paragraphs, or source code here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty Level</label>
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
            <div style={{ color: "var(--error)", fontSize: "0.875rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", height: "50px", fontSize: "0.95rem" }}
            disabled={isLoading}
          >
            <Sparkles size={18} />
            {isLoading ? "Analyzing & Generating Study Set..." : "Generate Custom Study Guide"}
          </button>
        </form>

        <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid var(--border-color)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            Or try these popular topics:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {suggestedTopics.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary suggestion-chip"
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

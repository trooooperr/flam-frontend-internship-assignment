import React, { useState, useEffect } from "react";
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw, BookOpen } from "lucide-react";

// --- LOADING STATE ---
const LOADING_QUOTES = [
  "Structuring study cards and quiz variables...",
  "\"The beautiful thing about learning is that no one can take it away from you.\" — B.B. King",
  "Checking for trailing JSON commas and repairing truncated blocks...",
  "\"Live as if you were to die tomorrow. Learn as if you were to live forever.\" — Mahatma Gandhi",
  "Injecting explanations and distractors into quiz question objects...",
  "\"Education is the most powerful weapon which you can use to change the world.\" — Nelson Mandela",
  "Double-checking answers to ensure the key matches the options..."
];

export const LoadingState: React.FC = () => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % LOADING_QUOTES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto" }}>
      {/* Glow loader */}
      <div style={{ position: "relative", width: "80px", height: "80px", marginBottom: "28px" }}>
        <div style={{ position: "absolute", inset: 0, border: "4px solid var(--border-color)", borderRadius: "50%" }}></div>
        <div style={{
          position: "absolute",
          inset: 0,
          border: "4px solid transparent",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
        Synthesizing Educational Molecules
      </h3>
      
      <p style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: "0.95rem", minHeight: "48px", transition: "all 0.3s ease" }}>
        {LOADING_QUOTES[quoteIdx]}
      </p>

      {/* Skeletons */}
      <div style={{ width: "100%", marginTop: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="card pulse" style={{ height: "120px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ height: "20px", width: "40%", background: "#e2e8f0", borderRadius: "4px" }}></div>
          <div style={{ height: "12px", width: "90%", background: "#f1f5f9", borderRadius: "4px" }}></div>
          <div style={{ height: "12px", width: "70%", background: "#f1f5f9", borderRadius: "4px" }}></div>
        </div>
        <div className="card pulse" style={{ height: "80px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ height: "12px", width: "30%", background: "#e2e8f0", borderRadius: "4px" }}></div>
          <div style={{ height: "12px", width: "80%", background: "#f1f5f9", borderRadius: "4px" }}></div>
        </div>
      </div>
    </div>
  );
};

// --- ERROR STATE ---
interface ErrorStateProps {
  message: string;
  rawText?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, rawText, onRetry }) => {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", padding: "0 20px" }}>
      <div className="card" style={{ borderColor: "var(--error)", borderStyle: "dashed", textAlign: "center", padding: "40px" }}>
        <div style={{ display: "inline-flex", background: "#fee2e2", padding: "16px", borderRadius: "50%", color: "var(--error)", marginBottom: "20px" }}>
          <AlertCircle size={32} />
        </div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "12px", color: "var(--text-primary)" }}>AI Parsing Error</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "20px" }}>
          <button className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={16} /> Retry Generation
          </button>
        </div>

        {rawText && (
          <div className="accordion">
            <div className="accordion-header" onClick={() => setShowRaw(!showRaw)}>
              <span>View Raw AI Response Output</span>
              {showRaw ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {showRaw && (
              <div className="accordion-content" style={{ textAlign: "left" }}>
                <pre style={{ fontSize: "0.75rem", fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre-wrap", color: "var(--text-muted)" }}>
                  {rawText}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- EMPTY STATE ---
interface EmptyStateProps {
  onNew: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onNew }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 20px", textAlign: "center" }}>
      <div style={{ background: "#f1f5f9", padding: "20px", borderRadius: "50%", color: "var(--primary)", marginBottom: "24px" }}>
        <BookOpen size={40} />
      </div>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px", color: "var(--text-primary)" }}>No Study Material Loaded</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "450px", marginBottom: "24px" }}>
        Get started by creating a new custom study guide based on notes, textbooks, or quick prompt ideas.
      </p>
      <button className="btn btn-primary" onClick={onNew}>
        Create Study Guide
      </button>
    </div>
  );
};

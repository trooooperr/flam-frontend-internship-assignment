import React, { useState } from "react";
import type { Concept } from "../types";
import { Award, Layers } from "lucide-react";

interface SummaryBlockProps {
  summary: string;
  concepts: Concept[];
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ summary, concepts }) => {
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);

  // Simple, self-contained Markdown parser
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      let trimmed = line.trim();

      // Header 3
      if (trimmed.startsWith("### ")) {
        return <h3 key={index} style={{ fontSize: "1.1rem", fontWeight: 700, margin: "16px 0 8px", color: "#fff" }}>{parseInlineMarkdown(trimmed.substring(4))}</h3>;
      }
      // Header 2
      if (trimmed.startsWith("## ")) {
        return <h2 key={index} style={{ fontSize: "1.25rem", fontWeight: 700, margin: "20px 0 10px", color: "#fff" }}>{parseInlineMarkdown(trimmed.substring(3))}</h2>;
      }
      // Header 1
      if (trimmed.startsWith("# ")) {
        return <h1 key={index} style={{ fontSize: "1.5rem", fontWeight: 700, margin: "24px 0 12px", color: "#fff" }}>{parseInlineMarkdown(trimmed.substring(2))}</h1>;
      }
      // Bullet list items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={index} style={{ marginLeft: "20px", marginBottom: "6px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {parseInlineMarkdown(trimmed.substring(2))}
          </li>
        );
      }
      // Empty lines
      if (trimmed === "") {
        return <div key={index} style={{ height: "12px" }}></div>;
      }

      // Normal paragraph
      return (
        <p key={index} style={{ marginBottom: "12px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    // Regex matching bold **text** and code `code`
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} style={{ color: "#fff", fontWeight: 600 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.85em",
              fontFamily: "monospace",
              color: "#a78bfa",
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Summary Card */}
      <div className="card markdown-body" style={{ background: "rgba(15, 17, 26, 0.5)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
          <Layers size={18} /> Topic Overview
        </h3>
        <div>{renderMarkdown(summary)}</div>
      </div>

      {/* Key Concepts Card */}
      {concepts && concepts.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--secondary)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Award size={18} /> Key Concepts
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Click on any concept to expand and view its full definition.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {concepts.map((concept, idx) => {
              const isSelected = selectedConcept === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedConcept(isSelected ? null : idx)}
                  style={{
                    padding: "16px",
                    background: isSelected ? "rgba(16, 185, 129, 0.05)" : "rgba(255, 255, 255, 0.01)",
                    border: "1px solid",
                    borderColor: isSelected ? "var(--secondary)" : "var(--border-color)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)";
                    }
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: isSelected ? "var(--secondary)" : "var(--text-primary)" }}>
                    {concept.term}
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: "8px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, animation: "fadeIn 0.2s ease" }}>
                      {concept.definition}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

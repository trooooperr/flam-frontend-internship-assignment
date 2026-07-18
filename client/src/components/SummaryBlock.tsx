import React, { useState } from "react";
import type { Concept } from "../types";
import { ChevronDown } from "lucide-react";


interface SummaryBlockProps {
  summary: string;
  concepts: Concept[];
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ summary, concepts }) => {
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);

  const cleanLatexSymbols = (val: string): string => {
    let cleaned = val;
    // Replace $$ equations blocks with simple paragraphs
    cleaned = cleaned.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, '$1');
    // Replace \xrightarrow{\text{...}} with ➔ (...)
    cleaned = cleaned.replace(/\\xrightarrow\{\\text\{([\s\S]*?)\}\}/g, ' ➔ ($1) ');
    cleaned = cleaned.replace(/\\xrightarrow\{([\s\S]*?)\}/g, ' ➔ ($1) ');
    cleaned = cleaned.replace(/\\rightarrow/g, ' ➔ ');
    // Remove remaining \text{...}
    cleaned = cleaned.replace(/\\text\{([\s\S]*?)\}/g, '$1');
    
    // Format subscripts (e.g. CO_2 or C_6H_{12}O_6) using Unicode subscript characters
    const subMap: Record<string, string> = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
      '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
      'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 'h': 'ₕ',
      'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'p': 'ₚ',
      's': 'ₛ', 't': 'ₜ'
    };
    
    cleaned = cleaned.replace(/_\{([0-9a-zA-Z\+\-\=\(\)]+)\}/g, (_, p1) => {
      return p1.split('').map((char: string) => subMap[char] || char).join('');
    });
    cleaned = cleaned.replace(/_([0-9a-zA-Z])/g, (_, p1) => {
      return subMap[p1] || p1;
    });
    
    return cleaned;
  };

  // Simple, self-contained Markdown parser
  const renderMarkdown = (text: string) => {
    const cleanedText = cleanLatexSymbols(text);
    return cleanedText.split("\n").map((line, index) => {
      let trimmed = line.trim();

      // Header 3
      if (trimmed.startsWith("### ")) {
        return <h3 key={index} className="summary-markdown-h3">{parseInlineMarkdown(trimmed.substring(4))}</h3>;
      }
      // Header 2
      if (trimmed.startsWith("## ")) {
        return <h2 key={index} className="summary-markdown-h2">{parseInlineMarkdown(trimmed.substring(3))}</h2>;
      }
      // Header 1
      if (trimmed.startsWith("# ")) {
        return <h1 key={index} className="summary-markdown-h1">{parseInlineMarkdown(trimmed.substring(2))}</h1>;
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
        <p key={index} className="summary-markdown-p">
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
          <strong key={index} style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            style={{
              background: "#f1f5f9",
              padding: "3px 6px",
              borderRadius: "4px",
              fontSize: "0.85em",
              fontFamily: "monospace",
              color: "var(--primary)",
              fontWeight: 500
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
      <div className="card markdown-body">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
          Topic Overview
        </h3>
        <div>{renderMarkdown(summary)}</div>
      </div>

      {/* Key Concepts Card */}
      {concepts && concepts.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
            Key Concepts
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
                    background: isSelected ? "#f8fafc" : "transparent",
                    border: "1px solid",
                    borderColor: isSelected ? "var(--primary)" : "var(--border-color)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--border-hover)";
                      e.currentTarget.style.background = "#f8fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--primary)" : "var(--text-primary)" }}>
                      {concept.term}
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        color: isSelected ? "var(--primary)" : "var(--text-muted)",
                        transform: isSelected ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform var(--transition-fast)",
                      }}
                    />
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

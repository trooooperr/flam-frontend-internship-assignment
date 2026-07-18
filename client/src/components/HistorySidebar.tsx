import React from "react";
import type { HistorySession } from "../types";
import { BookMarked, Trash2, Clock, X } from "lucide-react";

interface HistorySidebarProps {
  sessions: HistorySession[];
  activeSessionId?: string;
  onSelectSession: (session: HistorySession) => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  isOpen,
  onClose,
}) => {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Sidebar Header */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: "rgba(37, 99, 235, 0.08)", color: "var(--primary)" }}>
            <BookMarked size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.02em", color: "var(--text-primary)" }}>Saved Study Sets</span>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Sessions List */}
      <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {sessions.length === 0 ? (
          <div style={{ padding: "20px 8px", userSelect: "none", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No saved sessions yet. Your study guides will appear here once generated.
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: isActive ? "#f1f5f9" : "transparent",
                  border: "1px solid transparent",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  position: "relative",
                }}
                className={`sidebar-item ${isActive ? "active" : ""}`}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: "10px" }}>
                  <div
                    style={{
                      fontWeight: isActive ? 700 : 600,
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: "4px"
                    }}
                  >
                    {session.topic}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <Clock size={10} />
                    <span>{formatDate(session.createdAt)}</span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all var(--transition-fast)"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--error)"; e.currentTarget.style.background = "var(--error-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
                  title="Delete study set"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div style={{ padding: "20px", borderTop: "1px solid var(--border-color)", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
        Created in React & Gemini 1.5
      </div>
    </aside>
  );
};

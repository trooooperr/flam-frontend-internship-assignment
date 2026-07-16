import React from "react";
import type { HistorySession } from "../types";
import { BookMarked, Trash2, Clock } from "lucide-react";

interface HistorySidebarProps {
  sessions: HistorySession[];
  activeSessionId?: string;
  onSelectSession: (session: HistorySession) => void;
  onDeleteSession: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
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
    <aside
      style={{
        background: "rgba(10, 11, 16, 0.95)",
        borderRight: "1px solid var(--border-color)",
        height: "100vh",
        width: "280px",
        display: "flex",
        flexDirection: "column",
        zIndex: 30,
        overflowY: "auto",
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <BookMarked size={20} color="var(--primary)" />
        <span style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.02em" }}>Saved Study Sets</span>
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
                  padding: "12px 14px",
                  background: isActive ? "rgba(139, 92, 246, 0.08)" : "transparent",
                  border: "1px solid",
                  borderColor: isActive ? "rgba(139, 92, 246, 0.3)" : "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  position: "relative",
                }}
                className="sidebar-item"
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: "10px" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: isActive ? "var(--primary)" : "var(--text-primary)",
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
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--error)"; e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"; }}
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

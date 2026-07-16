import React from "react";
import { BookOpen, AlertTriangle } from "lucide-react";

interface NavbarProps {
  isMockData: boolean;
  activeTitle?: string;
  onNewClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMockData, activeTitle, onNewClick }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: "rgba(15, 17, 26, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
            padding: "8px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(139, 92, 246, 0.3)",
          }}
        >
          <BookOpen size={20} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            AetherStudy<span style={{ color: "var(--primary)" }}>.ai</span>
          </h1>
        </div>
      </div>

      {activeTitle && (
        <div
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            maxWidth: "350px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            border: "1px solid var(--border-color)",
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.02)",
          }}
          title={activeTitle}
        >
          {activeTitle}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {isMockData && (
          <div className="banner" style={{ borderBottom: "none", padding: "4px 12px", borderRadius: "9999px" }}>
            <AlertTriangle size={14} />
            <span>Mock Mode Active</span>
          </div>
        )}
        <button onClick={onNewClick} className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>
          New Study Set
        </button>
      </div>
    </header>
  );
};

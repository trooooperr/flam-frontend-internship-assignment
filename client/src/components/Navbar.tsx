import React from "react";
import { GraduationCap, AlertTriangle, Menu, Plus } from "lucide-react";

interface NavbarProps {
  isMockData: boolean;
  activeTitle?: string;
  onNewClick: () => void;
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMockData, activeTitle, onNewClick, onMenuClick }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 32px",
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Sidebar Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={onMenuClick}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background var(--transition-fast)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <Menu size={20} />
        </button>

        <div
          className="logo-container"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)",
            padding: "8px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={18} color="white" />
        </div>
        <div>
          <h1 className="brand-name-text" style={{ letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            AetherStudy
          </h1>
        </div>
      </div>

      {activeTitle && (
        <div
          className="active-title-pill"
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            maxWidth: "350px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            border: "1px solid var(--border-color)",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: "#f1f5f9",
            fontWeight: 600
          }}
          title={activeTitle}
        >
          {activeTitle}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {isMockData && (
          <div className="banner" style={{ borderBottom: "none", padding: "6px 14px", borderRadius: "9999px" }}>
            <AlertTriangle size={14} />
            <span>Mock Mode Active</span>
          </div>
        )}
        <button onClick={onNewClick} className="btn btn-secondary new-study-btn">
          <Plus size={16} />
          <span className="new-study-btn-text">New Study Set</span>
        </button>
      </div>
    </header>
  );
};

import React, { useState, useEffect, useCallback } from "react";
import type { Flashcard } from "../types";
import { ChevronLeft, ChevronRight, CheckCircle, RotateCw } from "lucide-react";

interface FlashcardsProps {
  cards: Flashcard[];
  isActive: boolean;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ cards, isActive }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({});

  const totalCards = cards.length;

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }, 150);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
    }, 150);
  }, [totalCards]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page scrolling
        handleFlip();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, handleFlip, handleNext, handlePrev]);

  if (!cards || cards.length === 0) {
    return <div style={{ textAlign: "center", padding: "20px" }}>No flashcards generated for this topic.</div>;
  }

  const currentCard = cards[currentIndex];
  const isMastered = !!masteredCards[currentIndex];

  const toggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid flipping the card
    setMasteredCards((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  const masteredCount = Object.values(masteredCards).filter(Boolean).length;
  const masterPercent = Math.round((masteredCount / totalCards) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%", padding: "20px 0" }}>
      
      {/* Mastery Progress Bar */}
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
          <span style={{ fontWeight: 600 }}>Mastery Progress</span>
          <span>{masteredCount} of {totalCards} cards ({masterPercent}%)</span>
        </div>
        <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "9999px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
          <div style={{ width: `${masterPercent}%`, height: "100%", background: "var(--secondary)", transition: "width var(--transition-normal)" }}></div>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="flashcard-container" onClick={handleFlip}>
        <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
          
          {/* FRONT SIDE */}
          <div className="flashcard-front">
            <span className="badge badge-front">Question</span>
            <div style={{ fontSize: "1.35rem", fontWeight: 600, lineHeight: 1.5, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {currentCard.front}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "20px" }}>
              <RotateCw size={12} /> Click or press Space to reveal answer
            </div>
            
            {/* Master Button on Front */}
            <button
              onClick={toggleMastered}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isMastered ? "var(--secondary)" : "var(--text-muted)",
                transition: "color var(--transition-fast)"
              }}
              title="Mark as mastered"
            >
              <CheckCircle size={24} fill={isMastered ? "rgba(16, 185, 129, 0.2)" : "none"} />
            </button>
          </div>

          {/* BACK SIDE */}
          <div className="flashcard-back">
            <span className="badge badge-back">Answer</span>
            <div style={{ fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.6, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {currentCard.back}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "20px" }}>
              <RotateCw size={12} /> Click or press Space to view question
            </div>

            {/* Master Button on Back */}
            <button
              onClick={toggleMastered}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isMastered ? "var(--secondary)" : "var(--text-muted)",
                transition: "color var(--transition-fast)"
              }}
              title="Mark as mastered"
            >
              <CheckCircle size={24} fill={isMastered ? "rgba(16, 185, 129, 0.2)" : "none"} />
            </button>
          </div>

        </div>
      </div>

      {/* Control Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <button className="btn btn-secondary" onClick={handlePrev} style={{ borderRadius: "50%", padding: "12px", width: "48px", height: "48px" }}>
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          {currentIndex + 1} / {totalCards}
        </span>
        <button className="btn btn-secondary" onClick={handleNext} style={{ borderRadius: "50%", padding: "12px", width: "48px", height: "48px" }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "12px" }}>
        <span><kbd style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", marginRight: "4px" }}>←</kbd> Prev</span>
        <span><kbd style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", marginRight: "4px" }}>Space</kbd> Flip</span>
        <span><kbd style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", marginRight: "4px" }}>→</kbd> Next</span>
      </div>
    </div>
  );
};

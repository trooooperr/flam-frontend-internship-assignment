import React, { useState } from "react";
import type { QuizQuestion } from "../types";
import { Check, X, HelpCircle, RefreshCw, Trophy, ArrowRight } from "lucide-react";

interface QuizProps {
  questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  // The active questions for this run (can be subset of all questions during re-test)
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Track answers in current run: questionId -> { selectedOption, isCorrect }
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});
  
  // Track incorrect questions from the current run to filter for next re-test
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  
  // Overall state: "in-progress" | "completed"
  const [quizState, setQuizState] = useState<"in-progress" | "completed">("in-progress");
  
  // Flag indicating if the current run is a re-test of wrong answers
  const [isReTest, setIsReTest] = useState(false);

  const totalQuestions = activeQuestions.length;
  const currentQuestion = activeQuestions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return; // Prevent double-selecting

    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { selected: option, isCorrect }
    }));

    if (!isCorrect) {
      setIncorrectIds((prev) => {
        if (!prev.includes(currentQuestion.id)) {
          return [...prev, currentQuestion.id];
        }
        return prev;
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizState("completed");
      
      // Calculate final statistics for trigger confetti
      const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
      // Add the final question's status which was just selected
      const isFinalCorrect = selectedOption === currentQuestion.correctAnswer;
      const totalCorrect = correctCount + (isFinalCorrect ? 1 : 0);

      if (totalCorrect === totalQuestions) {
        triggerConfetti();
      }
    }
  };

  const triggerConfetti = async () => {
    try {
      const confetti = await import("canvas-confetti");
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log("Confetti library not loaded yet.");
    }
  };

  const handleRestartFull = () => {
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setIncorrectIds([]);
    setQuizState("in-progress");
    setIsReTest(false);
  };

  const handleReTestWrong = () => {
    // Filter down to incorrect questions from the run that just ended
    const wrongQuestions = questions.filter((q) => incorrectIds.includes(q.id));
    
    if (wrongQuestions.length === 0) return;

    setActiveQuestions(wrongQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setIncorrectIds([]);
    setQuizState("in-progress");
    setIsReTest(true);
  };

  if (!questions || questions.length === 0) {
    return <div style={{ textAlign: "center", padding: "20px" }}>No quiz questions generated for this topic.</div>;
  }

  // Calculate score properties
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", width: "100%", padding: "0 0 20px 0", height: "fit-content" }}>
      {quizState === "in-progress" ? (
        <div className="card">
          {/* Quiz Header Info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            <span style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 800, display: "flex", alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", background: "rgba(37, 99, 235, 0.08)", color: "var(--primary)", marginRight: "8px" }}>
                <HelpCircle size={13} />
              </span>
              {isReTest ? "Re-Testing Weak Areas" : "Practice Quiz"}
            </span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.5, marginBottom: "24px", color: "var(--text-primary)" }}>
            {currentQuestion.question}
          </h3>

          {/* Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentQuestion.options.map((option, idx) => {
              const alphabet = ["A", "B", "C", "D"][idx] || String(idx + 1);
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const hasAnswered = selectedOption !== null;

              let cardClass = "option-card";
              if (hasAnswered) {
                if (isSelected) {
                  cardClass += isCorrect ? " correct" : " incorrect";
                } else if (isCorrect) {
                  cardClass += " revealed-correct"; // Highlight correct answer if user got it wrong
                } else {
                  cardClass += " disabled";
                }
              } else if (isSelected) {
                cardClass += " selected";
              }

              return (
                <div
                  key={idx}
                  className={cardClass}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="option-index">{alphabet}</div>
                  <div style={{ flex: 1 }}>{option}</div>
                  {hasAnswered && isSelected && isCorrect && <Check size={18} color="#10b981" />}
                  {hasAnswered && isSelected && !isCorrect && <X size={18} color="var(--error)" />}
                </div>
              );
            })}
          </div>

          {/* Answer Explanation & Next Trigger */}
          {selectedOption !== null && (
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)", animation: "fadeIn 0.25s ease" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
                <HelpCircle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "4px" }}>
                    Explanation
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {currentQuestion.explanation}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={handleNext}>
                  {currentIndex + 1 === totalQuestions ? "Finish Quiz" : "Next Question"} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* QUIZ SCORE / RESULTS DASHBOARD */
        <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "20px", borderRadius: "50%", color: "var(--primary)", marginBottom: "24px" }}>
            <Trophy size={48} />
          </div>
          
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-primary)" }}>
            Quiz Completed!
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
            {isReTest ? "You've finished your re-test of weak areas." : "Here is how you performed on this study set:"}
          </p>

          {/* Radial score representation */}
          <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="var(--border-color)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={scorePercent === 100 ? "#10b981" : "var(--primary)"}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * scorePercent) / 100}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div style={{ position: "absolute", display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{correctCount} / {totalQuestions}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>CORRECT</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "340px", margin: "0 auto" }}>
            {incorrectIds.length > 0 && (
              <button className="btn btn-accent" onClick={handleReTestWrong} style={{ width: "100%" }}>
                <RefreshCw size={16} /> Re-test Wrong Answers ({incorrectIds.length})
              </button>
            )}
            
            <button className="btn btn-primary" onClick={handleRestartFull} style={{ width: "100%" }}>
              <RefreshCw size={16} /> Take Full Quiz Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

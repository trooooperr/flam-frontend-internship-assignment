import { useState, useEffect } from "react";
import type { StudySet, HistorySession } from "./types";
import { Navbar } from "./components/Navbar";
import { StudyInput } from "./components/StudyInput";
import { SummaryBlock } from "./components/SummaryBlock";
import { Flashcards } from "./components/Flashcards";
import { Quiz } from "./components/Quiz";
import { HistorySidebar } from "./components/HistorySidebar";
import { LoadingState, ErrorState } from "./components/States";
import { cleanAndParseJSON } from "./utils/jsonParser";
import { BookOpen, HelpCircle } from "lucide-react";

export default function App() {
  const [view, setView] = useState<"input" | "loading" | "error" | "dashboard">("input");
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz">("flashcards");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rawText, setRawText] = useState("");
  const [isMockData, setIsMockData] = useState(false);
  
  // Last parameters for retry
  const [lastQuery, setLastQuery] = useState<{ topic: string; notes: string; difficulty: string } | null>(null);
  
  // Saved Sessions History
  const [sessions, setSessions] = useState<HistorySession[]>([]);

  // Load saved sessions on mount
  useEffect(() => {
    const saved = localStorage.getItem("aetherstudy_sessions");
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved sessions:", e);
      }
    }
  }, []);

  const saveSessionsToLocalStorage = (updated: HistorySession[]) => {
    setSessions(updated);
    localStorage.setItem("aetherstudy_sessions", JSON.stringify(updated));
  };

  const handleGenerate = async (topic: string, notes: string, difficulty: string) => {
    setIsLoading(true);
    setView("loading");
    setErrorMsg("");
    setRawText("");
    setIsMockData(false);
    setLastQuery({ topic, notes, difficulty });

    try {
      const response = await fetch("http://localhost:5001/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic, notes, difficulty })
      });

      // Check header flag indicating mock data was served by proxy
      const mockHeader = response.headers.get("X-Mock-Data");
      if (mockHeader === "true") {
        setIsMockData(true);
      }

      const text = await response.text();
      setRawText(text);

      if (!response.ok) {
        let errDesc = "Failed to generate study materials.";
        try {
          const parsedErr = JSON.parse(text);
          errDesc = parsedErr.error || errDesc;
        } catch (_) {}
        throw new Error(errDesc);
      }

      // Parse and repair if necessary
      const parsedSet = cleanAndParseJSON(text);
      setStudySet(parsedSet);

      // Create new session
      const newSession: HistorySession = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        topic: topic || parsedSet.title || "Study Set",
        createdAt: new Date().toISOString(),
        data: parsedSet
      };

      const updatedSessions = [newSession, ...sessions];
      saveSessionsToLocalStorage(updatedSessions);
      setActiveSessionId(newSession.id);
      
      setIsLoading(false);
      setView("dashboard");
      setActiveTab("flashcards");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected network error occurred.");
      setIsLoading(false);
      setView("error");
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleGenerate(lastQuery.topic, lastQuery.notes, lastQuery.difficulty);
    } else {
      setView("input");
    }
  };

  const handleSelectSession = (session: HistorySession) => {
    setStudySet(session.data);
    setActiveSessionId(session.id);
    setIsMockData(false); // Saved data doesn't trigger active warning
    setView("dashboard");
    setActiveTab("flashcards");
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    saveSessionsToLocalStorage(updated);
    setIsSidebarOpen(false);
    
    if (activeSessionId === id) {
      setStudySet(null);
      setActiveSessionId(undefined);
      setView("input");
    }
  };

  const handleNewStudyClick = () => {
    setStudySet(null);
    setActiveSessionId(undefined);
    setView("input");
  };

  return (
    <div className="app-container">
      {/* Sidebar for navigation history */}
      <HistorySidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main panel content */}
      <div className="main-content">
        <Navbar
          isMockData={isMockData}
          activeTitle={studySet?.title}
          onNewClick={handleNewStudyClick}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative", overflow: "hidden" }}>
          {view === "input" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <StudyInput onSubmit={handleGenerate} isLoading={isLoading} />
            </div>
          )}

          {view === "loading" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <LoadingState />
            </div>
          )}

          {view === "error" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <ErrorState message={errorMsg} rawText={rawText} onRetry={handleRetry} />
            </div>
          )}

          {view === "dashboard" && studySet && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Dashboard Content Grid */}
              <div className="dashboard-grid" style={{ flex: 1, overflowY: "auto" }}>
                {/* Left Panel: Markdown summary and definitions */}
                <SummaryBlock summary={studySet.summary} concepts={studySet.keyConcepts} />

                {/* Right Panel: Interactive dynamic tabbed content */}
                <div style={{ display: "flex", flexDirection: "column", height: "fit-content" }}>
                  {/* Tab navigation locally inside the right column */}
                  <div className="tabs-container">
                    <button
                      className={`tab-btn ${activeTab === "flashcards" ? "active" : ""}`}
                      onClick={() => setActiveTab("flashcards")}
                    >
                      <BookOpen size={16} /> Flashcards
                    </button>
                    <button
                      className={`tab-btn ${activeTab === "quiz" ? "active" : ""}`}
                      onClick={() => setActiveTab("quiz")}
                    >
                      <HelpCircle size={16} /> Practice Quiz
                    </button>
                  </div>

                  {activeTab === "flashcards" ? (
                    <Flashcards cards={studySet.flashcards} isActive={activeTab === "flashcards"} />
                  ) : (
                    <Quiz questions={studySet.quiz} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

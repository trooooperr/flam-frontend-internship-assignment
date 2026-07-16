export interface Concept {
  term: string;
  definition: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface StudySet {
  title: string;
  summary: string; // Markdown summary content
  keyConcepts: Concept[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface HistorySession {
  id: string;
  topic: string;
  createdAt: string;
  data: StudySet;
  lastScore?: {
    correct: number;
    total: number;
  };
}

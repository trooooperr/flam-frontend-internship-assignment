import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Local Mock Study Set Generator
const generateMockData = (topic, difficulty) => {
  const normTopic = (topic || "").toLowerCase();
  
  if (normTopic.includes("react") || normTopic.includes("hook")) {
    return {
      title: "React Hooks & State Management",
      summary: "React Hooks were introduced in React 16.8. They allow you to use state and other React features without writing a class. The core hooks include `useState` for state management, `useEffect` for handling side effects, and `useContext` for consuming global context. Hooks follow strict rules: they must only be called at the top level of functional components and only from React function components or custom hooks.",
      keyConcepts: [
        {
          term: "useState",
          definition: "A hook that allows functional components to maintain and update local state. It returns a stateful value and a function to update it."
        },
        {
          term: "useEffect",
          definition: "A hook designed for performing side-effects (e.g., data fetching, subscriptions, manual DOM mutations) in function components."
        },
        {
          term: "Hook Rules",
          definition: "1. Only call Hooks at the top level (not inside loops or conditions). 2. Only call Hooks from React function components or custom Hooks."
        }
      ],
      flashcards: [
        {
          front: "What version of React introduced Hooks?",
          back: "React 16.8 (released in early 2019)."
        },
        {
          front: "What is the primary purpose of useEffect?",
          back: "To manage side effects in functional components, running code after the component renders."
        },
        {
          front: "Why can't Hooks be called inside conditional statements?",
          back: "React relies on the order in which Hooks are called. Conditional calls disrupt this call order, leading to state misalignment."
        },
        {
          front: "What is a custom Hook?",
          back: "A JavaScript function whose name starts with 'use' and that can call other Hooks, allowing reusable stateful logic."
        }
      ],
      quiz: [
        {
          id: "q1",
          question: "Which of the following is NOT a rule of React Hooks?",
          options: [
            "Only call Hooks at the top level",
            "Only call Hooks from React function components",
            "Only call Hooks inside helper functions",
            "Only call Hooks from custom Hooks"
          ],
          correctAnswer: "Only call Hooks inside helper functions",
          explanation: "Hooks cannot be called within nested functions or helper functions; they must reside at the root/top level of your React function components."
        },
        {
          id: "q2",
          question: "What does the dependency array in useEffect do?",
          options: [
            "Lists all variables the hook depends on to determine when to re-run",
            "Defines the state variables that can be modified inside the hook",
            "Restricts the render speed of the component",
            "Imports external libraries for side effects"
          ],
          correctAnswer: "Lists all variables the hook depends on to determine when to re-run",
          explanation: "If any value in the dependency array changes between renders, React re-runs the effect. If empty ([]), the effect runs only once after mount."
        },
        {
          id: "q3",
          question: "How do you prevent a component from re-rendering unless its props change?",
          options: [
            "Wrap it in React.memo()",
            "Use the useState hook",
            "Use the useContext hook",
            "Call the component inside an effect"
          ],
          correctAnswer: "Wrap it in React.memo()",
          explanation: "React.memo is a higher-order component that shallowly compares props and skips rendering if they haven't changed, optimizing performance."
        }
      ]
    };
  }

  if (normTopic.includes("photo") || normTopic.includes("plant") || normTopic.includes("synthe")) {
    return {
      title: "Photosynthesis & Plant Biology",
      summary: "Photosynthesis is the process used by plants, algae, and certain bacteria to harness energy from sunlight and turn it into chemical energy. It occurs primarily in the **chloroplasts** of plant leaves, utilizing chlorophyll pigments to capture light energy. The overall chemical equation is: **6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂**.",
      keyConcepts: [
        {
          term: "Chlorophyll",
          definition: "The green pigment found in chloroplasts that absorbs light energy (primarily blue and red wavelengths) for photosynthesis."
        },
        {
          term: "Light-Dependent Reactions",
          definition: "The initial stage of photosynthesis that occurs in the thylakoid membranes, converting solar energy into chemical energy (ATP and NADPH)."
        },
        {
          term: "Calvin Cycle",
          definition: "The light-independent stage occurring in the stroma, using carbon dioxide, ATP, and NADPH to synthesize glucose."
        }
      ],
      flashcards: [
        {
          front: "What is the primary site of photosynthesis inside plant cells?",
          back: "The chloroplast."
        },
        {
          front: "What gaseous byproduct is released during the light reactions?",
          back: "Oxygen (O₂), resulting from the photolysis (splitting) of water molecules."
        },
        {
          front: "What is the key output of the Calvin Cycle?",
          back: "G3P (a 3-carbon sugar), which is subsequently used to build glucose and other carbohydrates."
        }
      ],
      quiz: [
        {
          id: "q1",
          question: "Which pigment is primarily responsible for capturing light energy in plants?",
          options: [
            "Carotenoid",
            "Chlorophyll a",
            "Anthocyanin",
            "Phycobilin"
          ],
          correctAnswer: "Chlorophyll a",
          explanation: "Chlorophyll a is the principal light-absorbing pigment in photosynthesis, absorbing light mainly in the blue-violet and red wavelengths."
        },
        {
          id: "q2",
          question: "Where do the light-independent reactions (Calvin Cycle) take place?",
          options: [
            "Thylakoid membrane",
            "Stroma of the chloroplast",
            "Mitochondrial matrix",
            "Cell cytoplasm"
          ],
          correctAnswer: "Stroma of the chloroplast",
          explanation: "While light reactions occur in the thylakoids, the Calvin Cycle takes place in the fluid-filled stroma surrounding the thylakoid stacks."
        }
      ]
    };
  }

  // Generic Dynamic Fallback
  return {
    title: `Study Guide: ${topic || "General Knowledge"}`,
    summary: `This is a generated study guide for **${topic || "General Topics"}** (Difficulty: ${difficulty || "Medium"}). It reviews the fundamental parameters, core definitions, and concepts. Understanding this subject requires focusing on theoretical foundations and practical applications.`,
    keyConcepts: [
      {
        term: "Core Concept",
        definition: `The primary building block of ${topic || "the topic"}, representing the foundation of further research.`
      },
      {
        term: "System Interactions",
        definition: "How elements within this subject connect, exchange inputs, and influence outcomes."
      }
    ],
    flashcards: [
      {
        front: `What is the most fundamental question regarding ${topic || "this topic"}?`,
        back: "Understanding its core definition, historical origin, and modern practical relevance."
      },
      {
        front: "How do you apply this knowledge in real-world scenarios?",
        back: "By analyzing existing systems, identifying bottlenecks, and engineering custom solutions."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: `Which of the following best describes the key focus of ${topic || "this topic"}?`,
        options: [
          "Analyzing isolated parts without seeing the system",
          "Understanding principles, connections, and applications",
          "Memorizing formulas without practical context",
          "Ignoring historical research in the domain"
        ],
        correctAnswer: "Understanding principles, connections, and applications",
        explanation: "Comprehensive study requires analyzing how structural rules, practical use-cases, and theoretical pillars relate."
      },
      {
        id: "q2",
        question: "Why is persistent practice important when studying this subject?",
        options: [
          "It helps embed recall pathways, bridges theory with hands-on skills, and helps identify gaps",
          "It is required by the course syllabus to pass",
          "It decreases overall cognitive capacity over time",
          "It forces the brain to forget older unrelated concepts"
        ],
        correctAnswer: "It helps embed recall pathways, bridges theory with hands-on skills, and helps identify gaps",
        explanation: "Structured repetition (like flashcards and quizzes) strengthens synapse recall and reveals areas needing deeper study."
      }
    ]
  };
};

// POST Generation Endpoint
app.post("/api/generate", async (req, res) => {
  const { topic, notes, difficulty = "Medium" } = req.body;

  if (!topic && !notes) {
    return res.status(400).json({ error: "Please provide a topic or notes content." });
  }

  const query = topic ? `Topic: ${topic}. Notes: ${notes || "None provided"}` : `Notes: ${notes}`;

  // Check if Gemini Key is available
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.log("⚠️ No GEMINI_API_KEY found or using placeholder. Serving mock data.");
    
    // Simulate generation latency (700ms - 1500ms) for high-fidelity testing
    const latency = 700 + Math.random() * 800;
    setTimeout(() => {
      const mockResult = generateMockData(topic || notes, difficulty);
      res.setHeader("X-Mock-Data", "true");
      return res.status(200).json(mockResult);
    }, latency);
    return;
  }

  try {
    // Initialize Google Gen AI
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the latest recommended model for fast structured JSON outputs
    const model = ai.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `You are an advanced study assistant. Generate a study set containing a summary, key concepts, flashcards, and multiple-choice quiz questions based on the user's input.
You MUST return a JSON object matching this exact schema:
{
  "title": "Short title of the study set",
  "summary": "A detailed, structured summary in Markdown format, explaining the main ideas clearly",
  "keyConcepts": [
    {
      "term": "Term or concept name",
      "definition": "Detailed definition or explanation"
    }
  ],
  "flashcards": [
    {
      "front": "Clear question, prompt, or term to memorize",
      "back": "Short, clear answer, definition, or formula"
    }
  ],
  "quiz": [
    {
      "id": "A unique question id e.g. q1, q2, q3",
      "question": "The quiz question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The string of the correct answer, which must be exactly identical to one of the options in the array",
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Difficulty level requested: ${difficulty}.
Ensure the flashcards cover a wide range of facts, and the quiz has at least 3-5 multiple-choice questions with plausible distractor options.
CRITICAL FORMATTING INSTRUCTION: Do NOT use LaTeX markup notations (like $$, \[, \\xrightarrow, \\text, etc.) for math formulas or chemical equations. Instead, write equations and formulas in simple, plain, readable formatted text (e.g. "6CO2 + 6H2O -> C6H12O6 + 6O2" or using standard Unicode subscript characters). All formulas must be outputted as clear human-readable strings.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser Input:\n${query}` }] }]
    });

    const text = result.response.text();
    
    // Strip markdown fences and trailing characters after the last } before parsing on the server
    let cleanedText = text.trim();
    const codeBlockMatch = /```(?:json)?\s*([\s\S]*?)\s*```/.exec(cleanedText);
    if (codeBlockMatch && codeBlockMatch[1]) {
      cleanedText = codeBlockMatch[1].trim();
    }
    
    const lastBraceIndex = cleanedText.lastIndexOf("}");
    if (lastBraceIndex !== -1) {
      cleanedText = cleanedText.substring(0, lastBraceIndex + 1);
    }

    try {
      const parsedData = JSON.parse(cleanedText);
      return res.status(200).json(parsedData);
    } catch (parseError) {
      console.warn("Direct JSON parsing failed on server, falling back to client-side repair parser.");
      return res.status(200).send(cleanedText);
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({
      error: "Failed to generate study materials.",
      details: error.message || error,
      rawOutput: error.rawResponseText || ""
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Study Assistant Server running on http://localhost:${PORT}`);
});

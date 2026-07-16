# AetherStudy.ai - Interactive AI Study Assistant

AetherStudy.ai is a premium, interactive AI study assistant built with React, TypeScript, and Node.js. It transforms free-form notes, textbook paragraphs, or prompt topics into comprehensive study guides complete with structured summaries, interactive key concepts, 3D animated flashcards, and a practice quiz featuring a dedicated "Re-test Wrong Answers" loop for targeted mastery.

## 🚀 Quick Start (Local Run)

To run the application locally, you will spin up both the backend proxy gateway and the Vite React frontend.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Start the Backend Server
Navigate to the `server` directory, install dependencies, and start the development server:

```bash
cd server
npm install
npm run dev
```

*The server runs on **http://localhost:5001**.*

**API Key Setup (Optional but recommended):**
- Copy `.env.example` to `.env`.
- Add your Gemini API Key: `GEMINI_API_KEY=your_actual_api_key`.
- If no API key is specified, the server automatically falls back to **Mock Mode**, generating rich, custom static guides for testing immediately (try inputting topics like `React Hooks` or `Photosynthesis`).

### 2. Start the Frontend Client
Open a new terminal tab, navigate to the `client` directory, install dependencies, and start the dev server:

```bash
cd client
npm install
npm run dev
```

*The frontend will run on **http://localhost:5173** (or the next available port).*

---

## 🎨 UI/UX Features & Polish

1. **Dashboard Interface**: Displays a sidebar on the left containing historical saved sessions (persisted in `localStorage`), and a main workspace split into:
   - **Left Column**: Summary view with a custom Markdown text parser + interactive key concepts. Clicking on concepts highlights them and expands their definition.
   - **Right Column**: Stateful workspace showing a tab-controlled layout for Flashcards and Practice Quizzes.
2. **3D Flashcards**: Flashcards utilize CSS 3D perspective animations (`rotateY`) to flip between front (question) and back (answer). It supports:
   - Keyboard controls: `Space` to flip, `ArrowLeft` / `ArrowRight` to navigate cards.
   - Mastery progress: Mark cards as "Mastered" to see your completion bar fill in real-time.
3. **Practice Quiz & "Re-test Wrong Answers"**:
   - Immediate feedback: Option selections animate green for correct, red for incorrect, and highlight correct items in light green.
   - Explanations are shown directly after each answer choice.
   - Radial progress ring on completion.
   - **Confetti celebration** on getting a perfect score.
   - **Re-test loop**: If you get questions wrong, a "Re-test Wrong Answers" button allows you to launch a quiz containing *only* the questions answered incorrectly, running recursively until you master them all.
4. **Responsive Layout**: Adapts gracefully to tablets and mobile displays by collapsing the sidebar and reflowing the timeline cards.

---

## 🛡️ Robust AI Integration & Error Handling

- **Proxy Backend Architecture**: Never exposes API keys directly to the client. The frontend talks to the Node.js backend proxy.
- **Gemini Structured JSON Mode**: Configures Gemini to return JSON payloads conforming to a strict schema (`responseMimeType: "application/json"`).
- **Custom Balancing JSON Parser**: If the model output is truncated or slightly malformed (e.g. missing brackets or quotes), our custom parser (`client/src/utils/jsonParser.ts`) scans the string, extracts the true JSON object range by counting open bracket scopes, and repairs truncated endpoints before parsing.
- **Fail-safe Schema Normalizer**: Runs field-level schema validation. If items like descriptions or distractor options are missing, it heals them with context-aware placeholders instead of crashing.
- **High-Fidelity Loading state**: Skeletons pulse while generating, accompanied by randomized educational quotes to keep the user engaged.
- **Error Boundaries**: Displays structured warnings if requests fail, including a hidden accordion with raw AI outputs for developer debugging and a manual "Retry" trigger.

---

## 🤖 AI Usage Note

As requested, here is a summary of what AI was used for in this project:
- Refined the custom **JSON balancing parser** to handle nested arrays and close strings/brackets recursively in JavaScript.
- Optimized the **3D rotate transition** and card positioning inside `index.css`.
- Generated the list of witty loader phrases and mock database sets.

---

## ⏱️ Time Spent & Limitations

### Time Spent
- **Planning & Schema Design**: 1 hour
- **Backend & Proxy Integration**: 1.5 hours
- **Frontend State Machinery (Quiz Re-testing, Flashcard Keyboard Events)**: 3 hours
- **Vanilla CSS System & Mobile Responsiveness**: 2 hours
- **Testing & Edge-Case JSON Repair Refinement**: 0.5 hours
- **Total**: ~8 hours

### Known Limitations
- The custom Markdown parser supports simple headers, bullet points, bold tags, and code highlights. More advanced markdown constructs (like nested tables or images) are parsed as normal text blocks.
- The history sidebar utilizes browser `localStorage`, limiting history persistence to the local browser profile.
- In Mock Mode, queries matching "react", "photo", or "plant" will serve customized, relevant mock study guides. Other inputs default to a generic, study-themed layout.

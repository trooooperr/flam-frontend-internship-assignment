import type { StudySet } from "../types";

/**
 * Attempts to extract, repair, and parse JSON from a potentially malformed or truncated string.
 */
export function cleanAndParseJSON(rawText: string): StudySet {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Received empty or non-string input from the AI model.");
  }

  let cleaned = rawText.trim();

  // 1. Strip Markdown Code Fences (e.g. ```json ... ```)
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  const match = codeBlockRegex.exec(cleaned);
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  // Reset regex index
  codeBlockRegex.lastIndex = 0;

  // 2. Find first '{'
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace === -1) {
    throw new Error("No JSON object structure found in the AI response.");
  }
  cleaned = cleaned.substring(firstBrace);

  // 3. Scan the string to see if it contains a complete, balanced root JSON object.
  // If it does, we extract exactly that object and discard any trailing text.
  let isInsideString = false;
  let isEscaped = false;
  const stack: ("{" | "[")[] = [];
  let jsonEndIndex = -1;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (isInsideString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === '"') {
        isInsideString = false;
      }
    } else {
      if (char === '"') {
        isInsideString = true;
      } else if (char === "{") {
        stack.push("{");
      } else if (char === "[") {
        stack.push("[");
      } else if (char === "}") {
        if (stack[stack.length - 1] === "{") {
          stack.pop();
        }
      } else if (char === "]") {
        if (stack[stack.length - 1] === "[") {
          stack.pop();
        }
      }
      
      // If we popped the last element and stack is empty, we found the end of the root object!
      if (stack.length === 0 && jsonEndIndex === -1) {
        jsonEndIndex = i;
        break;
      }
    }
  }

  let payload = cleaned;
  if (jsonEndIndex !== -1) {
    // We found a complete balanced object, extract it
    payload = cleaned.substring(0, jsonEndIndex + 1);
  }

  // 4. Attempt direct parse
  try {
    const parsed = JSON.parse(payload);
    return validateAndNormalizeSchema(parsed);
  } catch (parseError) {
    console.warn("Direct JSON parsing failed. Attempting structural repair...", parseError);
  }

  // 5. Try structural repair for truncated JSON
  try {
    const repaired = repairTruncatedJSON(payload);
    const parsed = JSON.parse(repaired);
    return validateAndNormalizeSchema(parsed);
  } catch (repairError) {
    console.error("Structural repair failed:", repairError);
    throw new Error(`Failed to parse AI response. The JSON structure was invalid or severely truncated: ${repairError instanceof Error ? repairError.message : String(repairError)}`);
  }
}

/**
 * Scans a truncated JSON string and appends missing closing quotes, brackets, and braces.
 */
function repairTruncatedJSON(jsonStr: string): string {
  let isInsideString = false;
  let isEscaped = false;
  const stack: ("{" | "[")[] = [];

  let index = 0;
  while (index < jsonStr.length) {
    const char = jsonStr[index];

    if (isInsideString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === '"') {
        isInsideString = false;
      }
    } else {
      if (char === '"') {
        isInsideString = true;
      } else if (char === "{") {
        stack.push("{");
      } else if (char === "[") {
        stack.push("[");
      } else if (char === "}") {
        if (stack[stack.length - 1] === "{") {
          stack.pop();
        }
      } else if (char === "]") {
        if (stack[stack.length - 1] === "[") {
          stack.pop();
        }
      }
    }
    index++;
  }

  let repairedStr = jsonStr;

  // If we cut off inside a string, close it first
  if (isInsideString) {
    repairedStr += '"';
  }

  // Close opened braces/brackets in reverse order
  while (stack.length > 0) {
    const openElement = stack.pop();
    if (openElement === "{") {
      // Check if we need to remove a trailing comma before closing
      repairedStr = removeTrailingComma(repairedStr);
      repairedStr += "}";
    } else if (openElement === "[") {
      repairedStr = removeTrailingComma(repairedStr);
      repairedStr += "]";
    }
  }

  return repairedStr;
}

function removeTrailingComma(str: string): string {
  const trimmed = str.trimEnd();
  if (trimmed.endsWith(",")) {
    return trimmed.slice(0, -1);
  }
  return str;
}

/**
 * Validates the parsed object against the StudySet schema, adding fallbacks for minor missing items.
 */
function validateAndNormalizeSchema(obj: any): StudySet {
  if (!obj || typeof obj !== "object") {
    throw new Error("Parsed result is not a valid JSON object.");
  }

  const studySet: StudySet = {
    title: typeof obj.title === "string" ? obj.title : "Untitled Study Set",
    summary: typeof obj.summary === "string" ? obj.summary : "No summary available for this study set.",
    keyConcepts: [],
    flashcards: [],
    quiz: []
  };

  // Validate Key Concepts
  if (Array.isArray(obj.keyConcepts)) {
    studySet.keyConcepts = obj.keyConcepts
      .filter((item: any) => item && typeof item === "object")
      .map((item: any) => ({
        term: typeof item.term === "string" ? item.term : "Concept",
        definition: typeof item.definition === "string" ? item.definition : "No definition provided."
      }));
  }

  // Validate Flashcards
  if (Array.isArray(obj.flashcards)) {
    studySet.flashcards = obj.flashcards
      .filter((item: any) => item && typeof item === "object")
      .map((item: any) => ({
        front: typeof item.front === "string" ? item.front : "Question / Concept",
        back: typeof item.back === "string" ? item.back : "Answer / Explanation"
      }));
  }

  // Validate Quiz
  if (Array.isArray(obj.quiz)) {
    studySet.quiz = obj.quiz
      .filter((item: any) => item && typeof item === "object")
      .map((item: any, index: number) => {
        const id = typeof item.id === "string" ? item.id : `q${index + 1}`;
        const question = typeof item.question === "string" ? item.question : "Multiple Choice Question";
        
        let options: string[] = [];
        if (Array.isArray(item.options)) {
          options = item.options.map(String);
        }
        
        // Ensure we have at least 2 options, otherwise supply standard fallbacks
        if (options.length < 2) {
          options = ["Option A", "Option B", "True", "False"];
        }

        let correctAnswer = typeof item.correctAnswer === "string" ? item.correctAnswer : options[0];
        // Ensure correctAnswer is exactly one of the options
        if (!options.includes(correctAnswer)) {
          // Attempt simple case-insensitive match or fall back to first option
          const match = options.find(o => o.toLowerCase() === correctAnswer.toLowerCase());
          correctAnswer = match || options[0];
        }

        const explanation = typeof item.explanation === "string" ? item.explanation : "No explanation provided.";

        return { id, question, options, correctAnswer, explanation };
      });
  }

  // If there are no flashcards or quiz questions, throw to trigger a clean regeneration
  if (studySet.flashcards.length === 0 && studySet.quiz.length === 0) {
    throw new Error("The study guide is missing both flashcards and quiz questions.");
  }

  return studySet;
}

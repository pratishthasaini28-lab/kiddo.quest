
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (subject: Subject, level: number): Promise<Question[]> => {
  const prompt = `Act as a children's teacher for a game with 10 levels (current: Level ${level}).
  Subject: ${subject}

  LEVEL-SPECIFIC RULES:
  - LEVEL 1 (TODDLER): 
    - Subject English: Focus ONLY on single alphabet matching. Example: "Which one starts with A?" or "Click the Apple!". 
    - Options should be simple words or characters.
    - imageHint MUST be a single identifiable cartoon object (e.g., 'cute-apple', 'happy-ball').
  - LEVEL 2-4 (PRE-SCHOOL): Focus on colors, basic counting (1-5), and animal sounds.
  - LEVEL 5-7 (KINDERGARTEN): 3-letter words, addition up to 10, sharing morals.
  - LEVEL 8-10 (PRIMARY): Simple sentences, subtraction, complex moral choices.

  RESPONSE FORMAT:
  - Generate 3 unique questions.
  - type: 'multiple-choice'.
  - imageHint: 2-3 words for a cute cartoon image.
  - Ensure 'text' is short and fun.

  Return a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            imageHint: { type: Type.STRING }
          },
          required: ["id", "type", "text", "answer", "imageHint", "options"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

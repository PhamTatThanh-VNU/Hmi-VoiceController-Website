import { GoogleGenAI } from "@google/genai";
import { promt_gemini } from '../constants.js';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const sendMessageToAI = async (message) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: API_KEY,
    });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        systemInstruction: promt_gemini,
      },
    });
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    throw new Error("Error sending message to AI: " + error.message);
  }
};

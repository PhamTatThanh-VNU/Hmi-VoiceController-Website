import { GoogleGenAI } from "@google/genai";

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
        systemInstruction:
          "Bạn là một trợ lý AI thân thiện giúp đỡ người bị khuyết tật tay chân, hãy trả lời bằng tiếng việt",
      },
    });
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    throw new Error("Error sending message to AI: " + error.message);
  }
};

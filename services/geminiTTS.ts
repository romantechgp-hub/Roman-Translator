
import { GoogleGenAI, Modality } from "@google/genai";
import { TTSConfig } from "../types.ts";
import { GEMINI_MODEL_TTS } from "../constants.ts";

export async function generateSpeech(text: string, config: TTSConfig): Promise<string> {
  // Creating a new instance right before the call as per recommended practices for up-to-date API key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let systemInstruction = "";
  if (config.style === 'News Presenter') {
    systemInstruction = "You are a professional news anchor. Read the text with a formal, authoritative, and clear tone.";
  } else {
    systemInstruction = `You are a helpful assistant speaking with a ${config.emotion.toLowerCase()} emotional tone.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TTS,
      contents: [{ parts: [{ text: text }] }],
      config: {
        systemInstruction: systemInstruction,
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: config.voiceId },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      console.error("Gemini API Response:", response);
      throw new Error('এআই অডিও জেনারেট করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার এপিআই কি চেক করুন।');
    }

    return base64Audio;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
}

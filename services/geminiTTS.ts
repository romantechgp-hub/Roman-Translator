
import { GoogleGenAI, Modality } from "@google/genai";
import { TTSConfig } from "../types.ts";
import { GEMINI_MODEL_TTS } from "../constants.ts";

export async function generateSpeech(text: string, config: TTSConfig): Promise<string> {
  // Always use a fresh instance to pick up injected keys in preview environments.
  // Using process.env.API_KEY directly during initialization.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let systemInstruction = "";
  if (config.style === 'News Presenter') {
    systemInstruction = "You are a professional news anchor. Read the text with a formal, authoritative, and clear tone.";
  } else {
    systemInstruction = `You are a helpful assistant speaking with a ${config.emotion.toLowerCase()} emotional tone. Use the specified voice: ${config.voiceId}.`;
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

    const candidate = response.candidates?.[0];
    const base64Audio = candidate?.content?.parts?.find(part => part.inlineData)?.inlineData?.data;
    
    if (!base64Audio) {
      console.error("Gemini TTS Response structure error:", response);
      throw new Error('সার্ভার থেকে অডিও ডাটা পাওয়া যায়নি। এপিআই লিমিট শেষ হতে পারে।');
    }

    return base64Audio;
  } catch (error: any) {
    console.error("Gemini TTS Service Error:", error);
    
    if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID') || error.message?.includes('not found')) {
      throw new Error('আপনার এপিআই কী সঠিক নয় অথবা এটি কাজ করছে না। দয়া করে সঠিক কী সিলেক্ট করুন।');
    }
    
    throw new Error(error.message || 'ভয়েস জেনারেট করতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
  }
}

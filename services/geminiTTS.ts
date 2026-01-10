
import { GoogleGenAI, Modality } from "@google/genai";
import { TTSConfig } from "../types.ts";
import { GEMINI_MODEL_TTS } from "../constants.ts";

export async function generateSpeech(text: string, config: TTSConfig): Promise<string> {
  // Directly using process.env.API_KEY as per instructions. 
  // The SDK will handle the case if it's missing or invalid.
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
      console.error("Gemini TTS Empty Response:", response);
      throw new Error('ভয়েস ডাটা পাওয়া যায়নি। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।');
    }

    return base64Audio;
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    
    // Handle specific API errors
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('403')) {
      throw new Error('আপনার এপিআই কী (API Key) সঠিক নয় অথবা কাজ করছে না।');
    }
    
    throw new Error(error.message || 'এআই ভয়েস তৈরি করতে সমস্যা হয়েছে।');
  }
}


import { GoogleGenAI, Modality } from "@google/genai";
import { TTSConfig } from "../types.ts";
import { GEMINI_MODEL_TTS } from "../constants.ts";

export async function generateSpeech(text: string, config: TTSConfig): Promise<string> {
  // Ensure the API Key is available. In some environments it might be on window.process.env
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;

  if (!apiKey) {
    throw new Error('এপিআই কী (API Key) পাওয়া যায়নি। অনুগ্রহ করে আপনার প্ল্যাটফর্ম সেটিংস চেক করুন।');
  }

  const ai = new GoogleGenAI({ apiKey });
  
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

    // Check if we have a valid response candidate and parts
    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error('সার্ভার থেকে কোনো রেসপন্স পাওয়া যায়নি।');
    }

    const base64Audio = candidate.content?.parts?.find(part => part.inlineData)?.inlineData?.data;
    
    if (!base64Audio) {
      console.error("Gemini TTS Error Response:", response);
      throw new Error('ভয়েস ডাটা তৈরি করা সম্ভব হয়নি। আপনার ইনপুট টেক্সট বা এপিআই লিমিট চেক করুন।');
    }

    return base64Audio;
  } catch (error: any) {
    console.error("Gemini TTS Critical Error:", error);
    
    // Provide user-friendly messages for common production errors
    if (error.message?.includes('403')) {
      throw new Error('এপিআই কী অনুমোদিত নয় (403 Forbidden)।');
    } else if (error.message?.includes('429')) {
      throw new Error('অতিরিক্ত রিকোয়েস্টের কারণে লিমিট শেষ হয়ে গেছে (429 Too Many Requests)।');
    } else if (error.message?.includes('500')) {
      throw new Error('সার্ভার ত্রুটি (500 Internal Server Error)। কিছুক্ষণ পর চেষ্টা করুন।');
    }
    
    throw new Error(error.message || 'এআই ভয়েস তৈরি করতে সমস্যা হয়েছে।');
  }
}

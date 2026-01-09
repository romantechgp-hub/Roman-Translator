
import { GoogleGenAI, Modality } from "@google/genai";
import { TTSConfig } from "../types";
import { GEMINI_MODEL_TTS } from "../constants";

export async function generateSpeech(text: string, config: TTSConfig): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Construct a prompt that guides the model on emotion and persona
  let systemPersona = "";
  if (config.style === 'News Presenter') {
    systemPersona = "Read the following text strictly as a professional news anchor/presenter with a formal and authoritative tone.";
  } else {
    systemPersona = `Read the following text with a ${config.emotion.toLowerCase()} emotional tone.`;
  }

  const prompt = `${systemPersona}
  
  Text: ${text}`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL_TTS,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
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
    throw new Error('Failed to generate audio content');
  }

  return base64Audio;
}

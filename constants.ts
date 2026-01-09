
import { VoiceOption, Emotion, Style } from './types';

export const VOICES: VoiceOption[] = [
  { id: 'Kore', name: 'Kore (Clear)', gender: 'female', description: 'Bright and articulate' },
  { id: 'Puck', name: 'Puck (Youthful)', gender: 'male', description: 'Energetic and clear' },
  { id: 'Charon', name: 'Charon (Deep)', gender: 'male', description: 'Authoritative and resonant' },
  { id: 'Fenrir', name: 'Fenrir (Mature)', gender: 'male', description: 'Sophisticated tone' },
  { id: 'Zephyr', name: 'Zephyr (Soft)', gender: 'female', description: 'Gentle and friendly' },
];

export const EMOTIONS: Emotion[] = ['Neutral', 'Happy', 'Sad', 'Excited', 'Angry', 'Calm'];
export const STYLES: Style[] = ['Normal', 'News Presenter'];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'Bengali' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
];

export const GEMINI_MODEL_TTS = 'gemini-2.5-flash-preview-tts';

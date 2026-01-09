
export type VoiceID = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';

export interface VoiceOption {
  id: VoiceID;
  name: string;
  gender: 'male' | 'female';
  description: string;
}

export type Emotion = 'Neutral' | 'Happy' | 'Sad' | 'Excited' | 'Angry' | 'Calm';
export type Style = 'Normal' | 'News Presenter';

export interface TTSConfig {
  voiceId: VoiceID;
  emotion: Emotion;
  style: Style;
}

export interface TranslationResult {
  translatedText: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

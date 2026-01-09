
import React from 'react';
import { VOICES, EMOTIONS, STYLES } from '../constants';
import { TTSConfig, VoiceID, Emotion, Style } from '../types';

interface SettingsPanelProps {
  config: TTSConfig;
  onChange: (config: TTSConfig) => void;
}

const emotionMap: Record<Emotion, string> = {
  'Neutral': 'স্বাভাবিক',
  'Happy': 'খুশি',
  'Sad': 'দুঃখিত',
  'Excited': 'উত্তেজিত',
  'Angry': 'রাগান্বিত',
  'Calm': 'শান্ত'
};

const styleMap: Record<Style, string> = {
  'Normal': 'সাধারণ কথা',
  'News Presenter': 'সংবাদ পাঠক'
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 bengali">ভয়েস আর্টিস্ট</label>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {VOICES.map((v) => (
            <button
              key={v.id}
              onClick={() => onChange({ ...config, voiceId: v.id })}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                config.voiceId === v.id
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-indigo-300 bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-900">{v.name}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  v.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {v.gender === 'male' ? 'পুরুষ' : 'নারী'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 bengali">আবেগ / মুড</label>
        <div className="grid grid-cols-2 gap-2">
          {EMOTIONS.map((e) => (
            <button
              key={e}
              disabled={config.style === 'News Presenter'}
              onClick={() => onChange({ ...config, emotion: e })}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all bengali ${
                config.emotion === e
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
              } ${config.style === 'News Presenter' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {emotionMap[e]}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-2 bengali">নোট: সংবাদ মোডে আবেগ কাজ করবে না।</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 bengali">ভয়েস স্টাইল</label>
        <div className="space-y-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...config, style: s })}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                config.style === s
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${config.style === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {s === 'Normal' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  )}
                </div>
                <span className="font-semibold text-slate-800 bengali">{styleMap[s]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

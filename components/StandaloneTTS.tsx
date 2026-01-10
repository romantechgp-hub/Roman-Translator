
import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiTTS.ts';
import { TTSConfig } from '../types.ts';
import SettingsPanel from './SettingsPanel.tsx';
import AudioControls from './AudioControls.tsx';

const StandaloneTTS: React.FC = () => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [config, setConfig] = useState<TTSConfig>({
    voiceId: 'Zephyr',
    emotion: 'Neutral',
    style: 'Normal'
  });

  const handleGenerateVoice = async () => {
    if (!text.trim()) return;
    setStatus('loading');
    setErrorMessage('');
    setBase64Audio(null);
    try {
      const audio = await generateSpeech(text, config);
      setBase64Audio(audio);
      setStatus('success');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'ভয়েস জেনারেট করার সময় একটি সমস্যা হয়েছে।');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 bengali">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2M11 9h2m7 7v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1m15 5H6M10 3h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V4a1 1 0 011-1z" />
          </svg>
          টেক্সট টু ভয়েস সিন্থেসিস
        </h3>
        <p className="text-slate-500 mb-6 text-sm bengali">সরাসরি লেখা লিখুন এবং হাই-কোয়ালিটি এআই ভয়েস তৈরি করুন।</p>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="এখানে আপনার টেক্সট লিখুন বা পেস্ট করুন..."
          className="w-full h-64 p-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 resize-none text-xl transition-all bengali"
        />

        <div className="mt-8">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 bengali">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ভয়েস কন্ট্রোল
          </h4>
          <SettingsPanel config={config} onChange={setConfig} />
        </div>

        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm bengali">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleGenerateVoice}
          disabled={!text.trim() || status === 'loading'}
          className={`w-full py-4 mt-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all bengali ${
            !text.trim() || status === 'loading'
              ? 'bg-slate-100 text-slate-400 border border-slate-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-[0.99]'
          }`}
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              তৈরি হচ্ছে...
            </span>
          ) : (
            <>প্রফেশনাল ভয়েসওভার তৈরি করুন <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></>
          )}
        </button>

        <AudioControls base64Audio={base64Audio} text={text} />
      </div>
    </div>
  );
};

export default StandaloneTTS;

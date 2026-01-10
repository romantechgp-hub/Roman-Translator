
import React, { useState } from 'react';
import { translateText } from '../services/translationService.ts';
import { generateSpeech } from '../services/geminiTTS.ts';
import { TTSConfig } from '../types.ts';
import { SUPPORTED_LANGUAGES } from '../constants.ts';
import SettingsPanel from './SettingsPanel.tsx';
import AudioControls from './AudioControls.tsx';

const TranslatorView: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('bn');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [ttsStatus, setTtsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [config, setConfig] = useState<TTSConfig>({
    voiceId: 'Kore',
    emotion: 'Neutral',
    style: 'Normal'
  });

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setStatus('loading');
    setErrorMessage('');
    setBase64Audio(null);
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage('অনুবাদ করতে সমস্যা হয়েছে।');
    }
  };

  const handleGenerateVoice = async () => {
    if (!translatedText.trim()) return;
    setTtsStatus('loading');
    setErrorMessage('');
    setBase64Audio(null);
    try {
      const audio = await generateSpeech(translatedText, config);
      setBase64Audio(audio);
      setTtsStatus('success');
    } catch (error: any) {
      setTtsStatus('error');
      setErrorMessage(error.message || 'ভয়েস তৈরি করতে ব্যর্থ হয়েছে।');
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
        {/* Source Text Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => { setSourceText(''); setTranslatedText(''); setBase64Audio(null); }}
              className="text-slate-400 hover:text-slate-600 text-sm transition-colors bengali"
            >
              মুছুন
            </button>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={`${SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name} ভাষায় লিখুন...`}
            className="w-full h-48 p-4 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-lg transition-all bengali"
          />
          <button
            onClick={handleTranslate}
            disabled={status === 'loading' || !sourceText.trim()}
            className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200/50 bengali ${
              status === 'loading' 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                অনুবাদ হচ্ছে...
              </span>
            ) : (
              <>অনুবাদ করুন <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
            )}
          </button>
        </div>

        {/* Swap Button */}
        <button 
          onClick={swapLanguages}
          className="hidden md:flex absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all active:scale-90"
          title="ভাষা অদলবদল করুন"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>

        {/* Translation Target Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm appearance-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className={`w-full h-48 p-4 rounded-xl border border-slate-100 bg-slate-50 text-lg overflow-y-auto custom-scrollbar bengali ${!translatedText && 'flex items-center justify-center italic text-slate-400'}`}>
            {translatedText || "অনুবাদ এখানে দেখা যাবে..."}
          </div>
          <button
            onClick={handleGenerateVoice}
            disabled={!translatedText || ttsStatus === 'loading'}
            className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bengali ${
              !translatedText || ttsStatus === 'loading'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 active:scale-[0.98]'
            }`}
          >
            {ttsStatus === 'loading' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ভয়েস তৈরি হচ্ছে...
              </span>
            ) : (
              <>এআই ভয়েস তৈরি করুন <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg></>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm bengali flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {errorMessage}
        </div>
      )}

      <div className="mt-12 pt-12 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 bengali">ভয়েস সিন্থেসিস সেটিংস</h2>
        </div>
        <SettingsPanel config={config} onChange={setConfig} />
        <AudioControls base64Audio={base64Audio} text={translatedText} />
      </div>
    </div>
  );
};

export default TranslatorView;

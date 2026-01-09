
import React, { useState } from 'react';
import TranslatorView from './components/TranslatorView';
import StandaloneTTS from './components/StandaloneTTS';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'translator' | 'tts'>('translator');

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                  Roman <span className="text-indigo-600">Translator</span>
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 text-[10px] md:text-xs text-slate-500 font-medium">
                  <span className="bengali">তৈরি করেছেন <span className="text-indigo-600 font-bold">Rimon Mahmud Roman</span></span>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <a href="mailto:romantechgp@gmail.com" className="hover:text-indigo-600 transition-colors">romantechgp@gmail.com</a>
                </div>
              </div>
            </div>

            <nav className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('translator')}
                className={`px-3 md:px-6 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                  activeTab === 'translator'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <svg className="w-4 h-4 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M13 15.5c-.832 1.664-2.35 3.5-4.5 4.5M19 5h-2M9 3h2m.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                অনুবাদক
              </button>
              <button
                onClick={() => setActiveTab('tts')}
                className={`px-3 md:px-6 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                  activeTab === 'tts'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <svg className="w-4 h-4 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                ভয়েস
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight bengali">
              {activeTab === 'translator' ? (
                <>রোমান <span className="text-indigo-600">এআই ভয়েস</span> অনুবাদক</>
              ) : (
                <>প্রো-লেভেল <span className="text-indigo-600">টেক্সট টু ভয়েস</span> সিন্থেসিস</>
              )}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg bengali">
              {activeTab === 'translator' 
                ? "যেকোনো ভাষা থেকে অনুবাদ করুন এবং তাৎক্ষণিকভাবে আবেগপূর্ণ রোমান এআই ভয়েস তৈরি করুন।"
                : "রোমান এআই ইঞ্জিনের মাধ্যমে আপনার স্ক্রিপ্ট থেকে স্বচ্ছ এবং স্বাভাবিক অডিও তৈরি করুন।"}
            </p>
          </div>

          <div className="animate-in fade-in zoom-in-95 duration-500">
            {activeTab === 'translator' ? <TranslatorView /> : <StandaloneTTS />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 opacity-60 grayscale">
              <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <span className="font-bold">Roman Translator</span>
            </div>
            <p className="text-xs text-slate-400 bengali mt-1">শিশুদের এআই ব্যবহার সহজ করার জন্য ক্ষুদ্র উদ্যোগ</p>
          </div>
          
          <div className="text-center">
             <p className="text-slate-400 text-sm bengali">পাওয়ার্ড বাই রোমান এআই এবং জেমিনি</p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium border border-slate-100 px-3 py-1 rounded-full bengali">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              রোমান এআই ইঞ্জিন: সচল
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import TranslatorView from './components/TranslatorView.tsx';
import StandaloneTTS from './components/StandaloneTTS.tsx';

// The 'aistudio' global is already defined by the environment.
// Redeclaring it here causes type mismatch errors.

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'translator' | 'tts'>('translator');
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore - aistudio is injected by the environment
      if (window.aistudio) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected || !!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
      window.location.reload(); // Refresh to ensure environment variables are re-injected
    }
  };

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
                  <button 
                    onClick={handleOpenKeyDialog}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded ${hasKey ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50 animate-pulse'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {hasKey ? 'API সচল' : 'API কী যুক্ত করুন'}
                  </button>
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
                ভয়েস
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-8">
        <div className="max-w-7xl mx-auto px-4">
          {!hasKey && (
            <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-amber-800 bengali">এপিআই কী কনফিগার করা নেই</h4>
                  <p className="text-sm text-amber-700 bengali">অডিও জেনারেট করার জন্য আপনাকে একটি পেইড এপিআই কী সিলেক্ট করতে হবে।</p>
                </div>
              </div>
              <button 
                onClick={handleOpenKeyDialog}
                className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors bengali whitespace-nowrap"
              >
                কী সিলেক্ট করুন
              </button>
            </div>
          )}

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

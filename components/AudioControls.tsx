
import React, { useState, useRef, useEffect } from 'react';
import { decodeBase64, createWavBlob } from '../utils/audioUtils';

interface AudioControlsProps {
  base64Audio: string | null;
  text: string;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const AudioControls: React.FC<AudioControlsProps> = ({ base64Audio, text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (base64Audio) {
      const pcmBytes = decodeBase64(base64Audio);
      const wavBlob = createWavBlob(pcmBytes, 24000);
      const url = URL.createObjectURL(wavBlob);
      setDownloadUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setDownloadUrl(null);
    }
  }, [base64Audio]);

  // Ensure playback rate is maintained when audio source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [downloadUrl, playbackSpeed]);

  if (!base64Audio || !downloadUrl) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
        <div className="flex-1 w-full">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 bengali">ভয়েস প্রিভিউ</div>
          <audio
            ref={audioRef}
            src={downloadUrl}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-10 accent-indigo-600"
            controls
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1 bengali">গতি</label>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="w-full md:w-24 px-3 py-2.5 bg-white border border-indigo-200 text-indigo-700 font-semibold rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm cursor-pointer"
            >
              {SPEED_OPTIONS.map(speed => (
                <option key={speed} value={speed}>{speed}x</option>
              ))}
            </select>
          </div>

          <div className="flex-1 md:flex-none mt-auto">
            <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1 bengali">অ্যাকশন</label>
            <a
              href={downloadUrl}
              download={`roman_voice_${new Date().getTime()}.wav`}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-indigo-200 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors shadow-sm text-sm bengali"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              ডাউনলোড
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;

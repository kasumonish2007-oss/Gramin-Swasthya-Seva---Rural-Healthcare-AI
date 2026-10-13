import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AudioPlayerProps {
  text: string;
  label?: string;
  className?: string;
  forceLanguage?: 'en' | 'hi' | 'te';
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, label, className = '', forceLanguage }) => {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const effectiveLang = forceLanguage || language;

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setLoadingAudio(false);
  };

  const playBrowserSynth = (cleanText: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    const targetLangCode = effectiveLang === 'te' ? 'te-IN' : effectiveLang === 'hi' ? 'hi-IN' : 'en-IN';
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLangCode;
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang === targetLangCode ||
        (effectiveLang === 'te' && (v.name.toLowerCase().includes('telugu') || v.lang.startsWith('te'))) ||
        (effectiveLang === 'hi' && (v.name.toLowerCase().includes('hindi') || v.lang.startsWith('hi')))
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = async () => {
    if (!text) return;

    if (isSpeaking) {
      handleStop();
      return;
    }

    handleStop();
    setLoadingAudio(true);

    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    try {
      // First attempt: High-fidelity natural regional voice stream from backend
      const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText.slice(0, 300))}&lang=${effectiveLang}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setLoadingAudio(false);
        setIsSpeaking(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.warn('[AudioPlayer] High-def audio stream unavailable. Falling back to local synthesizer.');
        setLoadingAudio(false);
        playBrowserSynth(cleanText);
      };

      await audio.play();
    } catch (err) {
      console.warn('[AudioPlayer] Audio playback exception, falling back to local synthesizer:', err);
      setLoadingAudio(false);
      playBrowserSynth(cleanText);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer select-none ${
        isSpeaking
          ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
      } ${className}`}
      title={isSpeaking ? t('stopAudio') : label || t('listenAudio')}
    >
      {loadingAudio ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
          <span>వాయిస్ లోడ్ అవుతోంది...</span>
        </>
      ) : isSpeaking ? (
        <>
          <Square className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
          <span>{label ? 'ఆపండి (Stop)' : t('stopAudio')}</span>
          <span className="flex gap-0.5 items-center">
            <span className="w-1 h-3 bg-amber-600 animate-pulse rounded-full"></span>
            <span className="w-1 h-4 bg-amber-600 animate-pulse delay-75 rounded-full"></span>
            <span className="w-1 h-2 bg-amber-600 animate-pulse delay-150 rounded-full"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>{label || t('listenAudio')}</span>
        </>
      )}
    </button>
  );
};

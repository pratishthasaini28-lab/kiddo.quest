
import React, { useState, useEffect, useRef } from 'react';
import { Subject, Question } from '../types';
import { generateQuestions } from '../services/geminiService';

interface GameEngineProps {
  subject: Subject;
  level: number;
  onFinish: (earnedPoints: number) => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ subject, level, onFinish }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [points, setPoints] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Sound Effects Generator using Web Audio API
  const playSfx = (type: 'success' | 'fail') => {
    if (isMuted) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    }
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await generateQuestions(subject, level);
      setQuestions(data);
      setLoading(false);
    };
    load();
  }, [subject, level]);

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const current = questions[currentIndex];
    const isCorrect = answer.toLowerCase().trim() === current.answer.toLowerCase().trim();
    
    if (isCorrect) {
      playSfx('success');
      setPoints(p => p + 50);
      setFeedback({ isCorrect: true, text: "SUPER JOB! 🌟🍭" });
    } else {
      playSfx('fail');
      setFeedback({ isCorrect: false, text: "Try again, little hero!" });
    }

    // Text to Speech for younger kids
    if (level <= 3) {
      const utterance = new SpeechSynthesisUtterance(isCorrect ? "Yay!" : "Try again!");
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        onFinish(points + (isCorrect ? 50 : 0));
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-9xl mb-8 animate-spin">🎡</div>
        <p className="font-kids text-3xl text-orange-500 animate-pulse">Magic is loading...</p>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Sound Controls */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-6 right-6 z-50 bg-white/80 p-4 rounded-full shadow-lg border-2 border-yellow-400 text-2xl"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <div className="bg-white rounded-[4rem] p-10 shadow-2xl relative border-[12px] border-yellow-200">
        {/* Progress */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full border-4 ${i <= currentIndex + 1 ? 'bg-green-400 border-green-200' : 'bg-gray-100 border-gray-200'}`} />
            ))}
          </div>
          <div className="font-kids text-xl text-blue-400">Level {level}</div>
        </div>

        <div className="text-center">
          <h3 className="text-4xl font-kids text-gray-800 mb-8 leading-tight">
            {current.text}
          </h3>

          <div className="flex justify-center mb-10 group">
            <div className="relative p-4 bg-gradient-to-b from-blue-50 to-white rounded-[3rem] shadow-xl border-4 border-dashed border-blue-300 transform group-hover:scale-110 transition-transform">
              <img 
                src={`https://loremflickr.com/500/400/cartoon,${encodeURIComponent(current.imageHint || 'toy')}/all`} 
                alt="hint" 
                className="rounded-[2rem] max-w-full h-64 object-contain"
              />
              <div className="absolute -top-6 -left-6 text-6xl animate-bounce">🦄</div>
            </div>
          </div>

          <div className={`grid ${level === 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {current.options?.map((opt, i) => (
              <button
                key={i}
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                className={`p-8 rounded-[2.5rem] border-b-[10px] font-kids text-3xl transition-all transform active:translate-y-2 active:border-b-0
                  ${feedback && opt.toLowerCase() === current.answer.toLowerCase() ? 'bg-green-400 border-green-600 text-white' : 
                    feedback && feedback.isCorrect === false && opt.toLowerCase() !== current.answer.toLowerCase() ? 'bg-red-50 border-red-200 opacity-50' : 
                    'bg-white border-blue-400 text-blue-600 hover:bg-blue-50'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-[4rem] z-10 animate-in zoom-in duration-300">
            <div className="text-center">
               <div className="text-9xl mb-4 animate-bounce">
                 {feedback.isCorrect ? '🍭' : '🎈'}
               </div>
               <div className={`text-5xl font-kids ${feedback.isCorrect ? 'text-green-500' : 'text-orange-500'}`}>
                 {feedback.text}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEngine;

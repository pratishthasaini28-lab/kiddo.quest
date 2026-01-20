
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
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgOscillatorRef = useRef<OscillatorNode | null>(null);

  // Synthesize Background Music Loop
  const startBackgroundMusic = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Simple friendly chime loop
    const playChime = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.05, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1);
      osc.start(time);
      osc.stop(time + 1);
    };

    // Schedule a simple 4-note loop
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      playChime(now + (i * 1.5), f);
    });
  };

  const playSfx = (type: 'success' | 'fail') => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    }
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generateQuestions(subject, level);
      if (data.length === 0) throw new Error("No magic found!");
      setQuestions(data);
      // Start background music once data is ready
      startBackgroundMusic();
    } catch (err) {
      setError("The Magic Teacher is busy. Let's try once more!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      if (bgOscillatorRef.current) bgOscillatorRef.current.stop();
    };
  }, [subject, level]);

  const handleAnswer = (answer: string) => {
    if (feedback) return;
    const current = questions[currentIndex];
    const isCorrect = answer.toLowerCase().trim() === current.answer.toLowerCase().trim();
    
    playSfx(isCorrect ? 'success' : 'fail');
    setFeedback({ 
      isCorrect, 
      text: isCorrect ? "MAGICAL! ✨🍭" : "Keep trying, hero!" 
    });

    // TTS for Level 1-2
    if (level <= 2) {
      const speech = new SpeechSynthesisUtterance(isCorrect ? "Hooray!" : "Try again!");
      window.speechSynthesis.speak(speech);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-9xl animate-bounce mb-8">🎪</div>
        <div className="font-kids text-3xl text-blue-500 animate-pulse">Building your magic world...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-4 border-red-200 mx-4">
        <div className="text-7xl mb-4">😿</div>
        <p className="font-kids text-2xl text-red-500 mb-6">{error}</p>
        <button onClick={loadData} className="bg-blue-500 text-white font-kids text-xl py-4 px-8 rounded-full shadow-lg">Retry Magic</button>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-[4rem] p-8 md:p-12 shadow-2xl relative border-[10px] border-yellow-200">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-10">
          <div className="bg-blue-50 px-6 py-2 rounded-full border-2 border-blue-200">
            <span className="font-kids text-blue-500">LEVEL {level}</span>
          </div>
          <div className="flex gap-1">
             {questions.map((_, i) => (
               <div key={i} className={`w-4 h-4 rounded-full ${i <= currentIndex ? 'bg-green-400' : 'bg-gray-100'}`} />
             ))}
          </div>
        </div>

        {/* Question Area */}
        <div className="text-center">
          <h2 className="font-kids text-3xl md:text-4xl text-gray-800 mb-8 leading-tight">
            {current.text}
          </h2>

          <div className="flex justify-center mb-10 group">
            <div className="relative p-4 bg-gradient-to-tr from-pink-50 to-blue-50 rounded-[3rem] border-4 border-dashed border-blue-300 transform group-hover:rotate-2 transition-transform shadow-xl">
              <img 
                src={`https://loremflickr.com/500/400/cartoon,${encodeURIComponent(current.imageHint || 'toy')}/all`} 
                alt="hint" 
                className="rounded-[2rem] max-w-full h-64 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/500x400/FFEB3B/000000?text=FUN+PIC";
                }}
              />
              <div className="absolute -top-6 -right-6 text-7xl animate-bounce">🎈</div>
            </div>
          </div>

          {/* Options - Extra large for Level 1 */}
          <div className={`grid ${level === 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {current.options?.map((opt, i) => (
              <button
                key={i}
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                className={`p-8 md:p-10 rounded-[3rem] border-b-[12px] font-kids text-4xl md:text-5xl transition-all transform active:translate-y-2 active:border-b-0
                  ${feedback && opt.toLowerCase() === current.answer.toLowerCase() ? 'bg-green-400 border-green-600 text-white' : 
                    feedback && feedback.isCorrect === false && opt.toLowerCase() !== current.answer.toLowerCase() ? 'bg-red-50 border-red-200 opacity-50' : 
                    'bg-white border-blue-300 text-blue-500 hover:bg-blue-50'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-[4rem] z-20 animate-in zoom-in duration-300">
            <div className="text-center">
               <div className="text-[12rem] mb-4 animate-bounce">
                 {feedback.isCorrect ? '🍭' : '🎈'}
               </div>
               <div className={`text-6xl font-kids ${feedback.isCorrect ? 'text-green-500' : 'text-orange-500'}`}>
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

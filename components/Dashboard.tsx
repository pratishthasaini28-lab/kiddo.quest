
import React, { useState } from 'react';
import { SUBJECTS } from '../constants';
import { Subject, UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  onSelectSubject: (subject: Subject) => void;
  onOpenToyBox: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onSelectSubject, onOpenToyBox }) => {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-300 max-w-lg">
          <div className="text-9xl mb-8 animate-bounce">🦖</div>
          <h2 className="font-kids text-5xl text-gray-800 mb-6 uppercase">Ready to Play?</h2>
          <p className="text-gray-500 text-xl mb-10">Click below to start your adventure with magic sounds!</p>
          <button 
            onClick={() => setHasStarted(true)}
            className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white font-kids text-4xl py-8 px-16 rounded-full shadow-xl border-b-[12px] border-orange-700 active:translate-y-2 active:border-b-0 transition-all"
          >
            START MAGIC 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 animate-in fade-in duration-500">
      {/* Level Journey Map */}
      <div className="bg-white/70 p-8 rounded-[4rem] border-4 border-dashed border-yellow-200 mb-12 shadow-inner">
        <div className="flex items-center gap-4 min-w-max px-4">
          {Array.from({ length: 10 }).map((_, i) => {
            const levelNum = i + 1;
            const isCompleted = stats.level > levelNum;
            const isCurrent = stats.level === levelNum;
            return (
              <React.Fragment key={levelNum}>
                <div className={`flex flex-col items-center gap-2 ${isCurrent ? 'scale-125' : ''} transition-all`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center font-kids text-3xl border-4 shadow-md
                    ${isCompleted ? 'bg-green-400 border-green-600 text-white' : 
                      isCurrent ? 'bg-yellow-400 border-yellow-600 text-white animate-pulse' : 
                      'bg-gray-100 border-gray-300 text-gray-300'}
                  `}>
                    {isCompleted ? '✅' : levelNum}
                  </div>
                  {isCurrent && <span className="text-sm font-bold text-yellow-600 animate-bounce tracking-widest">YOU</span>}
                </div>
                {i < 9 && <div className={`w-12 h-2 rounded-full ${isCompleted ? 'bg-green-400' : 'bg-gray-100'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="font-kids text-6xl text-gray-800 mb-4 tracking-tighter">Hi, Little Hero! 👋</h2>
        <p className="text-gray-500 text-3xl">Pick a world to play!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        {SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelectSubject(sub.id)}
            className={`${sub.bgColor} p-12 rounded-[5rem] shadow-2xl border-b-[18px] border-black/10 transform transition-all hover:scale-105 active:border-b-0 active:translate-y-4 group relative overflow-hidden`}
          >
            <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:rotate-45 transition-transform">
               <div className="text-[15rem]">{sub.icon}</div>
            </div>
            <div className="text-9xl mb-8 group-hover:scale-110 transition-transform">{sub.icon}</div>
            <div className={`font-kids text-5xl ${sub.color} text-left`}>{sub.name}</div>
            <p className="text-gray-600 text-left mt-4 text-2xl font-medium">Quest to Level {stats.level + 1}!</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center pb-12">
        <button
          onClick={onOpenToyBox}
          className="bg-red-500 hover:bg-red-600 text-white font-kids text-5xl py-10 px-20 rounded-[4rem] shadow-2xl transform transition-all hover:scale-110 border-b-[15px] border-red-800 flex items-center gap-8"
        >
          <span className="text-7xl animate-bounce">🎁</span> TOY BOX
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

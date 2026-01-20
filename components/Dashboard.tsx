
import React from 'react';
import { SUBJECTS } from '../constants';
import { Subject, UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  onSelectSubject: (subject: Subject) => void;
  onOpenToyBox: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onSelectSubject, onOpenToyBox }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* Level Journey Map */}
      <div className="bg-white/50 p-6 rounded-[3rem] border-4 border-dashed border-yellow-200 mb-12 overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max px-4">
          {Array.from({ length: 10 }).map((_, i) => {
            const levelNum = i + 1;
            const isCompleted = stats.level > levelNum;
            const isCurrent = stats.level === levelNum;
            return (
              <React.Fragment key={levelNum}>
                <div className={`flex flex-col items-center gap-2 ${isCurrent ? 'scale-125' : ''} transition-all`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-kids text-2xl border-4
                    ${isCompleted ? 'bg-green-400 border-green-600 text-white' : 
                      isCurrent ? 'bg-yellow-400 border-yellow-600 text-white animate-pulse' : 
                      'bg-gray-100 border-gray-300 text-gray-400'}
                  `}>
                    {isCompleted ? '✅' : levelNum}
                  </div>
                  {isCurrent && <span className="text-xs font-bold text-yellow-600 animate-bounce">YOU</span>}
                </div>
                {i < 9 && <div className={`w-8 h-1 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="font-kids text-6xl text-gray-800 mb-4 drop-shadow-sm">Hi Hero! 👋</h2>
        <p className="text-gray-500 text-2xl">Pick your adventure world!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelectSubject(sub.id)}
            className={`${sub.bgColor} p-12 rounded-[4rem] shadow-2xl border-b-[15px] border-black/10 transform transition-all hover:scale-105 active:border-b-0 active:translate-y-4 group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-45 transition-transform">
               <div className="text-9xl">{sub.icon}</div>
            </div>
            <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">{sub.icon}</div>
            <div className={`font-kids text-4xl ${sub.color} text-left`}>{sub.name}</div>
            <p className="text-gray-600 text-left mt-2 text-xl font-medium">Click to reach Level {stats.level + 1}!</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={onOpenToyBox}
          className="bg-red-500 hover:bg-red-600 text-white font-kids text-4xl py-8 px-16 rounded-[3rem] shadow-2xl transform transition-all hover:scale-110 border-b-[12px] border-red-800 flex items-center gap-6"
        >
          <span className="text-5xl">🎁</span> TOY BOX
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

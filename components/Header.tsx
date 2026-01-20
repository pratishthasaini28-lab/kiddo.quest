
import React from 'react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  onBack: () => void;
  isDashboard: boolean;
}

const Header: React.FC<HeaderProps> = ({ stats, onBack, isDashboard }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-b-3xl mb-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {!isDashboard && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-2xl">🔙</span>
          </button>
        )}
        <h1 className="font-kids text-2xl text-yellow-500 tracking-wide">KiddoQuest</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-2 border-2 border-yellow-200">
          <span className="text-xl">⭐</span>
          <span className="font-bold text-yellow-700">{stats.points}</span>
        </div>
        <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center gap-2 border-2 border-purple-200">
          <span className="text-xl">🏆</span>
          <span className="font-bold text-purple-700">LVL {stats.level}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

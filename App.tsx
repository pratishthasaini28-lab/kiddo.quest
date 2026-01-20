
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import GameEngine from './components/GameEngine';
import ToyBox from './components/ToyBox';
import { UserStats, Subject, Toy } from './types';
import { TOYS_CATALOG } from './constants';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('kiddoquest_v2_stats');
    return saved ? JSON.parse(saved) : {
      points: 0,
      level: 1,
      xp: 0,
      completedTasks: 0,
      unlockedToys: []
    };
  });

  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [isToyBoxOpen, setIsToyBoxOpen] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('kiddoquest_v2_stats', JSON.stringify(stats));
  }, [stats]);

  const handleFinishGame = (earnedPoints: number) => {
    const newCompletedTasks = stats.completedTasks + 1;
    // Progress level every 3 tasks, max 10
    const newLevel = Math.min(10, Math.floor(newCompletedTasks / 3) + 1);

    setStats(prev => ({
      ...prev,
      points: prev.points + earnedPoints,
      completedTasks: newCompletedTasks,
      level: newLevel
    }));
    setShowRewardModal(earnedPoints);
    setActiveSubject(null);
  };

  const handleBuyToy = (toy: Toy) => {
    if (stats.points >= toy.cost && !stats.unlockedToys.includes(toy.id)) {
      setStats(prev => ({
        ...prev,
        points: prev.points - toy.cost,
        unlockedToys: [...prev.unlockedToys, toy.id]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0]">
      <Header 
        stats={stats} 
        onBack={() => setActiveSubject(null)} 
        isDashboard={!activeSubject} 
      />

      <main className="py-8">
        {!activeSubject ? (
          <Dashboard 
            stats={stats}
            onSelectSubject={(sub) => setActiveSubject(sub)}
            onOpenToyBox={() => setIsToyBoxOpen(true)}
          />
        ) : (
          <GameEngine 
            subject={activeSubject} 
            level={stats.level} 
            onFinish={handleFinishGame}
          />
        )}
      </main>

      {isToyBoxOpen && (
        <ToyBox 
          stats={stats} 
          onBuy={handleBuyToy} 
          onClose={() => setIsToyBoxOpen(false)} 
        />
      )}

      {showRewardModal !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-500 bg-opacity-90 p-4">
          <div className="text-center p-12 bg-white rounded-[4rem] shadow-2xl transform animate-bounce border-8 border-yellow-300">
            <h2 className="font-kids text-7xl text-yellow-500 mb-6 uppercase">Hooray! 🎊</h2>
            <div className="text-9xl mb-8">💎</div>
            <p className="text-4xl font-kids text-gray-700 mb-10">
              You won <span className="text-blue-500">{showRewardModal} stars</span>!
            </p>
            <button 
              onClick={() => setShowRewardModal(null)}
              className="bg-green-500 hover:bg-green-600 text-white font-kids text-4xl py-6 px-16 rounded-full shadow-xl border-b-[10px] border-green-800"
            >
              MORE PLAY!
            </button>
          </div>
        </div>
      )}

      {/* Toy Garden */}
      {stats.unlockedToys.length > 0 && !activeSubject && (
        <section className="max-w-4xl mx-auto px-4 mt-12 pb-20">
          <div className="bg-white/40 p-10 rounded-[4rem] border-4 border-dashed border-gray-300">
            <h3 className="font-kids text-4xl text-gray-600 mb-8 text-center">🌟 Your Magic Garden 🌟</h3>
            <div className="flex flex-wrap justify-center gap-10">
              {stats.unlockedToys.map(toyId => {
                const toy = TOYS_CATALOG.find((t) => t.id === toyId);
                return (
                  <div key={toyId} className="group relative">
                    <div className="text-8xl hover:scale-125 transition-transform cursor-pointer hover:rotate-12 duration-300">
                      {toy?.image}
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white px-2 py-1 rounded-full text-xs font-bold border-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {toy?.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default App;

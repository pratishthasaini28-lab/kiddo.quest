
import React from 'react';
import { TOYS_CATALOG } from '../constants';
import { UserStats, Toy } from '../types';

interface ToyBoxProps {
  stats: UserStats;
  onBuy: (toy: Toy) => void;
  onClose: () => void;
}

const ToyBox: React.FC<ToyBoxProps> = ({ stats, onBuy, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-red-50">
          <h2 className="font-kids text-3xl text-red-600">Magic Toy Box 🎁</h2>
          <button onClick={onClose} className="text-3xl hover:scale-125 transition-transform">❌</button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {TOYS_CATALOG.map((toy) => {
            const isOwned = stats.unlockedToys.includes(toy.id);
            const canAfford = stats.points >= toy.cost;

            return (
              <div 
                key={toy.id} 
                className={`p-4 rounded-2xl border-4 text-center transition-all relative
                  ${isOwned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}
                `}
              >
                <div className="text-5xl mb-2">{toy.image}</div>
                <div className="font-bold text-gray-800">{toy.name}</div>
                
                {isOwned ? (
                  <div className="mt-2 text-green-600 font-bold">OWNED ✅</div>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => onBuy(toy)}
                    className={`mt-2 w-full py-2 rounded-xl font-bold flex items-center justify-center gap-1
                      ${canAfford ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <span>⭐</span> {toy.cost}
                  </button>
                )}
                
                {!isOwned && !canAfford && (
                  <div className="text-[10px] mt-1 text-red-400 uppercase font-bold">Not enough stars</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-gray-50 border-t flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full border-2 border-yellow-300 shadow-sm">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-2xl text-yellow-600">{stats.points} stars to spend</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToyBox;

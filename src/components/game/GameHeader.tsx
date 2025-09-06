import GameHeaderUser from '@/components/GameHeaderUser';
import { levelConfig } from '@/config/gameConfig';

interface GameHeaderProps {
  currentLevel: number;
  onShowInfoScreen: () => void;
}

export default function GameHeader({ currentLevel, onShowInfoScreen }: GameHeaderProps) {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-sm p-4 flex justify-between items-center z-10 border-b border-cyan-400/30">
        <div className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text">
          ArbiRush
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            Level {currentLevel}
          </div>
          <div className="bg-gradient-to-r from-yellow-600/80 to-orange-600/80 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Goal: ${levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100}
          </div>
          <button
            onClick={onShowInfoScreen}
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-all duration-300 border border-blue-400/30"
          >
            ℹ️
          </button>
        </div>
      </div>

      {/* User Display in Game Header */}
      <div className="absolute top-20 right-4 z-10">
        <GameHeaderUser />
      </div>
    </>
  );
}
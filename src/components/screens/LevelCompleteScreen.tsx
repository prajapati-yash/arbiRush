import { levelConfig } from '@/config/gameConfig';

interface LevelCompleteScreenProps {
  wealth: number;
  currentLevel: number;
  gatesInLevel: number;
  onNextLevel: () => void;
  onRetryLevel: () => void;
  onResetGame: () => void;
}

export default function LevelCompleteScreen({
  wealth,
  currentLevel,
  gatesInLevel,
  onNextLevel,
  onRetryLevel,
  onResetGame
}: LevelCompleteScreenProps) {
  const goalAchieved = wealth >= (levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100);
  const isMaxLevel = currentLevel >= 5;

  return (
    <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-green-400/50 shadow-2xl shadow-green-500/50 max-w-md">
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text mb-4">
        {goalAchieved ? (isMaxLevel ? "🏆 Champion!" : `🎉 Level ${currentLevel} Complete!`) : `❌ Level ${currentLevel} - Goal Not Reached`}
      </div>
      <div className="text-xl text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text mb-2">
        Final Wealth: ${wealth}
      </div>
      <div className={`text-lg mb-4 ${goalAchieved ? 'text-green-300' : 'text-red-300'}`}>
        Level {currentLevel} Goal: ${levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100} 
        {goalAchieved ? " ✅" : " ❌"}
      </div>
      <div className="text-sm text-gray-300 mb-6">
        You completed {gatesInLevel} gates!
      </div>
      
      {isMaxLevel && goalAchieved ? (
        // Game completed
        <div className="mb-6">
          <div className="text-2xl text-yellow-400 mb-4">🎊 Congratulations! 🎊</div>
          <div className="text-lg text-green-300">You&apos;ve become a true DeFi Legend!</div>
        </div>
      ) : null}
      
      <div className="flex flex-col space-y-3">
        {goalAchieved && !isMaxLevel ? (
          <button
            onClick={onNextLevel}
            className="cursor-pointer bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 border border-green-400/30"
          >
            Next Level
          </button>
        ) : (
          <button
            onClick={onRetryLevel}
            className="cursor-pointer bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 border border-orange-400/30"
          >
            Retry Level {currentLevel}
          </button>
        )}
        <button
          onClick={onResetGame}
          className="cursor-pointer bg-gradient-to-r from-purple-600 to-slate-600 hover:from-purple-700 hover:to-slate-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 border border-purple-400/30"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
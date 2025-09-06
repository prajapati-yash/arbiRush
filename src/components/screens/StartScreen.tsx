import EnhancedWalletConnection from '@/components/EnhancedWalletConnection';
import { useUserConnection } from '@/hooks/useUserConnection';
import { UserProgressData } from '@/lib/userProgress';

interface StartScreenProps {
  onStartGame: () => void;
  onShowLeaderboard: () => void;
  onShowInfoScreen: () => void;
  userProgress?: UserProgressData | null;
  isConnected: boolean;
}

export default function StartScreen({ 
  onStartGame, 
  onShowLeaderboard, 
  onShowInfoScreen,
  userProgress,
  isConnected
}: StartScreenProps) {
  const { } = useUserConnection();

  return (
    <div className="text-center z-20">
      <div className="font-luckiest text-6xl font-bold text-transparent bg-gradient-to-r from-[#a7f5f9] via-[#60a5fa] to-[#1e3a8a] bg-clip-text mb-8">
  ArbiRush
</div>

      <div className="text-xl text-cyan-300 mb-4">
        Navigate through the DeFi gates and manage your wealth!
      </div>
      <div className="text-sm text-gray-300 mb-4">
        {isConnected 
          ? "💰 Connected - Your progress will be saved!" 
          : "🎮 Play as guest or connect wallet to save progress"
        }
      </div>
      
      {/* Show progress info if user has saved progress */}
      {userProgress && isConnected && (
        <div className="text-sm text-green-300 mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg max-w-lg mx-auto">
          <div className="font-semibold text-center mb-3">📊 Your Progress</div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-green-800/30 rounded p-2">
              <div className="font-semibold">Current Level</div>
              <div className="text-lg">{userProgress.currentLevel}</div>
            </div>
            <div className="bg-green-800/30 rounded p-2">
              <div className="font-semibold">Max Reached</div>
              <div className="text-lg">{userProgress.maxLevelReached}</div>
            </div>
            <div className="bg-green-800/30 rounded p-2">
              <div className="font-semibold">Last Wealth</div>
              <div className="text-lg">💰 {userProgress.currentWealth}</div>
            </div>
            <div className="bg-green-800/30 rounded p-2">
              <div className="font-semibold">Total Games</div>
              <div className="text-lg">{userProgress.totalGamesPlayed}</div>
            </div>
          </div>
          
          {/* Show recent attempts history if available */}
          {userProgress.levelAttempts && userProgress.levelAttempts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-500/30">
              <div className="font-semibold mb-2">📈 Recent Attempts</div>
              <div className="space-y-1">
                {userProgress.levelAttempts.slice(-4).reverse().map((attempt, index) => (
                  <div key={index} className={`flex justify-between items-center text-xs rounded px-2 py-1 ${
                    attempt.success 
                      ? 'bg-green-800/20 text-green-300' 
                      : 'bg-red-800/20 text-red-300'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <span>{attempt.success ? '✅' : '❌'}</span>
                      <span>Level {attempt.level}</span>
                    </div>
                    <span>💰 {attempt.finalWealth}</span>
                    {attempt.timeTaken && (
                      <span className="text-gray-400">
                        {Math.round(attempt.timeTaken / 1000)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Success rate if we have attempts */}
              {userProgress.totalAttempts > 0 && (
                <div className="mt-2 text-center text-xs">
                  <span className="text-gray-400">Success Rate: </span>
                  <span className="text-green-400">
                    {Math.round((userProgress.successfulAttempts / userProgress.totalAttempts) * 100)}%
                  </span>
                  <span className="text-gray-400"> ({userProgress.successfulAttempts}/{userProgress.totalAttempts})</span>
                </div>
              )}
            </div>
          )}
          
          {/* Show total time played if available */}
          {userProgress.totalTimePlayed > 0 && (
            <div className="mt-2 text-center text-xs text-gray-400">
              Total time played: {Math.round(userProgress.totalTimePlayed / 1000 / 60)}m
            </div>
          )}
        </div>
      )}
      
      {/* Wallet Connection Component */}
      <div className="mb-8 max-w-md mx-auto">
        <EnhancedWalletConnection />
      </div>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={onStartGame}
          className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 border border-green-400/30"
        >
          {isConnected && userProgress 
            ? `🚀 Continue from Level ${userProgress.currentLevel}`
            : isConnected 
            ? '🚀 Start Game' 
            : '🎮 Play as Guest'
          }
        </button>
        <button
          onClick={onShowLeaderboard}
          className="bg-gradient-to-r from-purple-600 to-slate-600 hover:from-purple-700 hover:to-slate-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 border border-purple-400/30"
        >
          Leaderboard
        </button>
        <button
          onClick={onShowInfoScreen}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 border border-blue-400/30"
        >
          📚 DeFi Guide
        </button>
      </div>
    </div>
  );
}
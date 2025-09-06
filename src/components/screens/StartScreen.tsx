import EnhancedWalletConnection from '@/components/EnhancedWalletConnection';
import { useUserConnection } from '@/hooks/useUserConnection';

interface StartScreenProps {
  onStartGame: () => void;
  onShowLeaderboard: () => void;
  onShowInfoScreen: () => void;
}

export default function StartScreen({ 
  onStartGame, 
  onShowLeaderboard, 
  onShowInfoScreen 
}: StartScreenProps) {
  const { isConnected } = useUserConnection();

  return (
    <div className="text-center z-20">
      <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text mb-8">
        ArbiRush
      </div>
      <div className="text-xl text-cyan-300 mb-4">
        Navigate through the DeFi gates and manage your wealth!
      </div>
      <div className="text-sm text-gray-300 mb-8">
        {isConnected 
          ? "💰 Connected - Your progress will be saved!" 
          : "🎮 Play as guest or connect wallet to save progress"
        }
      </div>
      
      {/* Wallet Connection Component */}
      <div className="mb-8 max-w-md mx-auto">
        <EnhancedWalletConnection />
      </div>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={onStartGame}
          className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 border border-green-400/30"
        >
          {isConnected ? '🚀 Start Game' : '🎮 Play as Guest'}
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
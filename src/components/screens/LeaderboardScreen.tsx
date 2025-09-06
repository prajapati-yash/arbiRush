import { useState, useEffect } from 'react';
import { UserProgressData } from '@/lib/userProgress';

interface LeaderboardScreenProps {
  onBackToStart: () => void;
}

export default function LeaderboardScreen({ onBackToStart }: LeaderboardScreenProps) {
  const [leaderboard, setLeaderboard] = useState<UserProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/leaderboard?limit=10');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch leaderboard');
        }
        
        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  return (
    <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-400/50 shadow-2xl shadow-purple-500/50 max-w-2xl mx-auto">
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-6">
        🏆 Leaderboard
      </div>
      
      {isLoading ? (
        <div className="text-xl text-cyan-300 mb-8">
          Loading leaderboard...
        </div>
      ) : error ? (
        <div className="text-xl text-red-300 mb-8">
          Error: {error}
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-xl text-cyan-300 mb-8">
          No players yet. Be the first to play!
        </div>
      ) : (
        <div className="mb-8">
          <div className="text-sm text-gray-300 mb-4">
            Top Players by Max Level & Wealth
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leaderboard.map((player, index) => (
              <div key={player.address} className="bg-slate-700/50 border border-slate-500/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold min-w-[3rem] text-left">
                    {getRankEmoji(index)}
                  </span>
                  <div className="text-left">
                    {player.isFarcasterUser && player.displayName ? (
                      <div>
                        <div className="font-semibold text-cyan-300">
                          {player.displayName}
                        </div>
                        <div className="text-xs text-gray-400">
                          @{player.username} • FID: {player.fid}
                        </div>
                      </div>
                    ) : (
                      <div className="font-semibold text-cyan-300">
                        {formatAddress(player.address)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">
                    Level {player.maxLevelReached}
                  </div>
                  <div className="text-sm text-gray-300">
                    💰 {player.currentWealth}
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.totalGamesPlayed} games
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={onBackToStart}
        className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
      >
        Back to Menu
      </button>
    </div>
  );
}
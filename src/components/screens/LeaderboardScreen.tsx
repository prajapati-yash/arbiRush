interface LeaderboardScreenProps {
  onBackToStart: () => void;
}

export default function LeaderboardScreen({ onBackToStart }: LeaderboardScreenProps) {
  return (
    <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-400/50 shadow-2xl shadow-purple-500/50">
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-6">
        Leaderboard
      </div>
      <div className="text-xl text-cyan-300 mb-8">
        Your leaderboard is under construction
      </div>
      <button
        onClick={onBackToStart}
        className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
      >
        Back to Menu
      </button>
    </div>
  );
}
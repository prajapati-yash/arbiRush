interface GameOverScreenProps {
  wealth: number;
  onResetGame: () => void;
}

export default function GameOverScreen({ wealth, onResetGame }: GameOverScreenProps) {
  return (
    <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-cyan-400/50 shadow-2xl shadow-purple-500/50">
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text mb-4">
        Game Over!
      </div>
      <div className="text-xl text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text mb-6">
        Final Wealth: ${wealth}
      </div>
      <button
        onClick={onResetGame}
        className="cursor-pointer bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
      >
        Play Again
      </button>
    </div>
  );
}
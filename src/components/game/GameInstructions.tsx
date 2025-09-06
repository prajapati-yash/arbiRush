export default function GameInstructions() {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
      <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/10">
        <p className="text-sm mb-2 text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text font-semibold">
          Choose LEFT or RIGHT gate
        </p>
        <p className="text-xs text-cyan-300/80 mb-1">
          Tap sides or use ← → keys
        </p>
        <p className="text-xs text-yellow-300/70">
          Hover over gates for DeFi tips! 💡
        </p>
      </div>
    </div>
  );
}
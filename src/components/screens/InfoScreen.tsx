import { defiTerms } from '@/config/gameConfig';

interface InfoScreenProps {
  onBackToStart: () => void;
}

export default function InfoScreen({ onBackToStart }: InfoScreenProps) {
  return (
    <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-400/50 shadow-2xl shadow-blue-500/50 max-w-4xl mx-4">
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-6">
        📚 DeFi Terms Guide
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
        {Object.entries(defiTerms).map(([key, term]) => (
          <div key={key} className="bg-slate-700/50 p-4 rounded-lg border border-cyan-400/30">
            <div className="text-2xl mb-2">{term.emoji}</div>
            <div className="text-lg font-bold text-cyan-400 mb-1">{term.name}</div>
            <div className="text-sm text-gray-300">{term.description}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onBackToStart}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
      >
        Back to Menu
      </button>
    </div>
  );
}
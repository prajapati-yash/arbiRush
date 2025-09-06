import { levelConfig } from '@/config/gameConfig';

interface StoryScreenProps {
  currentLevel: number;
  onContinueFromStory: () => void;
}

export default function StoryScreen({ currentLevel, onContinueFromStory }: StoryScreenProps) {
  return (
    <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/50 max-w-2xl mx-4">
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-4">
        {levelConfig[currentLevel as keyof typeof levelConfig]?.title || "Level " + currentLevel}
      </div>
      <div className="text-6xl mb-6">🏆</div>
      <div className="text-lg text-gray-300 mb-6 leading-relaxed">
        {levelConfig[currentLevel as keyof typeof levelConfig]?.story || "Continue your DeFi journey!"}
      </div>
      <div className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 p-4 rounded-lg border border-green-400/30 mb-6">
        <div className="text-xl font-bold text-green-400 mb-2">
          Level {currentLevel} Goal: ${levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100}
        </div>
        <div className="text-cyan-300">
          {levelConfig[currentLevel as keyof typeof levelConfig]?.description || "Survive the challenges ahead"}
        </div>
      </div>
      <button
        onClick={onContinueFromStory}
        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 border border-yellow-400/30"
      >
        Start Level {currentLevel}
      </button>
    </div>
  );
}
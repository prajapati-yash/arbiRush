import { HoveredGate } from '@/types/game';
import { defiTerms } from '@/config/gameConfig';

interface GameTooltipProps {
  hoveredGate: HoveredGate | null;
}

export default function GameTooltip({ hoveredGate }: GameTooltipProps) {
  if (!hoveredGate || !defiTerms[hoveredGate.term as keyof typeof defiTerms]) {
    return null;
  }

  const term = defiTerms[hoveredGate.term as keyof typeof defiTerms];

  return (
    <div
      className="absolute pointer-events-none z-30 bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/50 shadow-lg shadow-cyan-400/25 max-w-xs"
      style={{
        left: `${Math.min(hoveredGate.x + 10, window.innerWidth - 250)}px`,
        top: `${Math.max(hoveredGate.y - 80, 10)}px`
      }}
    >
      <div className="flex items-center space-x-2 mb-1">
        <span className="text-2xl">{term.emoji}</span>
        <span className="text-lg font-bold text-cyan-400">
          {term.name}
        </span>
      </div>
      <p className="text-sm text-gray-300">
        {term.description}
      </p>
    </div>
  );
}
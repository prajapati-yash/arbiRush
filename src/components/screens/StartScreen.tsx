import EnhancedWalletConnection from '@/components/EnhancedWalletConnection';
import { useUserConnection } from '@/hooks/useUserConnection';
import { FaPlay, FaTrophy, FaCog } from "react-icons/fa";

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

  // ✅ Inner modular button component (only in this page)
  const GameButton = ({
    label,
    onClick,
    Icon
  }: {
    label: string;
    onClick: () => void;
    Icon: React.ElementType;
  }) => {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer group relative flex items-center justify-center gap-3 px-10 py-5 
                   rounded-2xl text-xl text-white font-pressStart
                   transform transition-all min-w-[350px] duration-300 
                   hover:scale-[1.02] hover:-translate-y-1 active:scale-95
                   shadow-cyan-500/25 hover:shadow-cyan-400/50 hover:shadow-2xl"
      >
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-2xl"></div>
        
        {/* Inner border glow */}
        <div className="absolute inset-0.5 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-2xl opacity-60"></div>
        
        {/* Side accents */}
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 opacity-50"></div>
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-4 drop-shadow-lg">
          <Icon className="text-cyan-200 text-3xl group-hover:scale-125 group-hover:text-cyan-100 group-hover:rotate-12 transition-all duration-300 drop-shadow-md filter group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="relative text-center z-20 px-8 py-12 font-pressStart">
      {/* Main container with glassmorphism effect */}
      <div className="relative backdrop-blur-xl bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-indigo-700/10 rounded-3xl p-10 shadow-2xl border border-cyan-400/20 mx-4">
        

        {/* Game Title with enhanced styling */}
        <div className="relative mb-12">
        <div className="font-pressStart text-4xl font-bold text-transparent bg-gradient-to-b from-white via-[#67e8f9] to-[#3b82f6] bg-clip-text mb-8 drop-shadow-lg">ArbiRush</div>
          {/* Title underline accent */}
          <div className="mt-4 mx-auto w-32 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
        </div>

        {/* Tagline with improved styling */}
        <div className="mb-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-indigo-700/20 border border-cyan-400/30 backdrop-blur-sm">
          <div className="text-xl text-cyan-200 font-saira font-medium">
            Navigate through the DeFi gates and manage your wealth!
          </div>
        </div>

        {/* Connection status with enhanced design */}
        <div className="mb-10 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-700/20 border border-blue-400/25 backdrop-blur-sm">
          <div className="text-sm text-blue-200 font-saira">
            {isConnected 
              ? "Wallet Connected - Your progress will be saved!" 
              : "Play as guest or connect wallet to save progress"
            }
          </div>
        </div>
        
        {/* Wallet Connection Component with styled container */}
        <div className="mb-12 max-w-sm mx-auto">
            <EnhancedWalletConnection />
          {/* </div> */}
        </div>
        
        {/* Game buttons with styled container */}
        <div className="relative">
          <div className="flex flex-col space-y-6  justify-center items-center">
          <GameButton label="Play" onClick={onStartGame} Icon={FaPlay} />
            <GameButton label="Leaderboard" onClick={onShowLeaderboard} Icon={FaTrophy} />
            <GameButton label="Options" onClick={onShowInfoScreen} Icon={FaCog} />
          </div>
        </div>

        {/* Inner glow effect for the main container */}
        <div className="absolute inset-2 rounded-2xl bg-gradient-to-b from-cyan-400/5 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}

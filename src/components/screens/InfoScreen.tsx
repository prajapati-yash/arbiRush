import { defiTerms } from '@/config/gameConfig';

interface InfoScreenProps {
  onBackToStart: () => void;
}

export default function InfoScreen({ onBackToStart }: InfoScreenProps) {
  return (
    <div className="relative text-center z-20 px-8 py-12 font-pressStart min-h-screen flex items-center justify-center">
      {/* Main container with glassmorphism effect matching other screens */}
      <div className="relative backdrop-blur-xl bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-indigo-700/10 rounded-3xl p-10 shadow-2xl border border-cyan-400/20 mx-4 max-w-6xl w-full">
        
        {/* Title Section */}
        <div className="relative mb-12">
          <div className="font-pressStart text-3xl font-bold text-transparent bg-gradient-to-b from-white via-cyan-200 to-cyan-400 bg-clip-text drop-shadow-lg mb-4">
            DeFi Terms Guide
          </div>
          <div className="mx-auto w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <div className="mt-4 text-cyan-200 font-saira text-lg font-light opacity-80">
            Master these DeFi concepts to excel in ArbiRush
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(defiTerms).map(([key, term]) => (
            <div 
              key={key} 
              className="group relative bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-indigo-700/10 backdrop-blur-sm p-6 rounded-2xl border border-cyan-400/30 shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 hover:border-cyan-400/50"
            >
              {/* Icon with subtle glow */}
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <term.icon className="text-3xl text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300" />
              </div>
              
              {/* Term name */}
              <div className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text mb-3 font-pressStart">
                {term.name}
              </div>
              
              {/* Description */}
              <div className="text-sm text-cyan-200 font-saira leading-relaxed opacity-90">
                {term.description}
              </div>

              {/* Subtle hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="relative">
          <button
            onClick={onBackToStart}
            className="group relative flex items-center justify-center gap-4 px-12 py-4 
                       rounded-2xl text-xl text-white font-pressStart
                       transform transition-all min-w-[280px] duration-300 
                       hover:scale-[1.03] hover:-translate-y-1 active:scale-95
                       shadow-cyan-500/25 hover:shadow-cyan-400/50 hover:shadow-2xl mx-auto"
          >
            {/* Main gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-2xl"></div>
            
            {/* Inner border glow */}
            <div className="absolute inset-0.5 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 rounded-2xl opacity-60"></div>
            
            {/* Side accents */}
            <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 opacity-50 group-hover:opacity-80 transition-opacity"></div>
            
            {/* Content */}
            <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
              Back to Menu
            </span>
          </button>
        </div>

        {/* Inner glow effect for the main container */}
        <div className="absolute inset-2 rounded-2xl bg-gradient-to-b from-cyan-400/5 to-transparent pointer-events-none"></div>
      </div>

      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34,211,238,0.2) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>
    </div>
  );
}
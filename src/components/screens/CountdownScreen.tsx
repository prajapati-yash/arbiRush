interface CountdownScreenProps {
  countdown: number;
}

export default function CountdownScreen({ countdown }: CountdownScreenProps) {
  return (
    <div className="relative text-center z-20 px-8 py-12 font-pressStart min-h-screen flex items-center justify-center">
      {/* Main container with glassmorphism effect */}
      <div className="relative backdrop-blur-xl bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-indigo-700/10 rounded-3xl p-16 shadow-2xl border border-cyan-400/20 mx-4 max-w-lg mx-auto">
        
        {/* Subtle animated background grid */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34,211,238,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
        </div>

        {/* Title */}
        <div className="relative mb-12">
          <div className="font-pressStart text-2xl font-bold text-transparent bg-gradient-to-b from-white via-cyan-200 to-cyan-400 bg-clip-text drop-shadow-lg">
            Get Ready
          </div>
          <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>

        {/* Main countdown container */}
        <div className="relative mb-12">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border border-cyan-400/30" style={{
              animation: 'rotate 4s linear infinite'
            }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-1 h-4 bg-cyan-400 rounded-full"></div>
            </div>
          </div>

          {/* Middle breathing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border border-cyan-400/20" style={{
              animation: 'breathe 2s ease-in-out infinite'
            }}></div>
          </div>

          {/* Inner pulsing circle */}
          <div className="relative mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-indigo-700/10 border border-cyan-400/40 backdrop-blur-sm flex items-center justify-center" style={{
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            {/* Countdown number */}
            <div className="text-8xl font-bold text-transparent bg-gradient-to-b from-cyan-200 via-cyan-300 to-cyan-500 bg-clip-text relative z-10 font-pressStart" style={{
              animation: 'scaleIn 0.5s ease-out',
              filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))'
            }}>
              {countdown}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mb-8">
          <div className="w-full h-1 bg-cyan-400/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((4 - countdown) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Countdown text */}
        <div className="text-lg text-cyan-200 font-saira font-light opacity-80">
          Game starting...
        </div>

        {/* Inner glow effect */}
        <div className="absolute inset-2 rounded-2xl bg-gradient-to-b from-cyan-400/5 to-transparent pointer-events-none"></div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
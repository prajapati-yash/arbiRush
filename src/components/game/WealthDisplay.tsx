interface WealthDisplayProps {
  wealth: number;
}

export default function WealthDisplay({ wealth }: WealthDisplayProps) {
  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-full px-8 py-4 text-center border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/25">
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
          ${wealth}
        </div>
      </div>
    </div>
  );
}
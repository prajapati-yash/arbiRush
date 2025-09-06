interface CountdownScreenProps {
  countdown: number;
}

export default function CountdownScreen({ countdown }: CountdownScreenProps) {
  return (
    <div className="text-center z-20">
      <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text animate-pulse">
        {countdown}
      </div>
      <div className="text-2xl text-cyan-300 mt-8">
        Get Ready!
      </div>
    </div>
  );
}
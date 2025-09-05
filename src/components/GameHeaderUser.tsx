'use client';

import { useUserConnection } from '@/hooks/useUserConnection';

export default function GameHeaderUser() {
  const { isConnected, userDetails, getUserDisplayInfo } = useUserConnection();

  if (!isConnected) {
    return null;
  }

  const displayInfo = getUserDisplayInfo();
  if (!displayInfo) return null;

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-800/90 to-purple-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30 shadow-lg">
      {displayInfo.avatar && (
        <img 
          src={displayInfo.avatar} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-green-400/50"
        />
      )}
      <div className="flex flex-col">
        <div className="text-green-400 font-bold text-xs">
          {displayInfo.name}
        </div>
        <div className="text-gray-300 text-xs">
          {displayInfo.identifier}
        </div>
      </div>
    </div>
  );
}

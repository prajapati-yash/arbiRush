'use client';

import { useState } from 'react';
import { useUserConnection } from '@/hooks/useUserConnection';

export default function EnhancedWalletConnection() {
  const {
    isConnected,
    isSDKLoaded,
    userDetails,
    isLoading,
    connectors,
    handleConnect,
    handleDisconnect,
    getUserDisplayInfo
  } = useUserConnection();

  const [showConnectors, setShowConnectors] = useState(false);

  // Get connector icons and names
  const getConnectorInfo = (connectorName: string) => {
    switch (connectorName) {
      case 'Farcaster Frame':
        return { icon: '🔗', name: 'Farcaster', color: 'from-purple-600 to-pink-600' };
      case 'MetaMask':
        return { icon: '🦊', name: 'MetaMask', color: 'from-orange-600 to-red-600' };
      case 'Coinbase Wallet':
        return { icon: '🔵', name: 'Coinbase', color: 'from-blue-600 to-indigo-600' };
      default:
        return { icon: '💼', name: connectorName, color: 'from-gray-600 to-slate-600' };
    }
  };

  if (!isSDKLoaded) {
    return (
      <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30 shadow-lg">
        <div className="text-center">
          <div className="text-cyan-400 mb-2">🔄</div>
          <div className="text-sm text-gray-300">Loading Farcaster SDK...</div>
        </div>
      </div>
    );
  }

  if (isConnected) {
    const displayInfo = getUserDisplayInfo();
    const connectorInfo = getConnectorInfo(userDetails.connectorName || 'Unknown');
    
    return (
      <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 shadow-lg shadow-green-400/25">
        <div className="flex items-center space-x-3">
          {displayInfo?.avatar && (
            <img 
              src={displayInfo.avatar} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-green-400/50"
            />
          )}
          <div className="flex-1">
            <div className="text-green-400 font-bold text-sm">
              {displayInfo?.name || 'Connected User'}
            </div>
            {displayInfo?.identifier && (
              <div className="text-xs text-gray-300">
                {displayInfo.identifier}
              </div>
            )}
            {displayInfo?.secondaryInfo && (
              <div className="text-xs text-cyan-300">
                {displayInfo.secondaryInfo}
              </div>
            )}
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <span>{connectorInfo.icon}</span>
              <span>{connectorInfo.name}</span>
              {displayInfo?.source === 'Neynar API' && (
                <span className="text-green-400">• Farcaster Profile Found</span>
              )}
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  if (showConnectors) {
    return (
      <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30 shadow-lg">
        <div className="text-center mb-4">
          <div className="text-cyan-400 mb-2">🔗</div>
          <div className="text-sm text-gray-300 mb-3">
            Choose your wallet to connect
          </div>
        </div>
        
        <div className="space-y-2">
          {connectors.map((connector) => {
            const connectorInfo = getConnectorInfo(connector.name);
            return (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${connectorInfo.color} hover:opacity-80 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg flex items-center justify-center space-x-2`}
              >
                <span className="text-lg">{connectorInfo.icon}</span>
                <span>{connectorInfo.name}</span>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => setShowConnectors(false)}
          className="w-full mt-3 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30 shadow-lg">
      <div className="text-center">
        <div className="text-cyan-400 mb-2">🔗</div>
        <div className="text-sm text-gray-300 mb-3">
          Connect your wallet to play ArbiRush
        </div>
        <button
          onClick={() => setShowConnectors(true)}
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
}

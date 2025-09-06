'use client';

import { useState } from 'react';
import { useUserConnection } from '@/hooks/useUserConnection';
import coinbase from "@/assets/cbase.webp"
import farcaster from "@/assets/farcaster.jpg"
import metamask from "@/assets/fox.svg"
import Image from 'next/image';

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
        return { icon: farcaster, name: 'Farcaster', color: 'from-cyan-500 via-blue-600 to-indigo-700' };
      case 'MetaMask':
        return { icon: metamask, name: 'MetaMask', color: 'from-cyan-500 via-blue-600 to-indigo-700' };
      case 'Coinbase Wallet':
        return { icon: coinbase, name: 'Coinbase', color: 'from-cyan-500 via-blue-600 to-indigo-700' };
      default:
        return { icon: null, name: connectorName, color: 'from-cyan-500 via-blue-600 to-indigo-700' };
    }
  };

  if (!isSDKLoaded) {
    return (
      <div className="bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-indigo-700/10 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/30 shadow-lg">
        <div className="text-center">
          <div className="text-cyan-300 mb-2">🔄</div>
          <div className="text-sm text-blue-200 font-ubuntu">Loading Farcaster SDK...</div>
        </div>
      </div>
    );
  }

  if (isConnected) {
    const displayInfo = getUserDisplayInfo();
    const connectorInfo = getConnectorInfo(userDetails.connectorName || 'Unknown');
    
    return (
      <div className="bg-gradient-to-br from-cyan-500/15 via-blue-600/15 to-indigo-700/15 backdrop-blur-sm rounded-2xl p-4 border border-cyan-300/40 shadow-lg shadow-cyan-400/25">
        <div className="flex items-center space-x-3">
          {displayInfo?.avatar && (
            <Image 
              src={displayInfo.avatar} 
              alt="Profile" 
              width={48}
              height={48}
              className="w-12 h-12 rounded-full border-2 border-cyan-300/60"
            />
          )}
          <div className="flex-1">
            <div className="text-cyan-300 font-bold text-sm font-ubuntu">
              {displayInfo?.name || 'Connected User'}
            </div>
            {displayInfo?.identifier && (
              <div className="text-xs text-blue-200 font-ubuntu">
                {displayInfo.identifier}
              </div>
            )}
            {displayInfo?.secondaryInfo && (
              <div className="text-xs text-indigo-200 font-ubuntu">
                {displayInfo.secondaryInfo}
              </div>
            )}
            <div className="text-xs text-blue-300 flex items-center space-x-1 font-ubuntu">
              {/* <span>{connectorInfo.icon}</span> */}
              <span>{connectorInfo.name}</span>
              {displayInfo?.source === 'Neynar API' && (
                <span className="text-cyan-300">• Farcaster Profile Found</span>
              )}
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="cursor-pointer bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-800 text-white px-3 py-1 rounded-lg text-xs font-bold font-ubuntu transition-all duration-300 shadow-lg hover:shadow-cyan-400/25"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  if (showConnectors) {
    return (
      <div className="bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-indigo-700/10 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/30 shadow-lg">
        <div className="text-center mb-4">
          <div className="text-blue-200 mb-3 font-saira">
            Choose your wallet to connect
          </div>
        </div>
        
        <div className="space-y-3">
          {connectors.map((connector) => {
            const connectorInfo = getConnectorInfo(connector.name);
            return (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isLoading}
                className="cursor-pointer w-full font-pressStart bg-gradient-to-br from-cyan-300/50 via-blue-400 to-indigo-500/50 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600 disabled:opacity-50 text-white px-4 py-3 rounded-2xl text-sm transition-all duration-300 shadow-lg hover:shadow-cyan-300/30 flex items-center justify-center space-x-3 border border-cyan-300/30"
              >
                {connectorInfo.icon && (
                  <Image 
                    src={connectorInfo.icon} 
                    alt={connectorInfo.name} 
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{connectorInfo.name}</span>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => setShowConnectors(false)}
          className="cursor-pointer w-full mt-4 bg-gradient-to-br from-cyan-500/60 via-blue-600/60 to-indigo-700/60 hover:from-cyan-600/70 hover:via-blue-700/70 hover:to-indigo-800/70 text-white px-4 py-2 rounded-2xl font-bold text-sm font-ubuntu transition-all duration-300 backdrop-blur-sm border border-cyan-400/20 shadow-lg hover:shadow-cyan-400/20"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-indigo-700/10 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/30 shadow-lg">
      <div className="text-center">
        <div className="text-blue-200 mb-3 font-saira">
          Connect your wallet to play ArbiRush
        </div>
        <button
          onClick={() => setShowConnectors(true)}
          disabled={isLoading}
          className="cursor-pointer bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-800 disabled:from-cyan-500/50 disabled:via-blue-600/50 disabled:to-indigo-700/50 text-white px-6 py-2 rounded-2xl text-sm font-pressStart transition-all duration-300 shadow-lg hover:shadow-cyan-400/25 "
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
}

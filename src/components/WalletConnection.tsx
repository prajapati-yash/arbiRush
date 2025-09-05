'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { Connector } from 'wagmi';
import { useMiniApp } from '@neynar/react';
import { useState, useEffect } from 'react';

interface UserDetails {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  address?: string;
}

export default function WalletConnection() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isSDKLoaded, context } = useMiniApp();
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);

  // Get user details from Farcaster context
  useEffect(() => {
    if (isSDKLoaded && context) {
      setUserDetails({
        fid: context.user?.fid,
        username: context.user?.username,
        displayName: context.user?.displayName,
        pfpUrl: context.user?.pfpUrl,
        address: address
      });
    }
  }, [isSDKLoaded, context, address]);

  const handleConnect = async (selectedConnector: Connector) => {
    setIsLoading(true);
    try {
      await connect({ connector: selectedConnector });
      setShowConnectors(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setUserDetails({});
  };

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
    const connectorInfo = getConnectorInfo(connector?.name || 'Unknown');
    
    return (
      <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 shadow-lg shadow-green-400/25">
        <div className="flex items-center space-x-3">
          {userDetails.pfpUrl && (
            <img 
              src={userDetails.pfpUrl} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-green-400/50"
            />
          )}
          <div className="flex-1">
            <div className="text-green-400 font-bold text-sm">
              {userDetails.displayName || userDetails.username || 'Connected User'}
            </div>
            {userDetails.fid && (
              <div className="text-xs text-gray-300">
                FID: {userDetails.fid}
              </div>
            )}
            {userDetails.username && (
              <div className="text-xs text-cyan-300">
                @{userDetails.username}
              </div>
            )}
            {address && (
              <div className="text-xs text-gray-400 font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
            <div className="text-xs text-gray-500 flex items-center space-x-1">
              <span>{connectorInfo.icon}</span>
              <span>{connectorInfo.name}</span>
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
          Connect your wallet to play ArbiRun
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
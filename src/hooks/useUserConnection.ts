'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useMiniApp } from '@neynar/react';
import { useState, useEffect } from 'react';
import { fetchUserByAddress } from '@/lib/neynarApi';
import type { Connector } from 'wagmi';

interface UserDetails {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  address?: string;
  connectorName?: string;
  isFarcasterUser?: boolean;
  isFetchedFromNeynar?: boolean;
}

export function useUserConnection() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isSDKLoaded, context } = useMiniApp();
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [isLoading, setIsLoading] = useState(false);

  // Update user details when connection or context changes
  useEffect(() => {
    const updateUserDetails = async () => {
      if (isConnected && address) {
        const isFarcasterUser = isSDKLoaded && context?.user?.fid;
        
        // If we have Farcaster context, use it
        if (isFarcasterUser) {
          setUserDetails({
            fid: context?.user?.fid,
            username: context?.user?.username,
            displayName: context?.user?.displayName,
            pfpUrl: context?.user?.pfpUrl,
            address: address,
            connectorName: connector?.name,
            isFarcasterUser: true,
            isFetchedFromNeynar: false
          });
        } else {
          // If no Farcaster context, try to fetch from Neynar API
          try {
            const neynarUser = await fetchUserByAddress(address);
            
            if (neynarUser) {
              // Found Farcaster profile for this address
              setUserDetails({
                fid: neynarUser.fid,
                username: neynarUser.username,
                displayName: neynarUser.display_name,
                pfpUrl: neynarUser.pfp_url,
                address: address,
                connectorName: connector?.name,
                isFarcasterUser: true,
                isFetchedFromNeynar: true
              });
            } else {
              // No Farcaster profile found, show wallet info
              setUserDetails({
                address: address,
                connectorName: connector?.name,
                isFarcasterUser: false,
                isFetchedFromNeynar: false
              });
            }
          } catch (error) {
            console.error('Error fetching user from Neynar:', error);
            // Fallback to wallet info only
            setUserDetails({
              address: address,
              connectorName: connector?.name,
              isFarcasterUser: false,
              isFetchedFromNeynar: false
            });
          }
        }
      } else {
        setUserDetails({});
      }
    };

    updateUserDetails();
  }, [isConnected, address, isSDKLoaded, context, connector]);

  const handleConnect = async (selectedConnector: Connector) => {
    setIsLoading(true);
    try {
      await connect({ connector: selectedConnector });
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

  // Get user display info - prioritizes Farcaster info when available
  const getUserDisplayInfo = () => {
    if (userDetails.isFarcasterUser) {
      return {
        name: userDetails.displayName || userDetails.username || 'Farcaster User',
        avatar: userDetails.pfpUrl,
        identifier: `FID: ${userDetails.fid}`,
        secondaryInfo: userDetails.username ? `@${userDetails.username}` : undefined,
        source: userDetails.isFetchedFromNeynar ? 'Neynar API' : 'Farcaster Context'
      };
    } else if (isConnected && address) {
      return {
        name: 'Connected User',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
        identifier: `${address.slice(0, 6)}...${address.slice(-4)}`,
        secondaryInfo: connector?.name || 'Wallet',
        source: 'Wallet Only'
      };
    }
    return null;
  };

  return {
    isConnected,
    isSDKLoaded,
    userDetails,
    isLoading,
    connectors,
    handleConnect,
    handleDisconnect,
    getUserDisplayInfo
  };
}

'use client';

import { useState, useEffect } from 'react';
import { UserProgressData } from '@/lib/userProgress';

interface UseUserProgressProps {
  userDetails?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    address?: string;
    connectorName?: string;
    isFarcasterUser?: boolean;
  };
  isConnected: boolean;
}

export function useUserProgress({ userDetails, isConnected }: UseUserProgressProps) {
  const [userProgress, setUserProgress] = useState<UserProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user progress when user connects
  useEffect(() => {
    if (isConnected && userDetails?.address) {
      loadUserProgress();
    } else {
      setUserProgress(null);
    }
  }, [isConnected, userDetails?.address, userDetails?.fid]);

  const loadUserProgress = async () => {
    if (!userDetails?.address && !userDetails?.fid) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (userDetails.address) params.set('address', userDetails.address);
      if (userDetails.fid) params.set('fid', userDetails.fid.toString());
      
      const response = await fetch(`/api/user-progress?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load user progress');
      }
      
      setUserProgress(data.progress);
    } catch (err) {
      console.error('Error loading user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (gameData: { currentLevel: number; currentWealth: number }) => {
    if (!userDetails?.address) {
      throw new Error('User must be connected to save progress');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userDetails: {
            fid: userDetails.fid,
            username: userDetails.username,
            displayName: userDetails.displayName,
            pfpUrl: userDetails.pfpUrl,
            address: userDetails.address,
            connectorName: userDetails.connectorName,
            isFarcasterUser: userDetails.isFarcasterUser || false,
          },
          gameData,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save user progress');
      }
      
      setUserProgress(data.progress);
      return data.progress;
    } catch (err) {
      console.error('Error saving user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to save progress');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getStartingLevel = () => {
    return userProgress?.currentLevel || 1;
  };

  const getMaxLevelReached = () => {
    return userProgress?.maxLevelReached || 1;
  };

  const canStartFromLevel = (level: number) => {
    const maxReached = getMaxLevelReached();
    return level <= maxReached;
  };

  return {
    userProgress,
    isLoading,
    error,
    loadUserProgress,
    saveProgress,
    getStartingLevel,
    getMaxLevelReached,
    canStartFromLevel,
  };
}
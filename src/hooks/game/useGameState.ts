import { useState, useRef } from 'react';
import { GameState, HoveredGate, LevelConfig } from '@/types/game';

export const useGameState = () => {
  const [wealth, setWealth] = useState(10);
  const wealthRef = useRef(10);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gatesInLevel, setGatesInLevel] = useState(0);
  const [gameState, setGameState] = useState<GameState>('start');
  const [countdown, setCountdown] = useState(3);
  const [maxLevel, setMaxLevel] = useState(1);
  const [hoveredGate, setHoveredGate] = useState<HoveredGate | null>(null);

  const resetGame = () => {
    setGameOver(false);
    setLevelComplete(false);
    setWealth(10);
    wealthRef.current = 10;
    setCurrentLevel(1);
    setGatesInLevel(0);
    setGameState('start');
  };

  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setGameState('playing');
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    // Reset to level 1 when starting fresh
    setCurrentLevel(1);
    setWealth(10);
    wealthRef.current = 10;
    startCountdown();
  };

  const nextLevel = (levelConfig: Record<number, LevelConfig>) => {
    const goalAchieved = wealth >= (levelConfig[currentLevel]?.goal || 100);
    
    if (goalAchieved && currentLevel < 5) {
      // Goal achieved - proceed to next level
      setCurrentLevel(currentLevel + 1);
      setLevelComplete(false);
      setGatesInLevel(0);
      // Reset wealth to starting value for new level
      setWealth(10);
      wealthRef.current = 10;
      setGameState('story');
    } else {
      // Either goal not achieved or max level reached - retry same level
      retryLevel();
    }
  };

  const retryLevel = () => {
    setLevelComplete(false);
    setGatesInLevel(0);
    // Reset wealth to starting value for retry
    setWealth(10);
    wealthRef.current = 10;
    startCountdown();
  };

  const showLeaderboard = () => {
    setGameState('leaderboard');
  };

  const backToStart = () => {
    setGameState('start');
  };

  const showInfoScreen = () => {
    setGameState('info');
  };

  const continueFromStory = () => {
    // Ensure wealth is reset for the current level
    setWealth(10);
    wealthRef.current = 10;
    startCountdown();
  };

  return {
    // State
    wealth,
    wealthRef,
    gameOver,
    levelComplete,
    currentLevel,
    gatesInLevel,
    gameState,
    countdown,
    maxLevel,
    hoveredGate,
    // State setters
    setWealth,
    setGameOver,
    setLevelComplete,
    setCurrentLevel,
    setGatesInLevel,
    setGameState,
    setCountdown,
    setMaxLevel,
    setHoveredGate,
    // Actions
    resetGame,
    startCountdown,
    startGame,
    nextLevel,
    retryLevel,
    showLeaderboard,
    backToStart,
    showInfoScreen,
    continueFromStory
  };
};
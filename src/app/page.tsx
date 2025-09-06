'use client';

import { useGameState } from '@/hooks/game/useGameState';
import { useUserConnection } from '@/hooks/useUserConnection';
import { useUserProgress } from '@/hooks/useUserProgress';
import { levelConfig } from '@/config/gameConfig';

// Screen Components
import StartScreen from '@/components/screens/StartScreen';
import LeaderboardScreen from '@/components/screens/LeaderboardScreen';
import InfoScreen from '@/components/screens/InfoScreen';
import StoryScreen from '@/components/screens/StoryScreen';
import CountdownScreen from '@/components/screens/CountdownScreen';
import LevelCompleteScreen from '@/components/screens/LevelCompleteScreen';
import GameOverScreen from '@/components/screens/GameOverScreen';

// Game Components
import GameEngine from '@/components/game/GameEngine';
import GameHeader from '@/components/game/GameHeader';
import WealthDisplay from '@/components/game/WealthDisplay';
import GameTooltip from '@/components/game/GameTooltip';
import GameInstructions from '@/components/game/GameInstructions';

export default function ArbiRush() {
  // User connection and progress hooks
  const { isConnected, userDetails } = useUserConnection();
  const { userProgress, saveProgress, getStartingLevel } = useUserProgress({
    userDetails,
    isConnected
  });

  // Handle level completion and save progress
  const handleLevelComplete = async (level: number, wealth: number, gatesPassed: number, timeTaken: number) => {
    if (isConnected && userDetails?.address) {
      await saveProgress({
        currentLevel: level + 1, // Next level to start from
        currentWealth: wealth,
        gatesPassed,
        timeTaken,
        isLevelCompletion: true
      });
    }
  };

  // Game state hook with progress integration
  const {
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
    startGame,
    nextLevel,
    retryLevel,
    showLeaderboard,
    backToStart,
    showInfoScreen,
    continueFromStory
  } = useGameState({
    onLevelComplete: handleLevelComplete,
    initialLevel: getStartingLevel()
  });

  const handleStartGame = () => {
    // Start from saved progress level or level 1
    const startingLevel = getStartingLevel();
    startGame(startingLevel);
  };

  const handleNextLevel = () => {
    nextLevel(levelConfig);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#000030] via-[#000056]/80 to-[#000030] text-white relative overflow-hidden">
      {gameState === 'start' ? (
        <StartScreen 
          onStartGame={handleStartGame}
          onShowLeaderboard={showLeaderboard}
          onShowInfoScreen={showInfoScreen}
          userProgress={userProgress}
          isConnected={isConnected}
        />
      ) : gameState === 'leaderboard' ? (
        <LeaderboardScreen onBackToStart={backToStart} />
      ) : gameState === 'info' ? (
        <InfoScreen onBackToStart={backToStart} />
      ) : gameState === 'story' ? (
        <StoryScreen 
          currentLevel={currentLevel}
          onContinueFromStory={continueFromStory}
        />
      ) : gameState === 'countdown' ? (
        <CountdownScreen countdown={countdown} />
      ) : (
        <>
          {/* Header - Only show during gameplay */}
          {gameState === 'playing' && (
            <>
              <GameHeader 
                currentLevel={currentLevel}
                onShowInfoScreen={showInfoScreen}
              />
              <WealthDisplay wealth={wealth} />
            </>
          )}

          {gameState === 'levelComplete' ? (
            <LevelCompleteScreen
              wealth={wealth}
              currentLevel={currentLevel}
              gatesInLevel={gatesInLevel}
              onNextLevel={handleNextLevel}
              onRetryLevel={retryLevel}
              onResetGame={resetGame}
            />
          ) : gameState === 'gameOver' ? (
            <GameOverScreen
              wealth={wealth}
              onResetGame={resetGame}
            />
          ) : gameState === 'playing' ? (
            <>
              <GameEngine
                gameState={gameState}
                gameOver={gameOver}
                levelComplete={levelComplete}
                currentLevel={currentLevel}
                wealth={wealth}
                wealthRef={wealthRef}
                maxLevel={maxLevel}
                onSetWealth={setWealth}
                onSetGameOver={setGameOver}
                onSetLevelComplete={setLevelComplete}
                onSetGameState={setGameState}
                onSetGatesInLevel={setGatesInLevel}
                onSetMaxLevel={setMaxLevel}
                onSetHoveredGate={setHoveredGate}
              />
              <GameTooltip hoveredGate={hoveredGate} />
            </>
          ) : null}
        </>
      )}

      {/* Instructions - Only show during gameplay */}
      {gameState === 'playing' && <GameInstructions />}
    </div>
  );
}
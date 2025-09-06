'use client';

import { useGameState } from '@/hooks/game/useGameState';
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
  } = useGameState();

  const handleNextLevel = () => {
    nextLevel(levelConfig);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 text-white relative overflow-hidden">
      {gameState === 'start' ? (
        <StartScreen 
          onStartGame={startGame}
          onShowLeaderboard={showLeaderboard}
          onShowInfoScreen={showInfoScreen}
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
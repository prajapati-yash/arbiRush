import { useEffect, useRef } from 'react';
import { GameState, InternalGameState, HoveredGate } from '@/types/game';
import { levelConfig, levelGates, lanePositions } from '@/config/gameConfig';

interface GameEngineProps {
  gameState: GameState;
  gameOver: boolean;
  levelComplete: boolean;
  currentLevel: number;
  wealth: number;
  wealthRef: React.MutableRefObject<number>;
  maxLevel: number;
  onSetWealth: (wealth: number) => void;
  onSetGameOver: (gameOver: boolean) => void;
  onSetLevelComplete: (levelComplete: boolean) => void;
  onSetGameState: (gameState: GameState) => void;
  onSetGatesInLevel: (gates: number) => void;
  onSetMaxLevel: (level: number) => void;
  onSetHoveredGate: (gate: HoveredGate | null) => void;
}

export default function GameEngine({
  gameState,
  gameOver,
  levelComplete,
  currentLevel,
  wealth,
  wealthRef,
  maxLevel,
  onSetWealth,
  onSetGameOver,
  onSetLevelComplete,
  onSetGameState,
  onSetGatesInLevel,
  onSetMaxLevel,
  onSetHoveredGate
}: GameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;

    canvas.width = 400;
    canvas.height = 700;

    // Load GIF once and let it animate naturally
    const runnerImg = new Image();
    runnerImg.src = '/run.gif';
    let imageLoaded = false;
    
    runnerImg.onload = () => {
      imageLoaded = true;
    };
    
    runnerImg.onerror = () => {
      imageLoaded = false;
    };
    
    // No need to force animation - GIFs animate automatically
    const forceGifAnimation = () => {
      // GIF should animate continuously on its own
    };

    const internalGameState: InternalGameState = {
      player: {
        lane: 0, // 0 for left, 1 for right
        x: 160,
        y: 550,
        width: 40,
        height: 40,
        targetX: 160
      },
      items: [],
      speed: 4,
      lastItemSpawn: 0,
      gatesPassed: 0,
      runningAnimation: 0,
      cameraOffset: 0,
      level: currentLevel, // Sync with React state
      gatesInCurrentLevel: 0
    };

    const getGateOptions = (level: number, gatesPassed: number) => {
      const gates = levelGates[level as keyof typeof levelGates];
      if (!gates || gatesPassed >= gates.length) {
        // Fallback to last gate if we exceed the predefined gates
        const lastGate = gates?.[gates.length - 1] || [
          { emoji: '💰', effect: '+10', type: 'add', value: 10, term: 'airdrop' },
          { emoji: '💸', effect: '-5', type: 'subtract', value: 5, term: 'gasFee' }
        ];
        return lastGate;
      }
      
      return gates[gatesPassed];
    };

    const spawnGate = () => {
      const [leftOption, rightOption] = getGateOptions(internalGameState.level, internalGameState.gatesPassed);
      const spawnY = -60;

      // Always spawn exactly 2 items (left and right gates)
      internalGameState.items.push({
        x: lanePositions[0],
        y: spawnY,
        lane: 0,
        type: leftOption.type as any,
        emoji: leftOption.emoji,
        effect: leftOption.effect,
        value: leftOption.value,
        term: leftOption.term
      });

      internalGameState.items.push({
        x: lanePositions[1],
        y: spawnY,
        lane: 1,
        type: rightOption.type as any,
        emoji: rightOption.emoji,
        effect: rightOption.effect,
        value: rightOption.value,
        term: rightOption.term
      });
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || levelComplete) return;
      
      if (e.key === 'ArrowLeft') {
        internalGameState.player.lane = 0;
        internalGameState.player.targetX = lanePositions[0];
      } else if (e.key === 'ArrowRight') {
        internalGameState.player.lane = 1;
        internalGameState.player.targetX = lanePositions[1];
      }
    };

    // Touch and swipe handling for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    const minSwipeDistance = 30;
    const maxSwipeTime = 300;
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (gameOver || levelComplete) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchStartX = touch.clientX - rect.left;
      touchStartY = touch.clientY - rect.top;
      touchStartTime = Date.now();
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (gameOver || levelComplete) return;
      
      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const touchEndX = touch.clientX - rect.left;
      const touchEndY = touch.clientY - rect.top;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;
      
      // Check if it's a swipe (horizontal movement, within time limit)
      if (Math.abs(deltaX) > minSwipeDistance && 
          Math.abs(deltaX) > Math.abs(deltaY) && 
          deltaTime < maxSwipeTime) {
        
        // Swipe left - go to left lane
        if (deltaX < 0) {
          internalGameState.player.lane = 0;
          internalGameState.player.targetX = lanePositions[0];
        }
        // Swipe right - go to right lane  
        else {
          internalGameState.player.lane = 1;
          internalGameState.player.targetX = lanePositions[1];
        }
      }
      // If not a swipe, treat as tap (existing behavior)
      else if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        if (touchStartX < canvas.width / 2) {  
          internalGameState.player.lane = 0;
          internalGameState.player.targetX = lanePositions[0];
        } else {
          internalGameState.player.lane = 1;
          internalGameState.player.targetX = lanePositions[1];
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Check if mouse is over any gate
      let foundGate = null;
      internalGameState.items.forEach((item) => {
        if (
          mouseX >= item.x - 40 &&
          mouseX <= item.x + 40 &&
          mouseY >= item.y - 40 &&
          mouseY <= item.y + 40 &&
          item.y > 50 && item.y < canvas.height - 50
        ) {
          foundGate = { x: mouseX, y: mouseY, term: item.term || 'unknown' };
        }
      });
      
      onSetHoveredGate(foundGate);
    };

    const checkCollisions = () => {
      internalGameState.items.forEach((item) => {
        if (
          Math.abs(item.x - internalGameState.player.x) < 30 &&
          item.y > internalGameState.player.y - 30 &&
          item.y < internalGameState.player.y + 30
        ) {
          // Apply mathematical operations using current wealth from ref
          const currentWealth = wealthRef.current;
          let newWealth = currentWealth;
          
          switch (item.type) {
            case 'add':
              newWealth = currentWealth + item.value;
              break;
            case 'multiply':
              newWealth = Math.floor(currentWealth * item.value);
              break;
            case 'subtract':
              newWealth = Math.max(0, currentWealth - item.value);
              break;
            case 'divide':
              newWealth = Math.max(0, Math.floor(currentWealth / item.value));
              break;
            case 'percentage':
              newWealth = Math.max(0, Math.floor(currentWealth * (100 - item.value) / 100));
              break;
            default:
              console.warn(`Unknown item type: ${item.type}`);
              return;
          }
          
          console.log(`Gate hit: ${item.effect}, Wealth: ${currentWealth} → ${newWealth}`);

          internalGameState.gatesPassed++;
          internalGameState.gatesInCurrentLevel++;

          // Update both ref and React state
          wealthRef.current = newWealth;
          onSetWealth(newWealth);

          // Check if level is complete (7 gates per level)
          if (internalGameState.gatesInCurrentLevel >= 7) {
            const currentLevelGoal = levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100;
            
            // Check if goal is achieved
            if (newWealth >= currentLevelGoal) {
              // Goal achieved - can proceed to next level
              onSetLevelComplete(true);
              onSetGameState('levelComplete');
              onSetGatesInLevel(internalGameState.gatesInCurrentLevel);
              onSetMaxLevel(Math.max(maxLevel, currentLevel + 1));
              // Reset for next level - but keep currentLevel for popup display
              internalGameState.gatesInCurrentLevel = 0;
              internalGameState.level = currentLevel + 1; // Update internal level for next gameplay
            } else {
              // Goal not achieved - retry same level
              onSetGameState('levelComplete');
              onSetLevelComplete(true);
              onSetGatesInLevel(internalGameState.gatesInCurrentLevel);
              // Reset gates but stay on same level
              internalGameState.gatesInCurrentLevel = 0;
              // Keep both levels the same for retry
            }
            return;
          }

          // Check for game over based on new wealth value
          if (newWealth <= 0) {
            onSetGameOver(true);
            onSetGameState('gameOver');
            // Stop spawning new items and clear existing ones
            internalGameState.items = [];
            return;
          }

          // Additional punishment for doing too well - add pressure
          if (newWealth > 200) {
            // High wealth = higher chance of brutal gates
            internalGameState.speed += 0.5; // Make game faster when winning
          }

          // Remove all items from this gate (both left and right)
          internalGameState.items = internalGameState.items.filter(i => Math.abs(i.y - item.y) > 10);
        }
      });
    };

    const gameLoop = () => {
      if (gameOver || levelComplete || gameState !== 'playing') return;

      // Update running animation and force GIF animation
      internalGameState.runningAnimation += 0.3;
      internalGameState.cameraOffset += internalGameState.speed * 0.5;
      forceGifAnimation(); // Ensure GIF keeps animating

      // Create Web3 gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0e23');
      gradient.addColorStop(0.3, '#1a0b3d');
      gradient.addColorStop(0.7, '#2d1b69');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw 3D perspective track with Web3 glow
      const trackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      trackGradient.addColorStop(0, '#1e293b');
      trackGradient.addColorStop(0.5, '#334155');
      trackGradient.addColorStop(1, '#475569');
      ctx.fillStyle = trackGradient;
      ctx.beginPath();
      ctx.moveTo(100, canvas.height);
      ctx.lineTo(140, 0);
      ctx.lineTo(260, 0);
      ctx.lineTo(300, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Draw single lane divider with neon glow
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(200, canvas.height);
      ctx.lineTo(200, 0);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw distance markers with forward motion effect
      for (let i = 0; i < 8; i++) {
        const y = (i * 80) + (internalGameState.cameraOffset % 80);
        if (y < canvas.height) {
          ctx.fillStyle = '#00d4ff';
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = 8;
          ctx.fillRect(197, y, 6, 30);
          ctx.shadowBlur = 0;
        }
      }

      // Add motion blur effect to track edges
      ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(100 + i * 2, 0, 1, canvas.height);
        ctx.fillRect(298 - i * 2, 0, 1, canvas.height);
      }

      // Update player position
      internalGameState.player.x += (internalGameState.player.targetX - internalGameState.player.x) * 0.2;

      // Add slight up-down bouncing motion
      const bounceOffset = Math.sin(internalGameState.runningAnimation) * 3;
      
      // Add shadow under player (adjusted for larger runner)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(internalGameState.player.x - 35, internalGameState.player.y + 25, 70, 12);
      
      // Draw runner - try GIF first, fallback to emoji
      if (imageLoaded && runnerImg && runnerImg.naturalWidth > 0) {
        // Save current context
        ctx.save();
        
        // Flip horizontally to face toward the road
        ctx.scale(-1, 1);
        
        try {
          ctx.drawImage(
            runnerImg, 
            -(internalGameState.player.x + 35), // Adjust x position for larger flipped image
            internalGameState.player.y + bounceOffset - 35, 
            70, // Enlarged width
            70  // Enlarged height
          );
        } catch (e) {
          // If drawImage fails, use emoji
          ctx.restore();
          ctx.font = '70px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🏃‍♂️', internalGameState.player.x, internalGameState.player.y + bounceOffset);
          ctx.save();
        }
        
        // Restore context
        ctx.restore();
      } else {
        // Fallback emoji if GIF not loaded
        ctx.font = '70px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏃‍♂️', internalGameState.player.x, internalGameState.player.y + bounceOffset);
      }

      // Spawn gates at regular intervals (only if game is active)
      if (Date.now() - internalGameState.lastItemSpawn > 2500 && gameState === 'playing') {
        spawnGate();
        internalGameState.lastItemSpawn = Date.now();
      }

      // Update and draw gate items
      internalGameState.items.forEach((item, index) => {
        item.y += internalGameState.speed;

        // Draw unified gate background with Web3 gradient
        const gradient = ctx.createRadialGradient(item.x, item.y, 0, item.x, item.y, 50);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(item.x - 40, item.y - 40, 80, 80);
        
        // Draw gate border with cyberpunk glow
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.strokeRect(item.x - 40, item.y - 40, 80, 80);
        ctx.shadowBlur = 0;

        // Draw emoji smaller to look road-appropriate
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, item.x, item.y - 5);
        
        // Draw mathematical operation with neon effect (smaller)
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#00ff88';
        ctx.strokeStyle = '#001122';
        ctx.lineWidth = 2;
        ctx.strokeText(item.effect, item.x, item.y + 18);
        ctx.fillStyle = '#00ff88';
        ctx.fillText(item.effect, item.x, item.y + 18);

        if (item.y > canvas.height) {
          internalGameState.items.splice(index, 1);
        }
      });

      checkCollisions();

      // Increase speed gradually
      internalGameState.speed += 0.002;

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    document.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mousemove', handleMouseMove);
    internalGameState.lastItemSpawn = Date.now();
    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Clear tooltip when component unmounts
      onSetHoveredGate(null);
    };
  }, [gameState, gameOver, levelComplete, currentLevel]);

  return (
    <canvas
      ref={canvasRef}
      className="touch-none"
      style={{ maxWidth: '100vw', maxHeight: '100vh' }}
    />
  );
}
'use client';

import { useEffect, useRef, useState } from 'react';
import EnhancedWalletConnection from '@/components/EnhancedWalletConnection';
import GameHeaderUser from '@/components/GameHeaderUser';
import { useUserConnection } from '@/hooks/useUserConnection';

export default function ArbiRun() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wealth, setWealth] = useState(10);
  const wealthRef = useRef(10);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gatesInLevel, setGatesInLevel] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'countdown' | 'playing' | 'gameOver' | 'levelComplete' | 'leaderboard' | 'info' | 'story'>('start');
  const [countdown, setCountdown] = useState(3);
  const [maxLevel, setMaxLevel] = useState(1);
  const [hoveredGate, setHoveredGate] = useState<{x: number, y: number, term: string} | null>(null);
  
  // Get connection state
  const { isConnected, isSDKLoaded } = useUserConnection();

  // Level configuration with goals and stories
  const levelConfig = {
    1: {
      goal: 25,
      title: "DeFi Rookie",
      story: "Welcome to the DeFi wilderness! Your mission: survive the crypto chaos and grow your wealth from $10 to $25. Watch out for rug pulls and gas fees!",
      description: "Learn the basics of DeFi navigation"
    },
    2: {
      goal: 50,
      title: "Yield Hunter", 
      story: "You've survived your first DeFi adventure! Now the stakes are higher. Navigate through more complex strategies to reach $50. The whales are watching...",
      description: "Master yield farming strategies"
    },
    3: {
      goal: 100,
      title: "Protocol Master",
      story: "Impressive! You're becoming a DeFi legend. But the market is getting volatile. Can you double your wealth to $100 while avoiding the bear traps?",
      description: "Navigate volatile markets like a pro"
    },
    4: {
      goal: 200,
      title: "Whale Territory",
      story: "You've entered whale territory! The big players are making moves that could pump or dump your portfolio instantly. Reach $200 to join their ranks.",
      description: "Compete with the crypto whales"
    },
    5: {
      goal: 500,
      title: "DeFi Legend",
      story: "This is it - the final challenge! The entire crypto ecosystem is in chaos. Only true DeFi legends can navigate to $500. Will you become the ultimate ArbiRun champion?",
      description: "Become the ultimate DeFi legend"
    }
  };

  // Expanded DeFi terms with explanations
  const defiTerms = {
    'yieldFarming': { emoji: '🌾', name: 'Yield Farming', description: 'Earn rewards by providing liquidity to DeFi protocols' },
    'airdrop': { emoji: '🎁', name: 'Airdrop', description: 'Free tokens distributed to wallet holders' },
    'rugPull': { emoji: '💀', name: 'Rug Pull', description: 'Scam where developers drain liquidity and disappear' },
    'gasFee': { emoji: '⛽', name: 'Gas Fee', description: 'Transaction cost on the blockchain network' },
    'liquidation': { emoji: '🔥', name: 'Liquidation', description: 'Forced selling of assets to cover losses' },
    'flashLoan': { emoji: '⚡', name: 'Flash Loan', description: 'Instant uncollateralized loan that must be repaid in one transaction' },
    'impermanentLoss': { emoji: '📉', name: 'Impermanent Loss', description: 'Temporary loss when providing liquidity in volatile pairs' },
    'stakingReward': { emoji: '💎', name: 'Staking Reward', description: 'Earn passive income by staking tokens' },
    'arbitrage': { emoji: '🔄', name: 'Arbitrage', description: 'Profit from price differences across exchanges' },
    'sandwich': { emoji: '🥪', name: 'Sandwich Attack', description: 'MEV strategy that profits from your transactions' },
    'slippage': { emoji: '🌊', name: 'Slippage', description: 'Price difference between expected and actual trade execution' },
    'moonshot': { emoji: '🚀', name: 'Moonshot', description: 'High-risk investment with potential massive returns' },
    'diamond': { emoji: '💎', name: 'Diamond Hands', description: 'Holding investments despite market volatility' },
    'paperHands': { emoji: '📄', name: 'Paper Hands', description: 'Selling investments at the first sign of loss' },
    'whale': { emoji: '🐋', name: 'Crypto Whale', description: 'Large holder who can influence market prices' },
    'fomo': { emoji: '😱', name: 'FOMO', description: 'Fear of Missing Out on potential gains' }
  };

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

    const internalGameState = {
      player: {
        lane: 0, // 0 for left, 1 for right
        x: 160,
        y: 550,
        width: 40,
        height: 40,
        targetX: 160
      },
      items: [] as Array<{
        x: number;
        y: number;
        lane: number;
        type: 'add' | 'multiply' | 'subtract' | 'divide';
        emoji: string;
        effect: string;
        value: number;
        term?: string;
      }>,
      speed: 4,
      lastItemSpawn: 0,
      gatesPassed: 0,
      runningAnimation: 0,
      cameraOffset: 0,
      level: currentLevel, // Sync with React state
      gatesInCurrentLevel: 0
    };

    const lanePositions = [160, 240]; // Left and right positions only

    // Balanced gate generation algorithm that ensures winnable paths
    const getGateOptions = (level: number, gatesPassed: number) => {
      const currentWealth = wealthRef.current;
      const levelGoal = levelConfig[level as keyof typeof levelConfig]?.goal || 100;
      const gatesRemaining = 4 - gatesPassed;
      const wealthNeeded = Math.max(0, levelGoal - currentWealth);
      
      // Calculate if we can still win with remaining gates
      const canStillWin = (wealth: number, gates: number) => {
        // Optimistic scenario: best possible multipliers
        const maxPossible = wealth * Math.pow(6, gates); // Updated max 6x multiplier
        return maxPossible >= levelGoal;
      };

      // Define gate templates by difficulty - scaled for higher level goals
      const easyGates = [
        { emoji: '🎁', effect: '+15', type: 'add', value: 15, term: 'airdrop' },
        { emoji: '🌾', effect: '+25', type: 'add', value: 25, term: 'yieldFarming' },
        { emoji: '💎', effect: '+35', type: 'add', value: 35, term: 'stakingReward' },
        { emoji: '🔄', effect: '+50', type: 'add', value: 50, term: 'arbitrage' },
        { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' },
        { emoji: '🚀', effect: '×3', type: 'multiply', value: 3, term: 'moonshot' }
      ];

      const mediumGates = [
        { emoji: '💎', effect: '×4', type: 'multiply', value: 4, term: 'stakingReward' },
        { emoji: '🚀', effect: '×5', type: 'multiply', value: 5, term: 'moonshot' },
        { emoji: '⚡', effect: '×6', type: 'multiply', value: 6, term: 'flashLoan' },
        { emoji: '⛽', effect: '-10', type: 'subtract', value: 10, term: 'gasFee' },
        { emoji: '📉', effect: '-15', type: 'subtract', value: 15, term: 'impermanentLoss' },
        { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }
      ];

      const hardGates = [
        { emoji: '💀', effect: '/3', type: 'divide', value: 3, term: 'rugPull' },
        { emoji: '🔥', effect: '/4', type: 'divide', value: 4, term: 'liquidation' },
        { emoji: '🥪', effect: '-40', type: 'subtract', value: 40, term: 'sandwich' },
        { emoji: '📄', effect: '/5', type: 'divide', value: 5, term: 'paperHands' },
        { emoji: '🐋', effect: '/6', type: 'divide', value: 6, term: 'whale' },
        { emoji: '😱', effect: '-60', type: 'subtract', value: 60, term: 'fomo' }
      ];

      const brutalGates = [
        { emoji: '💀', effect: '/8', type: 'divide', value: 8, term: 'rugPull' },
        { emoji: '🔥', effect: '/10', type: 'divide', value: 10, term: 'liquidation' },
        { emoji: '🥪', effect: '-80', type: 'subtract', value: 80, term: 'sandwich' },
        { emoji: '😱', effect: '/12', type: 'divide', value: 12, term: 'fomo' },
        { emoji: '📄', effect: '-100', type: 'subtract', value: 100, term: 'paperHands' },
        { emoji: '🐋', effect: '/15', type: 'divide', value: 15, term: 'whale' }
      ];

      // Determine difficulty mix based on level and progress
      let easyWeight, mediumWeight, hardWeight, brutalWeight;
      
      switch(level) {
        case 1: // DeFi Rookie - mostly easy with some medium
          easyWeight = 0.6; mediumWeight = 0.3; hardWeight = 0.1; brutalWeight = 0.0;
          break;
        case 2: // Yield Hunter - balanced mix
          easyWeight = 0.4; mediumWeight = 0.4; hardWeight = 0.2; brutalWeight = 0.0;
          break;
        case 3: // Protocol Master - getting harder
          easyWeight = 0.3; mediumWeight = 0.4; hardWeight = 0.3; brutalWeight = 0.0;
          break;
        case 4: // Whale Territory - mostly hard
          easyWeight = 0.2; mediumWeight = 0.3; hardWeight = 0.4; brutalWeight = 0.1;
          break;
        case 5: // DeFi Legend - nightmare mode
          easyWeight = 0.1; mediumWeight = 0.2; hardWeight = 0.4; brutalWeight = 0.3;
          break;
        default:
          easyWeight = 0.4; mediumWeight = 0.4; hardWeight = 0.2; brutalWeight = 0.0;
      }

      // Adjust weights based on current situation
      if (wealthNeeded > currentWealth) {
        // Need more wealth - increase easy gates
        easyWeight += 0.2;
        mediumWeight += 0.1;
        hardWeight -= 0.2;
        brutalWeight -= 0.1;
      } else if (currentWealth > levelGoal * 1.5) {
        // Too much wealth - increase difficulty
        easyWeight -= 0.2;
        mediumWeight -= 0.1;
        hardWeight += 0.2;
        brutalWeight += 0.1;
      }

      // Ensure all weights are non-negative and normalize
      easyWeight = Math.max(0, easyWeight);
      mediumWeight = Math.max(0, mediumWeight);
      hardWeight = Math.max(0, hardWeight);
      brutalWeight = Math.max(0, brutalWeight);

      // Normalize weights to ensure they sum to 1
      const totalWeight = easyWeight + mediumWeight + hardWeight + brutalWeight;
      if (totalWeight > 0) {
        easyWeight /= totalWeight;
        mediumWeight /= totalWeight;
        hardWeight /= totalWeight;
        brutalWeight /= totalWeight;
      } else {
        // Fallback to balanced weights if all are zero
        easyWeight = 0.4;
        mediumWeight = 0.4;
        hardWeight = 0.2;
        brutalWeight = 0.0;
      }

      // Ensure at least one path to victory exists
      const generateBalancedGates = () => {
        const gates = [];
        
        // Select gate types based on weights (ensure non-negative lengths)
        const easyCount = Math.max(0, Math.round(easyWeight * 10));
        const mediumCount = Math.max(0, Math.round(mediumWeight * 10));
        const hardCount = Math.max(0, Math.round(hardWeight * 10));
        const brutalCount = Math.max(0, Math.round(brutalWeight * 10));
        
        const gateTypes = [
          ...Array(easyCount).fill('easy'),
          ...Array(mediumCount).fill('medium'),
          ...Array(hardCount).fill('hard'),
          ...Array(brutalCount).fill('brutal')
        ];

        // Ensure we have at least some gate types available
        if (gateTypes.length === 0) {
          gateTypes.push('easy', 'medium');
        }

        const usedGates = new Set();
        
        for (let i = 0; i < 2; i++) {
          let attempts = 0;
          let selectedGate;
          
          do {
            const randomType = gateTypes[Math.floor(Math.random() * gateTypes.length)];
            let gatePool;
            
            switch(randomType) {
              case 'easy': gatePool = easyGates; break;
              case 'medium': gatePool = mediumGates; break;
              case 'hard': gatePool = hardGates; break;
              case 'brutal': gatePool = brutalGates; break;
              default: gatePool = mediumGates;
            }
            
            selectedGate = gatePool[Math.floor(Math.random() * gatePool.length)];
            attempts++;
          } while (usedGates.has(selectedGate.effect) && attempts < 10);
          
          usedGates.add(selectedGate.effect);
          gates.push(selectedGate);
        }

        return gates;
      };

      // Generate gates and ensure at least one viable path exists
      let leftGate, rightGate;
      let attempts = 0;
      
      do {
        [leftGate, rightGate] = generateBalancedGates();
        attempts++;
        
        // Calculate potential outcomes
        const leftOutcome = calculateOutcome(currentWealth, leftGate);
        const rightOutcome = calculateOutcome(currentWealth, rightGate);
        
        // Check if either path can lead to victory
        const leftCanWin = canStillWin(leftOutcome, gatesRemaining - 1);
        const rightCanWin = canStillWin(rightOutcome, gatesRemaining - 1);
        
        // If both paths are dead ends and we have attempts left, regenerate
        if ((!leftCanWin && !rightCanWin) && attempts < 5) {
          continue;
        }
        
        // If we still can't find a good combination, ensure at least one positive option
        if (attempts >= 5 && !leftCanWin && !rightCanWin) {
          if (Math.random() > 0.5) {
            leftGate = easyGates[Math.floor(Math.random() * easyGates.length)];
          } else {
            rightGate = easyGates[Math.floor(Math.random() * easyGates.length)];
          }
        }
        
        break;
      } while (attempts < 10);

      // Randomize left/right placement
      return Math.random() > 0.5 ? [leftGate, rightGate] : [rightGate, leftGate];
    };

    // Helper function to calculate outcome of a gate
    const calculateOutcome = (wealth: number, gate: { type: string; value: number }) => {
      switch(gate.type) {
        case 'add': return wealth + gate.value;
        case 'multiply': return Math.floor(wealth * gate.value);
        case 'subtract': return Math.max(0, wealth - gate.value);
        case 'divide': return Math.max(0, Math.floor(wealth / gate.value));
        default: return wealth;
      }
    };

    const spawnGate = () => {
      const [leftOption, rightOption] = getGateOptions(internalGameState.level, internalGameState.gatesPassed);
      const spawnY = -60;

      // Always spawn exactly 2 items (left and right gates)
      internalGameState.items.push({
        x: lanePositions[0],
        y: spawnY,
        lane: 0,
        type: leftOption.type as 'add' | 'multiply' | 'subtract' | 'divide',
        emoji: leftOption.emoji,
        effect: leftOption.effect,
        value: leftOption.value,
        term: leftOption.term
      });

      internalGameState.items.push({
        x: lanePositions[1],
        y: spawnY,
        lane: 1,
        type: rightOption.type as 'add' | 'multiply' | 'subtract' | 'divide',
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
    const minSwipeDistance = 30; // Minimum distance for swipe
    const maxSwipeTime = 300; // Maximum time for swipe (ms)
    const tooltipTouchTimer: NodeJS.Timeout | null = null;
    
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
          item.y > 50 && item.y < canvas.height - 50 // Only show tooltip for visible gates
        ) {
          foundGate = { x: mouseX, y: mouseY, term: item.term || 'unknown' };
        }
      });
      
      setHoveredGate(foundGate);
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
            default:
              console.warn(`Unknown item type: ${item.type}`);
              return;
          }
          
          console.log(`Gate hit: ${item.effect}, Wealth: ${currentWealth} → ${newWealth}`);

          internalGameState.gatesPassed++;
          internalGameState.gatesInCurrentLevel++;

          // Update both ref and React state
          wealthRef.current = newWealth;
          setWealth(newWealth);

          // Check if level is complete (4 gates per level)
          if (internalGameState.gatesInCurrentLevel >= 4) {
            const currentLevelGoal = levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100;
            
            // Check if goal is achieved
            if (newWealth >= currentLevelGoal) {
              // Goal achieved - can proceed to next level
              setLevelComplete(true);
              setGameState('levelComplete');
              setGatesInLevel(internalGameState.gatesInCurrentLevel);
              setMaxLevel(Math.max(maxLevel, currentLevel + 1));
              // Reset for next level - but keep currentLevel for popup display
              internalGameState.gatesInCurrentLevel = 0;
              internalGameState.level = currentLevel + 1; // Update internal level for next gameplay
            } else {
              // Goal not achieved - retry same level
              setGameState('levelComplete');
              setLevelComplete(true);
              setGatesInLevel(internalGameState.gatesInCurrentLevel);
              // Reset gates but stay on same level
              internalGameState.gatesInCurrentLevel = 0;
              // Keep both levels the same for retry
            }
            return;
          }

          // Check for game over based on new wealth value
          if (newWealth <= 0) {
            setGameOver(true);
            setGameState('gameOver');
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
      setHoveredGate(null);
    };
  }, [gameState, gameOver, levelComplete, currentLevel]);

  const resetGame = () => {
    setGameOver(false);
    setLevelComplete(false);
    setWealth(10);
    wealthRef.current = 10;
    setCurrentLevel(1);
    setGatesInLevel(0);
    setGameState('start');
  };

  const nextLevel = () => {
    const goalAchieved = wealth >= (levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100);
    
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

  const startGame = () => {
    // Check if wallet is connected before starting game
    if (!isConnected) {
      alert('Please connect your wallet to start playing ArbiRun!');
      return;
    }
    
    // Reset to level 1 when starting fresh
    setCurrentLevel(1);
    setWealth(10);
    wealthRef.current = 10;
    startCountdown();
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 text-white relative overflow-hidden">
      {gameState === 'start' ? (
        // Start Screen
        <div className="text-center z-20">
          <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text mb-8">
            ArbiRun
          </div>
          <div className="text-xl text-cyan-300 mb-8">
            Navigate through the DeFi gates and manage your wealth!
          </div>
          
          {/* Wallet Connection Component */}
          <div className="mb-8 max-w-md mx-auto">
            <EnhancedWalletConnection />
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={startGame}
              className={`${
                isConnected 
                  ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 hover:shadow-green-500/25' 
                  : 'bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700'
              } text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 border ${
                isConnected ? 'border-green-400/30' : 'border-gray-400/30'
              }`}
            >
              {isConnected ? '🚀 Start Game' : '🔒 Connect Wallet to Play'}
            </button>
            <button
              onClick={showLeaderboard}
              className="bg-gradient-to-r from-purple-600 to-slate-600 hover:from-purple-700 hover:to-slate-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 border border-purple-400/30"
            >
              Leaderboard
            </button>
            <button
              onClick={showInfoScreen}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 border border-blue-400/30"
            >
              📚 DeFi Guide
            </button>
          </div>
        </div>
      ) : gameState === 'leaderboard' ? (
        // Leaderboard Screen
        <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-400/50 shadow-2xl shadow-purple-500/50">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-6">
            Leaderboard
          </div>
          <div className="text-xl text-cyan-300 mb-8">
            Your leaderboard is under construction
          </div>
          <button
            onClick={backToStart}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
          >
            Back to Menu
          </button>
        </div>
      ) : gameState === 'info' ? (
        // Info/DeFi Guide Screen
        <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-400/50 shadow-2xl shadow-blue-500/50 max-w-4xl mx-4">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-6">
            📚 DeFi Terms Guide
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
            {Object.entries(defiTerms).map(([key, term]) => (
              <div key={key} className="bg-slate-700/50 p-4 rounded-lg border border-cyan-400/30">
                <div className="text-2xl mb-2">{term.emoji}</div>
                <div className="text-lg font-bold text-cyan-400 mb-1">{term.name}</div>
                <div className="text-sm text-gray-300">{term.description}</div>
              </div>
            ))}
          </div>
          <button
            onClick={backToStart}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
          >
            Back to Menu
          </button>
        </div>
      ) : gameState === 'story' ? (
        // Story Screen
        <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/50 max-w-2xl mx-4">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-4">
            {levelConfig[currentLevel as keyof typeof levelConfig]?.title || "Level " + currentLevel}
          </div>
          <div className="text-6xl mb-6">🏆</div>
          <div className="text-lg text-gray-300 mb-6 leading-relaxed">
            {levelConfig[currentLevel as keyof typeof levelConfig]?.story || "Continue your DeFi journey!"}
          </div>
          <div className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 p-4 rounded-lg border border-green-400/30 mb-6">
            <div className="text-xl font-bold text-green-400 mb-2">
              Level {currentLevel} Goal: ${levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100}
            </div>
            <div className="text-cyan-300">
              {levelConfig[currentLevel as keyof typeof levelConfig]?.description || "Survive the challenges ahead"}
            </div>
          </div>
          <button
            onClick={continueFromStory}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 border border-yellow-400/30"
          >
            Start Level {currentLevel}
          </button>
        </div>
      ) : gameState === 'countdown' ? (
        // Countdown Screen
        <div className="text-center z-20">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text animate-pulse">
            {countdown}
          </div>
          <div className="text-2xl text-cyan-300 mt-8">
            Get Ready!
          </div>
        </div>
      ) : (
        <>
          {/* Header - Only show during gameplay */}
          {gameState === 'playing' && (
            <>
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-sm p-4 flex justify-between items-center z-10 border-b border-cyan-400/30">
                <div className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text">
                  ArbiRun
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Level {currentLevel}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-600/80 to-orange-600/80 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Goal: ${levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100}
                  </div>
                  <button
                    onClick={showInfoScreen}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-all duration-300 border border-blue-400/30"
                  >
                    ℹ️
                  </button>
                </div>
              </div>

              {/* User Display in Game Header */}
              <div className="absolute top-20 right-4 z-10">
                <GameHeaderUser />
              </div>

              {/* Wealth Display */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-full px-8 py-4 text-center border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/25">
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
                    ${wealth}
                  </div>
                </div>
              </div>
            </>
          )}

          {gameState === 'levelComplete' ? (
            <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-green-400/50 shadow-2xl shadow-green-500/50 max-w-md">
              {(() => {
                const goalAchieved = wealth >= (levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100);
                const isMaxLevel = currentLevel >= 5;
                return (
                  <>
                    <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text mb-4">
                      {goalAchieved ? (isMaxLevel ? "🏆 Champion!" : `🎉 Level ${currentLevel} Complete!`) : `❌ Level ${currentLevel} - Goal Not Reached`}
                    </div>
                    <div className="text-xl text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text mb-2">
                      Final Wealth: ${wealth}
                    </div>
                    <div className={`text-lg mb-4 ${goalAchieved ? 'text-green-300' : 'text-red-300'}`}>
                      Level {currentLevel} Goal: ${levelConfig[currentLevel as keyof typeof levelConfig]?.goal || 100} 
                      {goalAchieved ? " ✅" : " ❌"}
                    </div>
                    <div className="text-sm text-gray-300 mb-6">
                      You completed {gatesInLevel} gates!
                    </div>
                    
                    {isMaxLevel && goalAchieved ? (
                      // Game completed
                      <div className="mb-6">
                        <div className="text-2xl text-yellow-400 mb-4">🎊 Congratulations! 🎊</div>
                        <div className="text-lg text-green-300">You&apos;ve become a true DeFi Legend!</div>
                      </div>
                    ) : null}
                    
                    <div className="flex flex-col space-y-3">
                      {goalAchieved && !isMaxLevel ? (
                        <button
                          onClick={nextLevel}
                          className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 border border-green-400/30"
                        >
                          Next Level
                        </button>
                      ) : (
                        <button
                          onClick={retryLevel}
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 border border-orange-400/30"
                        >
                          Retry Level {currentLevel}
                        </button>
                      )}
                      <button
                        onClick={resetGame}
                        className="bg-gradient-to-r from-purple-600 to-slate-600 hover:from-purple-700 hover:to-slate-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 border border-purple-400/30"
                      >
                        Back to Menu
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : gameState === 'gameOver' ? (
        <div className="text-center z-20 bg-gradient-to-b from-slate-800/95 to-purple-900/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-cyan-400/50 shadow-2xl shadow-purple-500/50">
          <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text mb-4">
            Game Over!
          </div>
          <div className="text-xl text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text mb-6">
            Final Wealth: ${wealth}
          </div>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
          >
            Play Again
          </button>
        </div>
          ) : gameState === 'playing' ? (
            <>
              <canvas
                ref={canvasRef}
                className="touch-none"
                style={{ maxWidth: '100vw', maxHeight: '100vh' }}
              />
              {/* Tooltip */}
              {hoveredGate && defiTerms[hoveredGate.term as keyof typeof defiTerms] && (
                <div
                  className="absolute pointer-events-none z-30 bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/50 shadow-lg shadow-cyan-400/25 max-w-xs"
                  style={{
                    left: `${Math.min(hoveredGate.x + 10, window.innerWidth - 250)}px`,
                    top: `${Math.max(hoveredGate.y - 80, 10)}px`
                  }}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl">{defiTerms[hoveredGate.term as keyof typeof defiTerms].emoji}</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {defiTerms[hoveredGate.term as keyof typeof defiTerms].name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {defiTerms[hoveredGate.term as keyof typeof defiTerms].description}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </>
      )}

      {/* Instructions - Only show during gameplay */}
      {gameState === 'playing' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
          <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/10">
            <p className="text-sm mb-2 text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text font-semibold">
              Choose LEFT or RIGHT gate
            </p>
            <p className="text-xs text-cyan-300/80 mb-1">
              Tap sides or use ← → keys
            </p>
            <p className="text-xs text-yellow-300/70">
              Hover over gates for DeFi tips! 💡
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

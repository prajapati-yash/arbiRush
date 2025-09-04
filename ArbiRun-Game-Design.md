# ArbiRun - Game Design Outline

## Core Game Loop
- Player character auto-runs forward continuously
- Every 2-3 seconds, new row of items spawns ahead across 3 lanes
- Player taps left/right to switch lanes and collect/avoid items
- Speed gradually increases every 30 seconds
- Game ends when health reaches zero or player crashes

## Mechanics

### Player Movement
- Tap left/right to switch lanes (smooth transition animation)
- Auto-run forward at increasing speed
- 3 distinct lanes with clear visual separation

### Lane Items
- **Rewards**: Tokens, yield multipliers, airdrops, staking rewards
- **Risks**: Gas fees, rugpulls, liquidations, bridge exploits
- **Obstacles**: Smart contract bugs, MEV bots (must dodge)
- **Power-ups**: Shield (temporary invincibility), magnet (auto-collect nearby rewards)

### Difficulty Progression
- Speed increases every 30 seconds (5% increment)
- More frequent obstacles after 1 minute
- Higher-value rewards/risks at higher speeds
- Multiple items per lane in later stages

## Onchain Concept Mapping

### Rewards
- **+50 ARB**: Basic token collection
- **×2 Yield**: Doubles next 3 rewards
- **+100 Airdrop**: Bonus points burst
- **Staking Boost**: +25% score multiplier for 10 seconds
- **LP Rewards**: Gradual point accumulation

### Risks
- **Gas Fee**: -20 points + brief slowdown
- **Rugpull**: Lose 50% of current score
- **Liquidation**: -100 points
- **Bridge Exploit**: Lose all multipliers

## Scoring System
- Base points: 1 point per second survived
- Token collections: 10-100 points each
- Multipliers stack and decay over time
- High score leaderboard
- Session earnings display in "ARB tokens"

## Visual & UI Elements

### Game Field
- 3-lane track with Arbitrum-themed backgrounds
- Parallax scrolling cityscape with DeFi buildings
- Clear lane dividers with subtle glow effects

### HUD
- Current score (top-left)
- Active multipliers (top-center) 
- Health/shields remaining (top-right)
- Speed indicator (bottom)
- Next milestone countdown

### Items
- Glowing tokens with ARB logo
- Yield farming icons (plant/growth symbols)
- Warning symbols for risks (skull, caution)
- Power-up items with special particle effects

## Theme/Storyline
**"Wealth Building Run through Arbitrum Ecosystem"**

Player is a DeFi trader navigating the fast-paced world of Layer 2 finance. The endless run represents the constant opportunities and risks in crypto markets. Each lane choice mirrors real trading decisions - risk/reward calculations, timing entries, avoiding common pitfalls.

Success requires quick decision-making, understanding when to take risks for higher rewards, and knowing when to play it safe. The increasing speed represents market volatility and the need to adapt quickly to changing conditions.

Victory condition: Survive as long as possible while maximizing wealth accumulation in the Arbitrum ecosystem.
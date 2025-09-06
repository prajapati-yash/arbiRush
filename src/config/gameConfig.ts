import { LevelConfig, DefiTerm, GateOption } from '@/types/game';

export const levelConfig: Record<number, LevelConfig> = {
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
    story: "This is it - the final challenge! The entire crypto ecosystem is in chaos. Only true DeFi legends can navigate to $500. Will you become the ultimate ArbiRush champion?",
    description: "Become the ultimate DeFi legend"
  }
};

export const defiTerms: Record<string, DefiTerm> = {
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

export const levelGates: Record<number, GateOption[][]> = {
  1: [
    [{ emoji: '💰', effect: '+10', type: 'add', value: 10, term: 'airdrop' }, { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }],
    [{ emoji: '💸', effect: '-5', type: 'subtract', value: 5, term: 'gasFee' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '💰', effect: '+5', type: 'add', value: 5, term: 'airdrop' }, { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }],
    [{ emoji: '📉', effect: '-10%', type: 'percentage', value: 10, term: 'impermanentLoss' }, { emoji: '💰', effect: '+10', type: 'add', value: 10, term: 'airdrop' }],
    [{ emoji: '💰', effect: '+5', type: 'add', value: 5, term: 'airdrop' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💸', effect: '-5', type: 'subtract', value: 5, term: 'gasFee' }],
    [{ emoji: '💰', effect: '+10', type: 'add', value: 10, term: 'airdrop' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }]
  ],
  2: [
    [{ emoji: '💰', effect: '+20', type: 'add', value: 20, term: 'airdrop' }, { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }],
    [{ emoji: '📉', effect: '-10%', type: 'percentage', value: 10, term: 'impermanentLoss' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '💰', effect: '+15', type: 'add', value: 15, term: 'airdrop' }, { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }],
    [{ emoji: '💸', effect: '-20', type: 'subtract', value: 20, term: 'gasFee' }, { emoji: '💰', effect: '+10', type: 'add', value: 10, term: 'airdrop' }],
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💸', effect: '-15', type: 'subtract', value: 15, term: 'gasFee' }],
    [{ emoji: '💰', effect: '+20', type: 'add', value: 20, term: 'airdrop' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '💰', effect: '+15', type: 'add', value: 15, term: 'airdrop' }, { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }]
  ],
  3: [
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💰', effect: '+25', type: 'add', value: 25, term: 'airdrop' }],
    [{ emoji: '💸', effect: '-25', type: 'subtract', value: 25, term: 'gasFee' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '💰', effect: '+40', type: 'add', value: 40, term: 'airdrop' }, { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }],
    [{ emoji: '📉', effect: '-10%', type: 'percentage', value: 10, term: 'impermanentLoss' }, { emoji: '💰', effect: '+30', type: 'add', value: 30, term: 'airdrop' }],
    [{ emoji: '🚀', effect: '×3', type: 'multiply', value: 3, term: 'moonshot' }, { emoji: '💸', effect: '-20', type: 'subtract', value: 20, term: 'gasFee' }],
    [{ emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }, { emoji: '💰', effect: '+50', type: 'add', value: 50, term: 'airdrop' }],
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💸', effect: '-30', type: 'subtract', value: 30, term: 'gasFee' }]
  ],
  4: [
    [{ emoji: '💰', effect: '+50', type: 'add', value: 50, term: 'airdrop' }, { emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }],
    [{ emoji: '💸', effect: '-40', type: 'subtract', value: 40, term: 'gasFee' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '🚀', effect: '×3', type: 'multiply', value: 3, term: 'moonshot' }, { emoji: '💰', effect: '+80', type: 'add', value: 80, term: 'airdrop' }],
    [{ emoji: '💀', effect: '-50%', type: 'percentage', value: 50, term: 'rugPull' }, { emoji: '💰', effect: '+70', type: 'add', value: 70, term: 'airdrop' }],
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💸', effect: '-60', type: 'subtract', value: 60, term: 'gasFee' }],
    [{ emoji: '💰', effect: '+40', type: 'add', value: 40, term: 'airdrop' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💸', effect: '-80', type: 'subtract', value: 80, term: 'gasFee' }]
  ],
  5: [
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💰', effect: '+100', type: 'add', value: 100, term: 'airdrop' }],
    [{ emoji: '📉', effect: '/3', type: 'divide', value: 3, term: 'impermanentLoss' }, { emoji: '💸', effect: '-100', type: 'subtract', value: 100, term: 'gasFee' }],
    [{ emoji: '💰', effect: '+200', type: 'add', value: 200, term: 'airdrop' }, { emoji: '🚀', effect: '×3', type: 'multiply', value: 3, term: 'moonshot' }],
    [{ emoji: '💀', effect: '-50%', type: 'percentage', value: 50, term: 'rugPull' }, { emoji: '💰', effect: '+150', type: 'add', value: 150, term: 'airdrop' }],
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💸', effect: '-200', type: 'subtract', value: 200, term: 'gasFee' }],
    [{ emoji: '💰', effect: '+250', type: 'add', value: 250, term: 'airdrop' }, { emoji: '🌊', effect: '/2', type: 'divide', value: 2, term: 'slippage' }],
    [{ emoji: '⚡', effect: '×2', type: 'multiply', value: 2, term: 'flashLoan' }, { emoji: '💸', effect: '-300', type: 'subtract', value: 300, term: 'gasFee' }]
  ]
};

export const lanePositions = [160, 240]; // Left and right positions only
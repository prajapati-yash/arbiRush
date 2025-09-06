export type GameState = 'start' | 'countdown' | 'playing' | 'gameOver' | 'levelComplete' | 'leaderboard' | 'info' | 'story';

export type ItemType = 'add' | 'multiply' | 'subtract' | 'divide' | 'percentage';

export interface GameItem {
  x: number;
  y: number;
  lane: number;
  type: ItemType;
  emoji: string;
  effect: string;
  value: number;
  term?: string;
}

export interface Player {
  lane: number;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
}

export interface InternalGameState {
  player: Player;
  items: GameItem[];
  speed: number;
  lastItemSpawn: number;
  gatesPassed: number;
  runningAnimation: number;
  cameraOffset: number;
  level: number;
  gatesInCurrentLevel: number;
}

export interface HoveredGate {
  x: number;
  y: number;
  term: string;
}

export interface LevelConfig {
  goal: number;
  title: string;
  story: string;
  description: string;
}

export interface DefiTerm {
  emoji: string;
  name: string;
  description: string;
}

export interface GateOption {
  emoji: string;
  effect: string;
  type: string;
  value: number;
  term: string;
}
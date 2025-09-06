import mongoose, { Schema, Document, Model } from 'mongoose';

export interface LevelAttempt {
  level: number;
  startingWealth: number;
  finalWealth: number;
  attemptedAt: Date;
  completedAt?: Date;
  gatesPassed?: number;
  totalGates?: number;
  timeTaken?: number; // in milliseconds
  success: boolean; // true if level was completed successfully, false if failed
  failureReason?: 'timeout' | 'insufficient_wealth' | 'game_over' | 'abandoned';
  wealthProgression?: number[]; // Array of wealth values at different points
}

export interface IUserProgress extends Document {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  address: string;
  connectorName?: string;
  isFarcasterUser: boolean;
  currentLevel: number;
  maxLevelReached: number;
  currentWealth: number;
  totalGamesPlayed: number;
  lastPlayedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // New detailed tracking fields
  levelAttempts: LevelAttempt[]; // All level attempts (success and failure)
  levelCompletions: LevelAttempt[]; // Only successful completions (for backward compatibility)
  bestWealthByLevel: Map<string, number>; // level -> best wealth achieved (string keys for Mongoose)
  totalTimePlayed: number; // total time in milliseconds
  totalAttempts: number; // total number of level attempts
  successfulAttempts: number; // total number of successful completions
}

const UserProgressSchema = new Schema<IUserProgress>({
  fid: {
    type: Number,
    sparse: true, // Allows null/undefined and creates a sparse index
    index: true
  },
  username: {
    type: String,
    sparse: true
  },
  displayName: {
    type: String,
    sparse: true
  },
  pfpUrl: {
    type: String,
    sparse: true
  },
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  connectorName: {
    type: String,
    sparse: true
  },
  isFarcasterUser: {
    type: Boolean,
    required: true,
    default: false
  },
  currentLevel: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  maxLevelReached: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  currentWealth: {
    type: Number,
    required: true,
    default: 10
  },
  totalGamesPlayed: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lastPlayedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // New detailed tracking fields
  levelAttempts: [{
    level: {
      type: Number,
      required: true,
      min: 1
    },
    startingWealth: {
      type: Number,
      required: true,
      default: 10
    },
    finalWealth: {
      type: Number,
      required: true
    },
    attemptedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    gatesPassed: {
      type: Number,
      min: 0
    },
    totalGates: {
      type: Number,
      min: 0
    },
    timeTaken: {
      type: Number, // in milliseconds
      min: 0
    },
    success: {
      type: Boolean,
      required: true,
      default: false
    },
    failureReason: {
      type: String,
      enum: ['timeout', 'insufficient_wealth', 'game_over', 'abandoned']
    },
    wealthProgression: [{
      type: Number
    }]
  }],
  levelCompletions: [{
    level: {
      type: Number,
      required: true,
      min: 1
    },
    startingWealth: {
      type: Number,
      required: true,
      default: 10
    },
    finalWealth: {
      type: Number,
      required: true
    },
    attemptedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    gatesPassed: {
      type: Number,
      min: 0
    },
    totalGates: {
      type: Number,
      min: 0
    },
    timeTaken: {
      type: Number, // in milliseconds
      min: 0
    },
    success: {
      type: Boolean,
      required: true,
      default: true
    },
    wealthProgression: [{
      type: Number
    }]
  }],
  bestWealthByLevel: {
    type: Map,
    of: Number,
    default: new Map()
  },
  totalTimePlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  successfulAttempts: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'user_progress'
});

// Create compound index for efficient leaderboard queries
UserProgressSchema.index({ maxLevelReached: -1, currentWealth: -1 });

// Ensure model is not redefined in development (hot reload)
const UserProgress: Model<IUserProgress> = mongoose.models.UserProgress || 
  mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;
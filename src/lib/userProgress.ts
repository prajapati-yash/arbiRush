import mongoose from 'mongoose';
import clientPromise from '@/lib/mongodb';
import UserProgress, { IUserProgress, LevelAttempt } from '@/models/UserProgress';

export interface UserProgressData {
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
  lastPlayedAt: string;
  createdAt: string;
  updatedAt: string;
  
  // New detailed tracking fields
  levelAttempts: LevelAttempt[]; // All attempts (success and failure)
  levelCompletions: LevelAttempt[]; // Only successful completions
  bestWealthByLevel: Record<number, number>; // level -> best wealth achieved
  totalTimePlayed: number; // total time in milliseconds
  totalAttempts: number; // total number of attempts
  successfulAttempts: number; // total successful attempts
}

// Ensure MongoDB connection
async function connectToMongoDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  await clientPromise;
  
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URL!);
  }
}

// Convert MongoDB document to UserProgressData
function mongoDocToUserProgressData(doc: IUserProgress): UserProgressData {
  // Convert Map to plain object for bestWealthByLevel
  const bestWealthByLevel: Record<number, number> = {};
  if (doc.bestWealthByLevel) {
    for (const [levelStr, wealth] of doc.bestWealthByLevel.entries()) {
      // Convert string key back to number for the response
      const level = parseInt(levelStr);
      if (!isNaN(level)) {
        bestWealthByLevel[level] = wealth;
      }
    }
  }

  return {
    fid: doc.fid,
    username: doc.username,
    displayName: doc.displayName,
    pfpUrl: doc.pfpUrl,
    address: doc.address,
    connectorName: doc.connectorName,
    isFarcasterUser: doc.isFarcasterUser,
    currentLevel: doc.currentLevel,
    maxLevelReached: doc.maxLevelReached,
    currentWealth: doc.currentWealth,
    totalGamesPlayed: doc.totalGamesPlayed,
    lastPlayedAt: doc.lastPlayedAt.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    levelAttempts: doc.levelAttempts || [],
    levelCompletions: doc.levelCompletions || [],
    bestWealthByLevel,
    totalTimePlayed: doc.totalTimePlayed || 0,
    totalAttempts: doc.totalAttempts || 0,
    successfulAttempts: doc.successfulAttempts || 0,
  };
}

// Get user progress by address or fid
export async function getUserProgress(identifier: { address?: string; fid?: number }): Promise<UserProgressData | null> {
  await connectToMongoDB();
  
  try {
    let user: IUserProgress | null = null;
    
    // Try to find by address first
    if (identifier.address) {
      user = await UserProgress.findOne({ 
        address: identifier.address.toLowerCase() 
      }).exec();
    }
    
    // If not found by address and fid is provided, try by fid
    if (!user && identifier.fid) {
      user = await UserProgress.findOne({ 
        fid: identifier.fid 
      }).exec();
    }
    
    return user ? mongoDocToUserProgressData(user) : null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
}

// Save level attempt (both success and failure)
export async function saveLevelAttempt(
  userDetails: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    address: string;
    connectorName?: string;
    isFarcasterUser: boolean;
  },
  attemptData: {
    level: number;
    startingWealth: number;
    finalWealth: number;
    gatesPassed?: number;
    totalGates?: number;
    timeTaken?: number;
    success: boolean;
    failureReason?: 'timeout' | 'insufficient_wealth' | 'game_over' | 'abandoned';
    wealthProgression?: number[];
  }
): Promise<UserProgressData> {
  await connectToMongoDB();
  
  try {
    const address = userDetails.address.toLowerCase();
    const now = new Date();
    
    // Try to find existing user by address or fid
    let existingUser = await UserProgress.findOne({
      $or: [
        { address: address },
        ...(userDetails.fid ? [{ fid: userDetails.fid }] : [])
      ]
    }).exec();
    
    // Create level attempt object
    const levelAttempt: LevelAttempt = {
      level: attemptData.level,
      startingWealth: attemptData.startingWealth,
      finalWealth: attemptData.finalWealth,
      attemptedAt: now,
      completedAt: attemptData.success ? now : undefined,
      gatesPassed: attemptData.gatesPassed,
      totalGates: attemptData.totalGates,
      timeTaken: attemptData.timeTaken,
      success: attemptData.success,
      failureReason: attemptData.failureReason,
      wealthProgression: attemptData.wealthProgression,
    };
    
    if (existingUser) {
      // Update existing user
      existingUser.fid = userDetails.fid;
      existingUser.username = userDetails.username;
      existingUser.displayName = userDetails.displayName;
      existingUser.pfpUrl = userDetails.pfpUrl;
      existingUser.address = address;
      existingUser.connectorName = userDetails.connectorName;
      existingUser.isFarcasterUser = userDetails.isFarcasterUser;
      existingUser.lastPlayedAt = now;
      
      // Initialize arrays if they don't exist (for backward compatibility)
      if (!existingUser.levelAttempts) {
        existingUser.levelAttempts = [];
      }
      if (!existingUser.levelCompletions) {
        existingUser.levelCompletions = [];
      }
      if (!existingUser.bestWealthByLevel) {
        existingUser.bestWealthByLevel = new Map<string, number>();
      }
      if (!existingUser.totalTimePlayed) {
        existingUser.totalTimePlayed = 0;
      }
      if (!existingUser.totalAttempts) {
        existingUser.totalAttempts = 0;
      }
      if (!existingUser.successfulAttempts) {
        existingUser.successfulAttempts = 0;
      }
      
      // Add attempt to all attempts
      existingUser.levelAttempts.push(levelAttempt);
      existingUser.totalAttempts = existingUser.totalAttempts + 1;
      
      // If successful, also add to completions and update progress
      if (attemptData.success) {
        existingUser.levelCompletions.push(levelAttempt);
        existingUser.successfulAttempts = existingUser.successfulAttempts + 1;
        existingUser.currentLevel = Math.max(attemptData.level + 1, existingUser.currentLevel);
        existingUser.maxLevelReached = Math.max(attemptData.level, existingUser.maxLevelReached);
        
        // Update best wealth for this level (convert level to string for Mongoose Map)
        const levelKey = attemptData.level.toString();
        const currentBest = existingUser.bestWealthByLevel.get(levelKey) || 0;
        if (attemptData.finalWealth > currentBest) {
          existingUser.bestWealthByLevel.set(levelKey, attemptData.finalWealth);
        }
      }
      
      // Update current wealth and time played
      existingUser.currentWealth = attemptData.finalWealth;
      if (attemptData.timeTaken) {
        existingUser.totalTimePlayed = existingUser.totalTimePlayed + attemptData.timeTaken;
      }
      
      await existingUser.save();
      return mongoDocToUserProgressData(existingUser);
    } else {
      // Create new user
      const levelAttempts: LevelAttempt[] = [levelAttempt];
      const levelCompletions: LevelAttempt[] = attemptData.success ? [levelAttempt] : [];
      const bestWealthByLevel = new Map<string, number>();
      
      if (attemptData.success) {
        bestWealthByLevel.set(attemptData.level.toString(), attemptData.finalWealth);
      }
      
      const newUser = new UserProgress({
        fid: userDetails.fid,
        username: userDetails.username,
        displayName: userDetails.displayName,
        pfpUrl: userDetails.pfpUrl,
        address: address,
        connectorName: userDetails.connectorName,
        isFarcasterUser: userDetails.isFarcasterUser,
        currentLevel: attemptData.success ? attemptData.level + 1 : attemptData.level,
        maxLevelReached: attemptData.success ? attemptData.level : 1,
        currentWealth: attemptData.finalWealth,
        totalGamesPlayed: 1,
        lastPlayedAt: now,
        levelAttempts: levelAttempts,
        levelCompletions: levelCompletions,
        bestWealthByLevel: bestWealthByLevel,
        totalTimePlayed: attemptData.timeTaken || 0,
        totalAttempts: 1,
        successfulAttempts: attemptData.success ? 1 : 0,
      });
      
      await newUser.save();
      return mongoDocToUserProgressData(newUser);
    }
  } catch (error) {
    console.error('Error saving level attempt:', error);
    throw new Error('Failed to save level attempt');
  }
}

// Save or update user progress (backward compatibility)
export async function saveUserProgress(
  userDetails: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    address: string;
    connectorName?: string;
    isFarcasterUser: boolean;
  },
  gameData: {
    currentLevel: number;
    currentWealth: number;
    gatesPassed?: number;
    timeTaken?: number;
    isLevelCompletion?: boolean; // New flag to indicate if this is a level completion
  }
): Promise<UserProgressData> {
  // Convert to new saveLevelAttempt format if it's a level completion
  if (gameData.isLevelCompletion) {
    return saveLevelAttempt(userDetails, {
      level: gameData.currentLevel - 1, // The level that was just completed
      startingWealth: 10, // Default starting wealth
      finalWealth: gameData.currentWealth,
      gatesPassed: gameData.gatesPassed,
      timeTaken: gameData.timeTaken,
      success: true,
    });
  }
  
  // For non-completion progress updates, maintain old behavior
  await connectToMongoDB();
  
  try {
    const address = userDetails.address.toLowerCase();
    const now = new Date();
    
    let existingUser = await UserProgress.findOne({
      $or: [
        { address: address },
        ...(userDetails.fid ? [{ fid: userDetails.fid }] : [])
      ]
    }).exec();
    
    if (existingUser) {
      // Simple update for non-completion progress
      existingUser.fid = userDetails.fid;
      existingUser.username = userDetails.username;
      existingUser.displayName = userDetails.displayName;
      existingUser.pfpUrl = userDetails.pfpUrl;
      existingUser.currentLevel = gameData.currentLevel;
      existingUser.currentWealth = gameData.currentWealth;
      existingUser.lastPlayedAt = now;
      
      await existingUser.save();
      return mongoDocToUserProgressData(existingUser);
    } else {
      // Create new user for simple progress update
      const newUser = new UserProgress({
        fid: userDetails.fid,
        username: userDetails.username,
        displayName: userDetails.displayName,
        pfpUrl: userDetails.pfpUrl,
        address: address,
        connectorName: userDetails.connectorName,
        isFarcasterUser: userDetails.isFarcasterUser,
        currentLevel: gameData.currentLevel,
        maxLevelReached: gameData.currentLevel,
        currentWealth: gameData.currentWealth,
        totalGamesPlayed: 1,
        lastPlayedAt: now,
        levelAttempts: [],
        levelCompletions: [],
        bestWealthByLevel: new Map<string, number>(),
        totalTimePlayed: 0,
        totalAttempts: 0,
        successfulAttempts: 0,
      });
      
      await newUser.save();
      return mongoDocToUserProgressData(newUser);
    }
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw new Error('Failed to save user progress');
  }
}

// Get leaderboard data
export async function getLeaderboard(limit: number = 10): Promise<UserProgressData[]> {
  await connectToMongoDB();
  
  try {
    const users = await UserProgress.find({})
      .sort({ 
        maxLevelReached: -1, 
        currentWealth: -1 
      })
      .limit(limit)
      .exec();
    
    return users.map(user => mongoDocToUserProgressData(user));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

// Get detailed level statistics for a user
export async function getUserLevelStats(identifier: { address?: string; fid?: number }) {
  const userProgress = await getUserProgress(identifier);
  
  if (!userProgress) return null;
  
  const levelStats = {
    totalLevelsCompleted: userProgress.levelCompletions.length,
    bestWealthByLevel: userProgress.bestWealthByLevel,
    averageWealthPerLevel: 0,
    totalTimePlayed: userProgress.totalTimePlayed,
    averageTimePerLevel: 0,
    levelCompletions: userProgress.levelCompletions.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    ), // Most recent first
    fastestLevelCompletion: null as LevelAttempt | null,
    slowestLevelCompletion: null as LevelAttempt | null,
    bestWealthOverall: Math.max(...userProgress.levelCompletions.map(c => c.finalWealth), 0),
  };
  
  // Calculate averages
  if (userProgress.levelCompletions.length > 0) {
    const totalWealth = userProgress.levelCompletions.reduce((sum, comp) => sum + comp.finalWealth, 0);
    levelStats.averageWealthPerLevel = totalWealth / userProgress.levelCompletions.length;
    
    const completionsWithTime = userProgress.levelCompletions.filter(c => c.timeTaken);
    if (completionsWithTime.length > 0) {
      const totalTime = completionsWithTime.reduce((sum, comp) => sum + (comp.timeTaken || 0), 0);
      levelStats.averageTimePerLevel = totalTime / completionsWithTime.length;
      
      // Find fastest and slowest
      levelStats.fastestLevelCompletion = completionsWithTime.reduce((fastest, current) => 
        (current.timeTaken || 0) < (fastest.timeTaken || 0) ? current : fastest
      );
      levelStats.slowestLevelCompletion = completionsWithTime.reduce((slowest, current) => 
        (current.timeTaken || 0) > (slowest.timeTaken || 0) ? current : slowest
      );
    }
  }
  
  return levelStats;
}
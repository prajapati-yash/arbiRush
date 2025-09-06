import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress, saveUserProgress, getLeaderboard } from '@/lib/userProgress';

export async function GET(request: NextRequest) {
  try {
    // Test database connection by getting leaderboard
    const leaderboard = await getLeaderboard(5);
    
    return NextResponse.json({ 
      success: true,
      message: 'MongoDB connection successful',
      leaderboard: leaderboard,
      totalUsers: leaderboard.length
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType = 'attempt', ...data } = body;
    
    // Test user details
    const testUser = {
      address: data.address || '0x1234567890123456789012345678901234567890',
      fid: data.fid,
      username: data.username,
      displayName: data.displayName || 'Test User',
      pfpUrl: data.pfpUrl,
      connectorName: 'Test Connector',
      isFarcasterUser: !!data.fid,
    };
    
    if (testType === 'attempt') {
      // Test new level attempt tracking
      const { saveLevelAttempt } = await import('@/lib/userProgress');
      
      const testAttemptData = {
        level: data.level || 1,
        startingWealth: data.startingWealth || 10,
        finalWealth: data.finalWealth || 150,
        gatesPassed: data.gatesPassed || 8,
        totalGates: data.totalGates || 10,
        timeTaken: data.timeTaken || 45000,
        success: data.success !== undefined ? data.success : true,
        failureReason: data.failureReason,
        wealthProgression: data.wealthProgression || [10, 25, 40, 80, 120, 150],
      };
      
      const savedProgress = await saveLevelAttempt(testUser, testAttemptData);
      
      return NextResponse.json({
        success: true,
        message: `Test level attempt (${testAttemptData.success ? 'success' : 'failure'}) saved successfully`,
        progress: savedProgress,
        testType: 'attempt'
      });
    } else {
      // Test old progress tracking (backward compatibility)
      const testGameData = {
        currentLevel: data.currentLevel || 1,
        currentWealth: data.currentWealth || 100,
        gatesPassed: data.gatesPassed || 5,
        timeTaken: data.timeTaken || 30000,
        isLevelCompletion: data.isLevelCompletion || true,
      };
      
      const savedProgress = await saveUserProgress(testUser, testGameData);
      
      return NextResponse.json({
        success: true,
        message: 'Test user progress (old format) saved successfully',
        progress: savedProgress,
        testType: 'progress'
      });
    }
  } catch (error) {
    console.error('Test save failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { saveLevelAttempt } from '@/lib/userProgress';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { userDetails, attemptData } = body;
    
    // Validate required fields
    if (!userDetails?.address || !attemptData?.level || attemptData?.finalWealth === undefined || attemptData?.success === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userDetails.address, attemptData.level, attemptData.finalWealth, attemptData.success' },
        { status: 400 }
      );
    }
    
    // Validate failure reason if attempt was unsuccessful
    if (!attemptData.success && !attemptData.failureReason) {
      return NextResponse.json(
        { error: 'failureReason is required when success is false' },
        { status: 400 }
      );
    }
    
    const savedProgress = await saveLevelAttempt(userDetails, attemptData);
    
    return NextResponse.json({ progress: savedProgress });
  } catch (error) {
    console.error('Error saving level attempt:', error);
    return NextResponse.json(
      { error: 'Failed to save level attempt' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress, saveUserProgress } from '@/lib/userProgress';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const fid = searchParams.get('fid');
    
    if (!address && !fid) {
      return NextResponse.json(
        { error: 'Either address or fid parameter is required' },
        { status: 400 }
      );
    }
    
    const identifier = {
      address: address || undefined,
      fid: fid ? parseInt(fid) : undefined
    };
    
    const userProgress = await getUserProgress(identifier);
    
    if (!userProgress) {
      return NextResponse.json({ progress: null });
    }
    
    return NextResponse.json({ progress: userProgress });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { userDetails, gameData } = body;
    
    // Validate required fields
    if (!userDetails?.address || !gameData?.currentLevel || gameData?.currentWealth === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userDetails.address, gameData.currentLevel, gameData.currentWealth' },
        { status: 400 }
      );
    }
    
    const savedProgress = await saveUserProgress(userDetails, gameData);
    
    return NextResponse.json({ progress: savedProgress });
  } catch (error) {
    console.error('Error saving user progress:', error);
    return NextResponse.json(
      { error: 'Failed to save user progress' },
      { status: 500 }
    );
  }
}
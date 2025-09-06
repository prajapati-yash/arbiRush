import { NextRequest, NextResponse } from 'next/server';
import { getUserLevelStats } from '@/lib/userProgress';

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
    
    const userStats = await getUserLevelStats(identifier);
    
    if (!userStats) {
      return NextResponse.json({ stats: null });
    }
    
    return NextResponse.json({ stats: userStats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
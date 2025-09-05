// Neynar API utilities for fetching user information by wallet address

interface NeynarUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
}

interface NeynarResponse {
  users: NeynarUser[];
}

// You'll need to get your API key from https://neynar.com/
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

export async function fetchUserByAddress(address: string): Promise<NeynarUser | null> {
  if (!NEYNAR_API_KEY) {
    console.warn('Neynar API key not provided. Please set NEXT_PUBLIC_NEYNAR_API_KEY');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
      {
        headers: {
          'api_key': NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data: NeynarResponse = await response.json();
    
    if (data.users && data.users.length > 0) {
      return data.users[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching user from Neynar:', error);
    return null;
  }
}

export async function fetchUserByFid(fid: number): Promise<NeynarUser | null> {
  if (!NEYNAR_API_KEY) {
    console.warn('Neynar API key not provided. Please set NEXT_PUBLIC_NEYNAR_API_KEY');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'api_key': NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data: NeynarResponse = await response.json();
    
    if (data.users && data.users.length > 0) {
      return data.users[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching user from Neynar:', error);
    return null;
  }
}

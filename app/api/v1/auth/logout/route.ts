/**
 * POST /api/v1/auth/logout
 * Logout user and clear refresh token cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearRefreshTokenCookie } from '@/lib/auth/jwt';
import { clearAccessTokenCookie } from '@/lib/auth/cookies';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Clear refresh token cookie
    await clearRefreshTokenCookie();
    
    // Clear access token cookie
    await clearAccessTokenCookie();

    return NextResponse.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

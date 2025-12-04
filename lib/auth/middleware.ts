/**
 * Authentication middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from './jwt';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
  userId?: string;
  userEmail?: string;
  userRole?: 'worker' | 'client' | 'admin';
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Verify user still exists in database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, user_type')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not found' },
        { status: 401 }
      );
    }

    const authRequest = request as AuthenticatedRequest;
    authRequest.user = payload;
    authRequest.userId = payload.userId;
    authRequest.userEmail = payload.email;
    authRequest.userRole = payload.role;

    return handler(authRequest);
  } catch (error) {
    logger.error('Authentication error', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Middleware to require specific role
 */
export function requireRole(
  ...allowedRoles: Array<'worker' | 'client' | 'admin'>
) {
  return async (
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const authResponse = await requireAuth(request, async (authReq) => {
      if (!authReq.userRole || !allowedRoles.includes(authReq.userRole)) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      return handler(authReq);
    });

    return authResponse;
  };
}

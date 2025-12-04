/**
 * POST /api/v1/auth/login
 * Login user and return access token + set refresh token cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, JWTPayload } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';
import { withRateLimit } from '@/lib/api-middleware';
import { rateLimitConfigs } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    // Find user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, user_type, password_hash')
      .eq('email', validated.email.toLowerCase())
      .single();

    if (userError || !user) {
      logger.error('User not found during login', { 
        email: validated.email.toLowerCase(),
        error: userError 
      });
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'No account found with this email address'
        },
        { status: 401 }
      );
    }

    if (!user.password_hash) {
      logger.warn('Login attempt for user without password hash', { 
        userId: user.id,
        email: user.email 
      });
      return NextResponse.json(
        { 
          error: 'Password not set. Please use password reset.',
          message: 'This account does not have a password set. Please reset your password.'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(validated.password, user.password_hash);
    if (!isValid) {
      logger.warn('Invalid password attempt', { 
        userId: user.id,
        email: user.email 
      });
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'Incorrect password. Please try again.'
        },
        { status: 401 }
      );
    }

    // Update last active
    await supabaseAdmin
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', user.id);

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.user_type as 'worker' | 'client' | 'admin',
    };

    let accessToken: string;
    let refreshToken: string;
    
    try {
      accessToken = generateAccessToken(payload);
      refreshToken = generateRefreshToken(payload);
    } catch (tokenError: any) {
      logger.error('Error generating tokens', tokenError);
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          message: tokenError?.message || 'Failed to generate authentication tokens. Please contact support.',
          details: 'JWT_SECRET or REFRESH_SECRET may not be configured correctly'
        },
        { status: 500 }
      );
    }

    // Set refresh token cookie
    await setRefreshTokenCookie(refreshToken);

    return NextResponse.json({
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.user_type, // Map user_type to role for frontend
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.issues,
          message: error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
        },
        { status: 400 }
      );
    }

    logger.error('Login error', error);
    return NextResponse.json(
      { 
        error: error?.message || 'Login failed',
        message: error?.message || 'An unexpected error occurred during login. Please try again.',
        details: error?.stack || 'Unknown error'
      },
      { status: 500 }
    );
  }
  }, 'login');
}

/**
 * POST /api/v1/auth/register
 * Register a new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, JWTPayload } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const registerSchema = z.object({
  role: z.enum(['worker', 'client', 'admin']),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', validated.email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Create user in Supabase Auth (if using Supabase Auth)
    // For now, we'll create directly in users table
    // In production, you'd use Supabase Auth API first, then create user record
    const userId = crypto.randomUUID();

    // Insert user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: validated.email.toLowerCase(),
        full_name: validated.name,
        user_type: validated.role,
        phone: validated.phone,
        password_hash: passwordHash,
        profile_complete: false,
        email_verified: false,
        phone_verified: false,
      })
      .select()
      .single();

    if (userError || !user) {
      console.error('Error creating user:', userError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create profile if worker
    if (validated.role === 'worker') {
      await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          verified_level: 'none',
          score: 0,
        });
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.user_type as 'worker' | 'client' | 'admin',
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set refresh token cookie
    await setRefreshTokenCookie(refreshToken);

    // TODO: Send email verification (stub)
    // await sendVerificationEmail(user.email);

    return NextResponse.json({
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.user_type,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

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

    // Create user in Supabase Auth first (required due to foreign key constraint)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validated.email.toLowerCase(),
      password: validated.password,
      email_confirm: true, // Auto-confirm for demo/staging
      user_metadata: {
        full_name: validated.name,
        user_type: validated.role,
        phone: validated.phone,
      },
    });

    if (authError || !authData?.user) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user account' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Insert user in users table (using auth user ID)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId, // Use the auth user ID
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
      // Clean up auth user if users table insert fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Create profile if worker
    if (validated.role === 'worker') {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          verified_level: 'none',
          score: 0,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't fail registration if profile creation fails, just log it
      }
    }

    // Initialize shift credits for all users
    const { error: creditsError } = await supabaseAdmin
      .from('shift_credits')
      .insert({
        user_id: userId,
        balance: 0,
        reserved: 0,
      });

    if (creditsError) {
      console.error('Error initializing credits:', creditsError);
      // Don't fail registration if credits initialization fails
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
        { error: 'Validation error', details: error.issues },
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

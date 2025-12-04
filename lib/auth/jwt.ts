/**
 * JWT Authentication Utilities
 * Handles access tokens and refresh tokens
 */

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Validate JWT secrets - fail fast in production if not set
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your-secret-key-change-in-production') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set to a strong random value in production');
    }
    console.warn('⚠️  JWT_SECRET not set or using default value. This is insecure for production.');
    return 'your-secret-key-change-in-production';
  }
  if (secret.length < 32) {
    console.warn('⚠️  JWT_SECRET appears to be too short. Use at least 32 characters for security.');
  }
  return secret;
};

const getRefreshSecret = () => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret || secret === 'your-refresh-secret-key-change-in-production') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('REFRESH_SECRET must be set to a strong random value in production');
    }
    console.warn('⚠️  REFRESH_SECRET not set or using default value. This is insecure for production.');
    return 'your-refresh-secret-key-change-in-production';
  }
  if (secret.length < 32) {
    console.warn('⚠️  REFRESH_SECRET appears to be too short. Use at least 32 characters for security.');
  }
  return secret;
};

const JWT_SECRET = getJWTSecret();
const REFRESH_SECRET = getRefreshSecret();
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'worker' | 'client' | 'admin';
}

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Set refresh token as httpOnly cookie
 */
export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Get refresh token from cookie
 */
export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value || null;
}

/**
 * Clear refresh token cookie
 */
export async function clearRefreshTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('refresh_token');
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

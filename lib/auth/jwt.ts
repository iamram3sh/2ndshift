/**
 * JWT Authentication Utilities
 * Handles access tokens and refresh tokens
 */

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Lazy validation of JWT secrets - only validate when actually used (runtime)
// This prevents build-time errors when env vars might not be available
let JWT_SECRET: string | null = null;
let REFRESH_SECRET: string | null = null;

const getJWTSecret = (): string => {
  if (JWT_SECRET !== null) {
    return JWT_SECRET;
  }
  
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your-secret-key-change-in-production') {
    // During build time, use placeholder to allow build to complete
    // Validation will happen at runtime when functions are called
    if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
      // Runtime check (not build time)
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be set to a strong random value in production');
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  JWT_SECRET not set or using default value. This is insecure for production.');
      }
    }
    JWT_SECRET = 'your-secret-key-change-in-production';
    return JWT_SECRET;
  }
  
  if (secret.length < 32 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  JWT_SECRET appears to be too short. Use at least 32 characters for security.');
  }
  
  JWT_SECRET = secret;
  return JWT_SECRET;
};

const getRefreshSecret = (): string => {
  if (REFRESH_SECRET !== null) {
    return REFRESH_SECRET;
  }
  
  const secret = process.env.REFRESH_SECRET;
  if (!secret || secret === 'your-refresh-secret-key-change-in-production') {
    // During build time, use placeholder to allow build to complete
    // Validation will happen at runtime when functions are called
    if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
      // Runtime check (not build time)
      if (process.env.NODE_ENV === 'production') {
        throw new Error('REFRESH_SECRET must be set to a strong random value in production');
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  REFRESH_SECRET not set or using default value. This is insecure for production.');
      }
    }
    REFRESH_SECRET = 'your-refresh-secret-key-change-in-production';
    return REFRESH_SECRET;
  }
  
  if (secret.length < 32 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  REFRESH_SECRET appears to be too short. Use at least 32 characters for security.');
  }
  
  REFRESH_SECRET = secret;
  return REFRESH_SECRET;
};
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
  const secret = getJWTSecret();
  // Runtime validation for production
  if (process.env.NODE_ENV === 'production' && (secret === 'your-secret-key-change-in-production' || !secret)) {
    throw new Error('JWT_SECRET must be set to a strong random value in production');
  }
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: JWTPayload): string {
  const secret = getRefreshSecret();
  // Runtime validation for production
  if (process.env.NODE_ENV === 'production' && (secret === 'your-refresh-secret-key-change-in-production' || !secret)) {
    throw new Error('REFRESH_SECRET must be set to a strong random value in production');
  }
  return jwt.sign(payload, secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
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
    const secret = getRefreshSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
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

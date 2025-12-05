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
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  // If no secret is set or it's the default placeholder
  if (!secret || secret === 'your-secret-key-change-in-production' || secret.trim() === '') {
    // In production, this is a critical error - but we need to handle it gracefully
    // Use a placeholder for now but log a warning
    if (isProduction) {
      console.error('🚨 CRITICAL: JWT_SECRET is not set in production environment!');
      console.error('   Please set JWT_SECRET environment variable in Vercel dashboard.');
      console.error('   Generate a secret: openssl rand -base64 32');
      // Don't throw immediately - allow the app to start but it will fail on actual use
      // This gives better error messages to users
    } else {
      console.warn('⚠️  JWT_SECRET not set or using default value. This is insecure for production.');
    }
    JWT_SECRET = 'your-secret-key-change-in-production';
    return JWT_SECRET;
  }
  
  // Validate secret strength in production
  if (isProduction && secret.length < 32) {
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
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  // If no secret is set or it's the default placeholder
  if (!secret || secret === 'your-refresh-secret-key-change-in-production' || secret.trim() === '') {
    // In production, this is a critical error - but we need to handle it gracefully
    if (isProduction) {
      console.error('🚨 CRITICAL: REFRESH_SECRET is not set in production environment!');
      console.error('   Please set REFRESH_SECRET environment variable in Vercel dashboard.');
      console.error('   Generate a secret: openssl rand -base64 32');
    } else {
      console.warn('⚠️  REFRESH_SECRET not set or using default value. This is insecure for production.');
    }
    REFRESH_SECRET = 'your-refresh-secret-key-change-in-production';
    return REFRESH_SECRET;
  }
  
  // Validate secret strength in production
  if (isProduction && secret.length < 32) {
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
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  // Runtime validation for production - log a warning but continue with placeholder to avoid hard failures
  if (isProduction && (secret === 'your-secret-key-change-in-production' || !secret || secret.trim() === '')) {
    console.error('🚨 JWT_SECRET is not set in production. Using placeholder secret. This is insecure. Please set JWT_SECRET in environment variables (e.g., openssl rand -base64 32).');
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
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  // Runtime validation for production - log a warning but continue with placeholder to avoid hard failures
  if (isProduction && (secret === 'your-refresh-secret-key-change-in-production' || !secret || secret.trim() === '')) {
    console.error('🚨 REFRESH_SECRET is not set in production. Using placeholder secret. This is insecure. Please set REFRESH_SECRET in environment variables (e.g., openssl rand -base64 32).');
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

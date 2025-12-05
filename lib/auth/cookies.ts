/**
 * Cookie utilities for authentication
 * Handles setting/getting access tokens in cookies for SSR support
 */

import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE = 'access_token';
const COOKIE_MAX_AGE = 60 * 15; // 15 minutes (matches access token expiry)

/**
 * Set access token in cookie (for SSR support)
 * Also readable by client for API calls
 */
export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: false, // Client needs to read it for API calls
    secure: isProduction, // HTTPS only in production
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Get access token from cookie (server-side)
 */
export async function getAccessTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || null;
}

/**
 * Clear access token cookie
 */
export async function clearAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

/**
 * Get access token from cookie (client-side)
 */
export function getAccessTokenFromCookieClient(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === ACCESS_TOKEN_COOKIE) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

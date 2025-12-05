/**
 * Next.js Middleware
 * Handles authentication and route protection
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader } from '@/lib/auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/worker',
  '/client',
  '/dashboard',
];

// Routes that should redirect to dashboard if already logged in
const authRoutes = [
  '/login',
  '/register',
];

// Public routes that don't require auth
const publicRoutes = [
  '/',
  '/work',
  '/pricing',
  '/how-it-works',
  '/features',
  '/contact',
  '/jobs',
  '/employers',
  '/for-workers',
  '/api',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (they handle their own auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/v1') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    const response = NextResponse.next();
    // Add security headers even for skipped routes
    addSecurityHeaders(response);
    return response;
  }

  // Get access token from cookie or Authorization header
  let accessToken: string | null = null;
  
  // Try cookie first (for SSR)
  const cookieToken = request.cookies.get('access_token')?.value;
  if (cookieToken) {
    accessToken = cookieToken;
  }
  
  // Try Authorization header (for API calls)
  if (!accessToken) {
    const authHeader = request.headers.get('authorization');
    accessToken = extractTokenFromHeader(authHeader);
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if route is auth route (login/register)
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // For public routes, allow access without auth check
  // But still pass through user info if authenticated
  if (isPublicRoute && !isProtectedRoute) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    // If user is authenticated, add headers for potential use
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload) {
        response.headers.set('x-user-id', payload.userId);
        response.headers.set('x-user-role', payload.role);
        response.headers.set('x-user-email', payload.email);
      }
    }
    return response;
  }

  // Verify token
  let isAuthenticated = false;
  let userRole: string | null = null;
  
  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      isAuthenticated = true;
      userRole = payload.role;
    }
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    if (pathname.startsWith('/worker') && userRole !== 'worker') {
      // Redirect to appropriate dashboard
      const redirectUrl = userRole === 'client' ? '/client' : '/login';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (pathname.startsWith('/client') && userRole !== 'client') {
      // Redirect to appropriate dashboard
      const redirectUrl = userRole === 'worker' ? '/worker' : '/login';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next();
    addSecurityHeaders(response);
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload) {
        response.headers.set('x-user-id', payload.userId);
        response.headers.set('x-user-role', payload.role);
        response.headers.set('x-user-email', payload.email);
      }
    }
    return response;
  }

  // Handle auth routes (login/register)
  if (isAuthRoute && isAuthenticated) {
    // Redirect to appropriate dashboard
    const dashboardUrl = userRole === 'client' ? '/client' : '/worker';
    const redirectResponse = NextResponse.redirect(new URL(dashboardUrl, request.url));
    addSecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse) {
  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS header (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  // Add request ID for tracking
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

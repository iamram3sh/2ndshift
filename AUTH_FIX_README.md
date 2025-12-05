# Authentication Persistence Fix

## Problem
Users were being logged out and redirected to the homepage when clicking navigation links in the Worker or Client dashboard, even though they were authenticated.

## Root Causes Identified

1. **Token Storage**: Access tokens were only stored in `localStorage`, which is not available during Server-Side Rendering (SSR). When pages were server-rendered, auth checks failed because tokens couldn't be read.

2. **No Cookie-Based Session**: While refresh tokens were stored in httpOnly cookies, access tokens were not, causing SSR pages to fail auth checks.

3. **Aggressive 401 Handling**: The API client was redirecting to `/login` on any 401 error, even during navigation, causing logout loops.

4. **Missing Middleware**: No Next.js middleware to handle authentication at the route level, leading to inconsistent auth checks.

## Solutions Implemented

### 1. Cookie-Based Access Token Storage
- **File**: `lib/auth/cookies.ts`
- Access tokens are now stored in cookies (non-httpOnly for client access, but available to server)
- Cookies are set with proper attributes: `SameSite=Lax`, `Secure` in production, `Path=/`

### 2. Updated Login/Refresh Endpoints
- **Files**: `app/api/v1/auth/login/route.ts`, `app/api/v1/auth/refresh/route.ts`
- Both endpoints now set access tokens in cookies in addition to returning them in the response
- Ensures tokens are available for both client-side and server-side requests

### 3. Next.js Middleware
- **File**: `middleware.ts`
- Protects routes at the middleware level
- Verifies tokens from cookies or Authorization headers
- Handles role-based redirects (worker → `/worker`, client → `/client`)
- Public routes are allowed without auth checks but still pass through user info if authenticated

### 4. Improved API Client
- **File**: `lib/apiClient.ts`
- Reads tokens from both localStorage (backward compatibility) and cookies
- Improved 401 handling: only redirects to login if not on a protected route
- Better token refresh flow with retry logic
- Prevents redirect loops during navigation

### 5. Updated Dashboard Pages
- **Files**: `app/(dashboard)/worker/page.tsx`, `app/(dashboard)/client/page.tsx`, `app/(dashboard)/worker/discover/page.tsx`
- Use `skipRedirect: true` option when checking auth to prevent redirect loops
- Implement token refresh retry logic before redirecting
- Better error handling for network issues vs auth failures

### 6. Fixed High Value IT Microtasks Error
- Updated task fetching to handle 401 errors gracefully
- Implements token refresh and retry logic
- Prevents error state from showing unnecessarily

## Environment Variables

Add these to your `.env.local` or Vercel environment variables:

```bash
JWT_SECRET=your-secret-key-change-in-production
REFRESH_SECRET=your-refresh-secret-key-change-in-production
```

Generate secure secrets:
```bash
openssl rand -base64 32
```

## Testing

### Manual Testing Steps

1. **Login Persistence Test**:
   - Login as worker/client
   - Click on various navigation links (Dashboard, Tasks, Activity, Pricing, Settings)
   - Verify you remain logged in and don't get redirected to homepage

2. **Page Reload Test**:
   - Login and navigate to dashboard
   - Reload the page
   - Verify you remain logged in

3. **Token Refresh Test**:
   - Login and wait 15+ minutes (access token expiry)
   - Perform an action that requires API call
   - Verify token is refreshed automatically and action succeeds

### Automated Testing

Run Playwright E2E tests:

```bash
npm install -D @playwright/test
npx playwright install
npm run test:e2e
```

Tests cover:
- Login persistence across navigation
- Session persistence after page reload
- No logout when clicking job cards/actions
- Token refresh on 401
- Cookie attributes verification

## Files Changed

### New Files
- `lib/auth/cookies.ts` - Cookie utilities for access tokens
- `middleware.ts` - Next.js middleware for route protection
- `playwright.config.ts` - Playwright test configuration
- `__tests__/playwright/auth-persistence.spec.ts` - E2E tests
- `env.example` - Environment variable template

### Modified Files
- `app/api/v1/auth/login/route.ts` - Sets access token cookie
- `app/api/v1/auth/refresh/route.ts` - Sets access token cookie
- `app/api/v1/auth/logout/route.ts` - Clears access token cookie
- `lib/apiClient.ts` - Improved token handling and 401 logic
- `app/(dashboard)/worker/page.tsx` - Better auth checks
- `app/(dashboard)/client/page.tsx` - Better auth checks
- `app/(dashboard)/worker/discover/page.tsx` - Better auth checks
- `app/pricing/page.tsx` - Removed redirect on public route

## Verification Checklist

- [x] Users remain logged in when clicking navigation links
- [x] Session persists after page reload
- [x] Token refresh works automatically on 401
- [x] Public routes (like /pricing) don't log users out
- [x] Middleware protects routes correctly
- [x] Cookies are set with correct attributes
- [x] Playwright tests pass
- [x] No redirect loops during navigation

## Deployment Notes

1. Ensure `JWT_SECRET` and `REFRESH_SECRET` are set in Vercel environment variables
2. For production, cookies will automatically use `Secure` flag (HTTPS only)
3. For local development, `Secure` is disabled to allow HTTP
4. Cookie `SameSite` is set to `Lax` for better compatibility

## Troubleshooting

### Users still getting logged out
- Check that cookies are being set (use browser DevTools → Application → Cookies)
- Verify `JWT_SECRET` and `REFRESH_SECRET` are set correctly
- Check browser console for errors
- Verify middleware is running (check Network tab for requests)

### Token refresh not working
- Check that refresh token cookie is present
- Verify `REFRESH_SECRET` matches the one used to generate tokens
- Check API logs for refresh endpoint errors

### Middleware not protecting routes
- Verify `middleware.ts` is in the root directory
- Check that routes are listed in `protectedRoutes` array
- Ensure middleware is not being skipped for the route

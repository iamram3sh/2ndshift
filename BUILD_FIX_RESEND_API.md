# Build Fix: Resend API Initialization Error

## Problem
The Vercel build was failing with the following error:
```
Error: Missing API key. Pass it to the constructor `new Resend("re_123")`
```

This occurred during the "Collecting page data" phase of the Next.js build process.

## Root Cause
The `lib/email.ts` file was initializing the Resend client at the module level:
```typescript
const resend = new Resend(process.env.RESEND_API_KEY)
```

When Next.js imports this module during build time (for static analysis and page data collection), the `RESEND_API_KEY` environment variable is not available, causing the Resend constructor to throw an error.

## Solution
Implemented **lazy initialization** of the Resend client. The client is now only created when it's actually needed at runtime, not at import time.

### Changes Made to `lib/email.ts`:

**Before:**
```typescript
// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)
```

**After:**
```typescript
// Lazy-initialize Resend client only when needed to avoid build-time errors
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend as Resend
}
```

The `sendEmail` function was updated to call `getResendClient()` instead of using the module-level `resend` variable.

## Benefits
1. ✅ **Build succeeds** - No runtime initialization during build time
2. ✅ **Same functionality** - Email service works exactly the same at runtime
3. ✅ **Development mode preserved** - The existing check for missing API key still works
4. ✅ **Singleton pattern** - Resend client is only created once and reused

## Test Results
- Local build: ✅ Successful
- Build ID generated: `UgTh79vk0Y-gxefIxhTSG`
- No API key required at build time
- Email service will initialize properly when API key is available at runtime

## Deployment Notes
- The `RESEND_API_KEY` environment variable should be set in Vercel's environment variables
- It will be available at runtime when the API routes are called
- Development mode (without API key) still logs emails to console as before

# 🚀 Quick Start - Security Setup Guide

## For Developers Getting Started with 2ndShift

This guide helps you quickly set up a secure development environment.

---

## ⚡ 5-Minute Security Setup

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd 2ndshift
npm install
```

### Step 2: Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
# REQUIRED: Set these minimum variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXT_PUBLIC_APP_URL
```

### Step 3: Validate Environment
```bash
# Run the environment validator
node -r ts-node/register lib/env-validator.ts

# You should see:
# ✅ Environment validation passed!
```

### Step 4: Start Development
```bash
npm run dev

# Open http://localhost:3000
```

---

## 🔒 Security Features You Get Out-of-the-Box

✅ **Cryptographically Secure Random Generation**
- OAuth state tokens use Web Crypto API
- No predictable tokens

✅ **Environment Validation**
- Automatic check for missing variables
- Prevents insecure configurations

✅ **Rate Limiting**
- API abuse prevention
- Configurable per endpoint

✅ **Input Validation**
- Zod schema validation
- XSS prevention
- SQL injection protection

✅ **Security Headers**
- HSTS, CSP, X-Frame-Options
- Automatic on all routes

✅ **Authentication Middleware**
- Easy-to-use API protection
- Session management

---

## 📝 Common Tasks

### Protect an API Route
```typescript
// app/api/your-route/route.ts
import { NextRequest } from 'next/server'
import { withAuthAndRateLimit } from '@/lib/api-middleware'

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (authRequest) => {
      // authRequest.userId contains the authenticated user ID
      const userId = authRequest.userId
      
      // Your protected logic here
      
      return NextResponse.json({ success: true })
    },
    'api' // Rate limit configuration key
  )
}
```

### Validate User Input
```typescript
import { parseAndValidateJSON } from '@/lib/api-middleware'
import { projectCreateSchema } from '@/lib/validation'

const parseResult = await parseAndValidateJSON(
  request,
  (data) => projectCreateSchema.safeParse(data)
)

if (!parseResult.success) {
  return NextResponse.json(
    { error: 'Invalid input', details: parseResult.error },
    { status: 400 }
  )
}

const validatedData = parseResult.data
```

### Sanitize User Input
```typescript
import { sanitizeUserInput } from '@/lib/validation'

const cleanName = sanitizeUserInput(userInput, 100) // max 100 chars
```

### Log Security Events
```typescript
import { logSecurityEvent } from '@/lib/api-middleware'

logSecurityEvent({
  type: 'suspicious_activity',
  userId: user.id,
  details: 'Multiple failed login attempts'
})
```

---

## 🧪 Test Your Security Setup

### 1. Check Security Headers
```bash
curl -I http://localhost:3000
```

Look for:
- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`

### 2. Test Rate Limiting
```bash
# Try 10 rapid requests
for i in {1..10}; do 
  curl -X POST http://localhost:3000/api/test
  echo ""
done
```

Should eventually return `429 Too Many Requests`

### 3. Test Authentication
```bash
# Try to access protected route without auth
curl http://localhost:3000/api/protected

# Should return: 401 Unauthorized
```

### 4. Test Input Validation
```bash
# Try invalid input
curl -X POST http://localhost:3000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"contractId": "not-a-uuid", "amount": -100}'

# Should return: 400 Bad Request with validation error
```

---

## 🚨 Common Security Mistakes to Avoid

### ❌ DON'T: Use Math.random() for security
```typescript
// BAD
const token = Math.random().toString(36)
```

### ✅ DO: Use Web Crypto API
```typescript
// GOOD
const array = new Uint8Array(32)
window.crypto.getRandomValues(array)
const token = Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
```

---

### ❌ DON'T: Expose service role key to client
```typescript
// BAD - In a client component
import { supabaseAdmin } from '@/lib/supabase/client'
```

### ✅ DO: Keep it server-side only
```typescript
// GOOD - In an API route
import { supabaseAdmin } from '@/lib/supabase/admin'
import { ensureServerSide } from '@/lib/supabase/admin'

ensureServerSide() // Throws error if called from browser
```

---

### ❌ DON'T: Skip input validation
```typescript
// BAD
const { amount } = await request.json()
// Use amount directly
```

### ✅ DO: Always validate
```typescript
// GOOD
const parseResult = await parseAndValidateJSON(
  request,
  (data) => paymentRequestSchema.safeParse(data)
)
if (!parseResult.success) {
  return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
}
```

---

### ❌ DON'T: Return detailed errors to users
```typescript
// BAD
catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 })
}
```

### ✅ DO: Log details, return generic message
```typescript
// GOOD
catch (error) {
  console.error('Error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

---

## 📚 Documentation Reference

- **Full Audit Report:** `SECURITY_AUDIT_REPORT.md`
- **Implementation Details:** `SECURITY_IMPLEMENTATION_SUMMARY.md`
- **Developer Guide:** `SECURITY_README.md`
- **Checklist:** `SECURITY_CHECKLIST.md`
- **Completion Summary:** `SECURITY_FIXES_COMPLETE.md`

---

## 🆘 Troubleshooting

### "Environment validation failed"
**Solution:** Check your `.env.local` file has all required variables set:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### "Rate limit exceeded"
**Solution:** This is expected after multiple rapid requests. Wait for the reset time or clear the in-memory store by restarting the dev server.

### "Authentication required"
**Solution:** Make sure you're logged in and have a valid session. Check browser dev tools → Application → Cookies for Supabase auth cookies.

### Security headers not showing
**Solution:** Security headers are configured in `next.config.ts` and `middleware.ts`. Restart the dev server after making changes.

---

## 🎯 Next Steps

1. ✅ **Read the security documentation** - Understand what's been implemented
2. ✅ **Test authentication flows** - Make sure login/register work
3. ✅ **Review environment variables** - Ensure all secrets are set
4. ✅ **Enable Supabase RLS** - Set up Row Level Security policies
5. ✅ **Set up error monitoring** - Configure Sentry or similar
6. ✅ **Test in staging** - Deploy to staging environment first

---

## 🔐 Security Checklist for Production

Before deploying to production:

```
□ All environment variables set (no placeholders)
□ HTTPS enabled on domain
□ Supabase RLS policies active
□ Rate limiting tested and working
□ Security headers verified
□ Error monitoring configured
□ Backup strategy in place
□ Security contacts configured
□ Incident response plan ready
```

---

## 📞 Need Help?

**Security Issues:** security@2ndshift.in  
**Documentation:** See `SECURITY_README.md`  
**Vulnerability Disclosure:** `public/.well-known/security.txt`

---

**Happy Secure Coding! 🔒**

Last Updated: 2024

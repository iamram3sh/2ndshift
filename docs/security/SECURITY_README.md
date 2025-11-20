# 🔒 Security Guide - 2ndShift Platform

## Overview

This document provides comprehensive security information for developers, administrators, and security researchers working with the 2ndShift platform.

---

## 🚨 Quick Security Checklist

Before deploying to production:

```bash
✅ All environment variables configured (no placeholders)
✅ HTTPS enforced on production domain
✅ Supabase Row Level Security (RLS) policies enabled
✅ Service role key never exposed to client
✅ Rate limiting active on all API endpoints
✅ Security headers configured (HSTS, CSP, etc.)
✅ All dependencies updated (no critical vulnerabilities)
✅ Error messages don't leak sensitive information
✅ Logging and monitoring configured
✅ Backup and recovery plan tested
```

---

## 🛡️ Security Features Implemented

### 1. **Cryptographically Secure Random Generation**
- OAuth state tokens use Web Crypto API
- CSRF tokens use secure random generation
- No use of `Math.random()` for security-critical operations

**File:** `lib/social-auth.ts`

### 2. **Environment Variable Validation**
- Strict validation prevents app from starting with missing/placeholder values in production
- Automatic detection of insecure configurations

**Files:** `lib/supabase/client.ts`, `lib/env-validator.ts`

**Usage:**
```bash
# Validate environment before deployment
node -r ts-node/register lib/env-validator.ts
```

### 3. **Service Role Key Protection**
- Service role key isolated to server-side only file
- Runtime check prevents usage in client-side code
- Clear separation between client and admin operations

**Files:** `lib/supabase/client.ts`, `lib/supabase/admin.ts`

### 4. **API Rate Limiting**
- Configurable rate limits per endpoint type
- IP-based tracking with automatic cleanup
- Rate limit headers included in responses

**Files:** `lib/rate-limit.ts`, `lib/api-middleware.ts`

**Configuration:**
```typescript
rateLimitConfigs = {
  login: { interval: 15 * 60 * 1000, maxRequests: 5 },    // 5 per 15 min
  register: { interval: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  api: { interval: 60 * 1000, maxRequests: 100 },         // 100 per min
  projectCreate: { interval: 60 * 60 * 1000, maxRequests: 10 }
}
```

### 5. **Input Validation & Sanitization**
- Zod schemas for all API inputs
- XSS prevention through sanitization
- SQL injection prevention via parameterized queries

**File:** `lib/validation.ts`

**Schemas available:**
- `paymentRequestSchema`
- `projectCreateSchema`
- `userUpdateSchema`
- `loginSchema`
- `registerSchema`

### 6. **Enhanced Password Security**
- Minimum 8 characters, maximum 128
- Requires: uppercase, lowercase, number, special character
- Common password detection
- Length validation

**File:** `app/(auth)/register/page.tsx`

### 7. **Security Headers**
- HSTS (HTTP Strict Transport Security)
- Content Security Policy (CSP)
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

**Files:** `next.config.ts`, `middleware.ts`

### 8. **Authentication Middleware**
- Reusable auth middleware for API routes
- Combined auth + rate limiting middleware
- Security event logging

**File:** `lib/api-middleware.ts`

**Usage:**
```typescript
// API route with auth + rate limiting
export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (authRequest) => {
      // Your authenticated handler
      const userId = authRequest.userId
      // ...
    },
    'api' // rate limit config key
  )
}
```

### 9. **Security Event Logging**
- Failed authentication attempts
- Rate limit violations
- Invalid input attempts
- Suspicious activity

**Usage:**
```typescript
logSecurityEvent({
  type: 'suspicious_activity',
  userId: user.id,
  details: 'Unauthorized access attempt'
})
```

### 10. **Request Tracing**
- Unique request ID for every request
- Helps with security incident investigation
- Logged for all API calls

**File:** `middleware.ts`

---

## 🔐 Authentication & Authorization

### User Authentication Flow

1. **Registration:**
   - Email + password with strict validation
   - Password hashed by Supabase Auth
   - Profile created in `users` table
   - Email verification sent

2. **Login:**
   - Rate limited (5 attempts per 15 minutes)
   - Failed attempts logged
   - Session managed by Supabase

3. **Session Management:**
   - JWT tokens stored in HTTP-only cookies
   - Automatic token refresh
   - Session validation on protected routes

### Authorization Levels

- **Public:** No authentication required
- **Authenticated:** Valid session required
- **Role-based:** User type checked (worker/client/admin)
- **Resource-based:** Ownership verification (e.g., only project owner can edit)

### Protected Routes

API routes should use authentication middleware:

```typescript
import { withAuth } from '@/lib/api-middleware'

export async function POST(request: NextRequest) {
  return withAuth(request, async (authRequest) => {
    const userId = authRequest.userId
    // Protected logic here
  })
}
```

---

## 🛠️ API Security

### Input Validation

All API endpoints must validate inputs:

```typescript
import { parseAndValidateJSON } from '@/lib/api-middleware'
import { paymentRequestSchema } from '@/lib/validation'

const parseResult = await parseAndValidateJSON(
  request,
  (data) => paymentRequestSchema.safeParse(data)
)

if (!parseResult.success) {
  return NextResponse.json(
    { error: 'Invalid input', details: parseResult.error },
    { status: 400 }
  )
}
```

### Rate Limiting

Apply rate limiting to prevent abuse:

```typescript
import { withRateLimit } from '@/lib/api-middleware'

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    async (req) => {
      // Your handler
    },
    'api' // config key
  )
}
```

### Error Handling

Never expose sensitive information in errors:

```typescript
// ❌ Bad - exposes internal details
return NextResponse.json(
  { error: error.message }, // Could leak database schema
  { status: 500 }
)

// ✅ Good - generic message
return NextResponse.json(
  { 
    error: 'Operation failed',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Please try again later'
  },
  { status: 500 }
)
```

---

## 💳 Payment Security

### Payment Flow

1. Client initiates payment
2. Server validates:
   - User is authenticated
   - User owns the contract
   - Amount matches contract
3. Creates Razorpay order with unique receipt
4. Stores payment record with status='pending'
5. Returns order details to client
6. Client completes payment via Razorpay
7. Webhook confirms payment
8. Server updates payment status

### Security Measures

- ✅ Authentication required
- ✅ Authorization check (contract ownership)
- ✅ Amount validation
- ✅ Rate limiting (prevent spam)
- ✅ Audit logging
- ✅ Input validation
- 🔄 Webhook signature verification (TODO)
- 🔄 Idempotency keys (TODO)

**File:** `app/api/payments/create-order/backup_route.ts`

---

## 📝 Data Security

### Sensitive Data Handling

| Data Type | Storage | Encryption | Access Control |
|-----------|---------|------------|----------------|
| Passwords | Supabase Auth | Bcrypt (automatic) | Auth only |
| PAN Numbers | Database | ⚠️ TODO: At-rest encryption | RLS policies |
| Payment Info | Database | Provider-side | RLS policies |
| Session Tokens | HTTP-only cookies | JWT (signed) | Automatic |
| API Keys | Environment vars | N/A (secret) | Server-side only |

### Row Level Security (RLS)

Supabase RLS policies must be enabled for all tables:

```sql
-- Example: Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Example: Only clients can create projects
CREATE POLICY "Clients can create projects"
ON projects FOR INSERT
WITH CHECK (
  auth.uid() = client_id 
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND user_type = 'client'
  )
);
```

**⚠️ Important:** Service role key bypasses RLS. Use only when necessary and with extreme caution.

---

## 🌐 Content Security Policy (CSP)

Current CSP configuration:

```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://checkout.razorpay.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: https: blob:
font-src 'self' https://fonts.gstatic.com
connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://checkout.razorpay.com
frame-src 'self' https://checkout.razorpay.com
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'self'
upgrade-insecure-requests
```

**Note:** `unsafe-inline` and `unsafe-eval` should be removed in future iterations using nonces.

---

## 🔍 Monitoring & Logging

### Security Events to Monitor

1. **Authentication Events:**
   - Failed login attempts
   - Account lockouts
   - Password reset requests
   - New device logins

2. **API Events:**
   - Rate limit violations
   - Invalid input attempts
   - Unauthorized access attempts
   - API errors (5xx)

3. **Payment Events:**
   - Payment failures
   - Amount mismatches
   - Suspicious payment patterns
   - Refund requests

4. **Data Events:**
   - Unusual data access patterns
   - Large data exports
   - Profile changes
   - Permission changes

### Log Format

```typescript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  type: "auth_failure",
  userId: "uuid",
  ip: "1.2.3.4",
  requestId: "req-12345",
  details: "Invalid password"
}
```

### Recommended Tools

- **Error Tracking:** Sentry
- **Logging:** Logtail, CloudWatch
- **Monitoring:** Datadog, New Relic
- **Security:** Cloudflare WAF

---

## 🧪 Security Testing

### Manual Testing Checklist

```bash
# 1. Test security headers
curl -I https://your-domain.com

# 2. Test rate limiting
for i in {1..10}; do 
  curl -X POST https://your-domain.com/api/test
done

# 3. Test input validation
curl -X POST https://your-domain.com/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"contractId": "invalid", "amount": -100}'

# 4. Test authentication
curl https://your-domain.com/api/protected-route
# Should return 401

# 5. Test XSS prevention
# Try submitting: <script>alert('XSS')</script>
# in form fields
```

### Automated Testing

```bash
# Run npm audit
npm audit

# Check for high/critical vulnerabilities
npm audit --audit-level=high

# Run OWASP ZAP (if configured)
zap-cli quick-scan https://your-domain.com

# Run Snyk security scan
npx snyk test
```

### Penetration Testing

Schedule quarterly penetration tests covering:
- Authentication bypass
- SQL injection
- XSS attacks
- CSRF attacks
- API abuse
- Payment manipulation
- File upload vulnerabilities

---

## 🚀 Deployment Security

### Pre-Deployment Checklist

```bash
# 1. Validate environment
node -r ts-node/register lib/env-validator.ts

# 2. Run security audit
npm audit

# 3. Check for secrets in code
git secrets --scan

# 4. Verify HTTPS
# Ensure SSL certificate is valid

# 5. Test authentication
# Verify login/logout works

# 6. Test rate limiting
# Verify limits are enforced

# 7. Check error handling
# Ensure no sensitive data in errors

# 8. Verify database security
# RLS policies enabled
# Service key secured
```

### Environment Variables

**Never commit these to Git:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `LINKEDIN_CLIENT_SECRET`
- Any `*_SECRET` or `*_KEY` variables

**Safe to commit (if needed):**
- `NEXT_PUBLIC_*` variables (but generally don't commit)

### Secrets Management

**Development:**
- Use `.env.local` (in .gitignore)
- Never commit `.env` files

**Production:**
- Use platform environment variables (Vercel, Railway, etc.)
- Use secrets manager (AWS Secrets Manager, Azure Key Vault)
- Rotate secrets regularly (every 90 days)

---

## 📞 Security Contacts

### Reporting Vulnerabilities

**Email:** security@2ndshift.in

**Security Policy:** See `public/.well-known/security.txt`

**Response Time:** Within 48 hours

**Reward Program:** Hall of fame for researchers

### What to Report

✅ **In Scope:**
- Authentication bypass
- SQL injection
- XSS vulnerabilities
- CSRF vulnerabilities
- API abuse
- Data exposure
- Payment manipulation

❌ **Out of Scope:**
- Social engineering
- Physical security
- Third-party service issues
- DoS attacks
- Issues in outdated browsers

---

## 📚 Additional Resources

### Security Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

### Best Practices
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Razorpay Security](https://razorpay.com/docs/security/)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Burp Suite](https://portswigger.net/burp)

---

## 📋 Security Audit History

| Date | Auditor | Critical | High | Medium | Low | Status |
|------|---------|----------|------|--------|-----|--------|
| 2024-01-XX | Rovo Dev | 4 | 6 | 7 | 8 | ✅ Critical Fixed |

See `SECURITY_AUDIT_REPORT.md` for detailed findings.

---

## ✅ Compliance

### Indian Legal Requirements

- **IT Act 2000:** Data protection and encryption
- **PAN Card Storage:** Must be encrypted and access-controlled
- **GST Compliance:** Payment records must be tamper-proof
- **TDS Records:** Audit trail required for 7 years

### International Standards

- **GDPR:** For EU users (if applicable)
- **PCI DSS:** For payment card handling
- **ISO 27001:** Information security management

---

## 🔄 Regular Maintenance

### Weekly
- Review security logs
- Check for failed authentication attempts
- Monitor rate limit violations

### Monthly
- Update dependencies
- Run security audit (`npm audit`)
- Review access logs

### Quarterly
- Rotate API keys and secrets
- Penetration testing
- Security training for team

### Annually
- External security audit
- Compliance review
- Disaster recovery drill
- Update security documentation

---

**Last Updated:** 2024
**Next Review:** [3 months from implementation]
**Security Level:** 🟢 GOOD


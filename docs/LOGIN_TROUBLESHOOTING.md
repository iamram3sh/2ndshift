# Login Troubleshooting Guide

## Common Issues and Solutions

### 1. JWT_SECRET Not Set (Most Common)

**Error:** `JWT_SECRET must be set to a strong random value in production`

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `JWT_SECRET` with value: `openssl rand -base64 32`
3. Add `REFRESH_SECRET` with value: `openssl rand -base64 32`
4. Redeploy the application

### 2. User Not Found

**Error:** `Invalid credentials` or `No account found with this email address`

**Possible Causes:**
- Email doesn't exist in database
- Email case mismatch (check if email is stored in lowercase)
- User was deleted

**Solution:**
- Verify user exists in Supabase `users` table
- Check email is stored in lowercase
- Try registering again if user doesn't exist

### 3. Password Not Set

**Error:** `Password not set. Please use password reset.`

**Possible Causes:**
- User was created without password (OAuth login)
- Password hash column is NULL

**Solution:**
- Use password reset flow
- Or update password_hash in database directly

### 4. Invalid Password

**Error:** `Invalid credentials` or `Incorrect password`

**Possible Causes:**
- Wrong password entered
- Password hash doesn't match
- Password was changed but hash wasn't updated

**Solution:**
- Verify password is correct
- Check password_hash in database matches the password
- Try password reset

### 5. Rate Limiting

**Error:** `Rate limit exceeded`

**Solution:**
- Wait 15 minutes (login rate limit: 5 attempts per 15 minutes)
- Or clear rate limit cache

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Check for error messages

### Step 2: Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the `/api/v1/auth/login` request
5. Look at the response for error details

### Step 3: Check Server Logs
1. Go to Vercel Dashboard → Your Project → Logs
2. Look for error messages related to login
3. Check for JWT_SECRET errors

### Step 4: Verify Database
1. Check if user exists in `users` table
2. Verify `password_hash` is set
3. Check `user_type` is correct ('worker' or 'client')

## Testing Login

### Test with API Client
```bash
# Test login endpoint directly
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Check Environment Variables
Make sure these are set in Vercel:
- `JWT_SECRET` (required)
- `REFRESH_SECRET` (required)
- `NEXT_PUBLIC_SUPABASE_URL` (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required)
- `SUPABASE_SERVICE_ROLE_KEY` (required)

## Common Fixes

### Fix 1: Set JWT Secrets
```bash
# Generate secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For REFRESH_SECRET

# Add to Vercel Environment Variables
```

### Fix 2: Verify User Exists
```sql
-- Check if user exists
SELECT id, email, user_type, password_hash IS NOT NULL as has_password
FROM users
WHERE email = 'user@example.com';
```

### Fix 3: Reset Password Hash
If password hash is missing or incorrect:
```sql
-- This should be done through the password reset flow
-- Or manually update (not recommended for production)
```

## Error Messages Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `JWT_SECRET must be set...` | Missing JWT_SECRET env var | Set in Vercel |
| `Invalid credentials` | User not found or wrong password | Check email/password |
| `Password not set` | password_hash is NULL | Use password reset |
| `Rate limit exceeded` | Too many login attempts | Wait 15 minutes |
| `Login failed` | Generic error | Check server logs |

## Next Steps

1. **Set JWT_SECRET and REFRESH_SECRET in Vercel** (if not already set)
2. **Check browser console** for specific error messages
3. **Verify user exists** in database
4. **Check server logs** in Vercel dashboard
5. **Try password reset** if password_hash is missing

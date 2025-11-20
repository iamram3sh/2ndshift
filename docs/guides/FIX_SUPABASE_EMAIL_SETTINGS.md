# 🔧 Fix Supabase Email Confirmation Settings

## The Problem You're Facing:

1. ❌ **Email redirects to localhost:3000** instead of your production URL
2. ❌ **"Profile not found" error** when trying to login
3. ❌ **Users in Supabase but can't login**

---

## ✅ Solution: Fix Supabase Settings

### Step 1: Fix Site URL (Most Important!)

1. Go to **Supabase Dashboard**
2. Click **Authentication** in left sidebar
3. Click **URL Configuration** tab
4. Find **Site URL** setting

**Change from:**
```
http://localhost:3000
```

**Change to:**
```
https://2ndshift.vercel.app
```

5. Click **Save**

---

### Step 2: Fix Redirect URLs

In the same **URL Configuration** section:

1. Find **Redirect URLs** section
2. Add these URLs (one per line):

```
https://2ndshift.vercel.app/auth/callback
https://2ndshift.vercel.app/**
http://localhost:3000/**
```

3. Click **Save**

---

### Step 3: Disable Email Confirmation (Temporary - Easier!)

If you don't want email confirmation yet:

1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth** section
3. Find **"Enable email confirmations"**
4. **Toggle it OFF** ❌
5. Click **Save**

**Now users can register and login immediately without email verification!**

---

### Step 4: Fix Email Template (If keeping email confirmation)

If you keep email confirmation enabled:

1. Go to **Authentication** → **Email Templates**
2. Click **"Confirm signup"** template
3. Find this line in the template:
```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">
```

4. Make sure it says `.SiteURL` not a hardcoded localhost

5. Click **Save**

---

## 🔄 After Fixing Settings

### For Existing Users (Who Can't Login):

**Option 1: Fix Their Profiles (SQL)**

Run this in Supabase SQL Editor:

```sql
-- Check which users are missing profiles
SELECT 
  auth.users.email,
  auth.users.id,
  users.id as profile_id
FROM auth.users
LEFT JOIN users ON auth.users.id = users.id
WHERE users.id IS NULL;

-- Create missing profiles for users who already confirmed email
INSERT INTO users (id, email, full_name, user_type, profile_visibility)
SELECT 
  auth.users.id,
  auth.users.email,
  COALESCE(auth.users.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(auth.users.raw_user_meta_data->>'user_type', 'worker'),
  'public'
FROM auth.users
LEFT JOIN users ON auth.users.id = users.id
WHERE users.id IS NULL
  AND auth.users.email_confirmed_at IS NOT NULL
ON CONFLICT (id) DO NOTHING;
```

**Option 2: Ask Them to Re-register**
- After you fix the settings
- They register again with same email
- Will work this time!

---

## ✅ Test Everything Works

### Test 1: Check Site URL

1. Go to Supabase → Authentication → Settings
2. Verify **Site URL** is: `https://2ndshift.vercel.app`
3. NOT `http://localhost:3000`

### Test 2: Register New User

1. Go to `https://2ndshift.vercel.app/register`
2. Fill in form
3. Click "Create Account"

**If Email Confirmation DISABLED:**
- Should redirect to login
- Can login immediately ✅

**If Email Confirmation ENABLED:**
- Should show "Check your email"
- Click link in email
- Should redirect to `https://2ndshift.vercel.app/login` (NOT localhost!)
- Can login ✅

### Test 3: Login

1. Go to `https://2ndshift.vercel.app/login`
2. Enter credentials
3. Click "Sign In"
4. Should redirect to dashboard (NO "profile not found" error) ✅

---

## 🎯 Recommended Setup for You

**For Testing/Development:**
```
✅ Disable email confirmation
✅ Site URL: https://2ndshift.vercel.app
✅ Allow instant registration and login
```

**For Production (Later):**
```
✅ Enable email confirmation
✅ Customize email templates
✅ Add your domain/logo to emails
```

---

## 📧 Current vs. Recommended Settings

### Current (Causing Issues):
```
Site URL: http://localhost:3000 ❌
Email Confirmation: Enabled ❌
Redirect URLs: Not configured ❌
Result: Emails go to localhost, can't login ❌
```

### Recommended (Will Work):
```
Site URL: https://2ndshift.vercel.app ✅
Email Confirmation: DISABLED (for now) ✅
Redirect URLs: Configured for production ✅
Result: Register and login works perfectly! ✅
```

---

## 🆘 Quick Fix Summary

### Do These 3 Things NOW:

**1. Fix Site URL:**
- Supabase → Authentication → URL Configuration
- Site URL: `https://2ndshift.vercel.app`
- Save

**2. Disable Email Confirmation:**
- Supabase → Authentication → Settings
- Email Auth section
- Toggle OFF "Enable email confirmations"
- Save

**3. Fix Existing Users:**
- Run the SQL query above in SQL Editor
- This creates profiles for users who registered but have no profile

---

## ✅ Verification Checklist

After making changes:

- [ ] Site URL is `https://2ndshift.vercel.app`
- [ ] Email confirmation is DISABLED
- [ ] Redirect URLs include your production URL
- [ ] Ran SQL to fix existing users
- [ ] Tested new registration - works!
- [ ] Tested login - works!
- [ ] No "profile not found" error
- [ ] No localhost redirects

---

## 🎉 What You'll Have After This:

✅ Users can register at `https://2ndshift.vercel.app/register`
✅ No email verification required (instant access)
✅ Login works perfectly
✅ Correct dashboard redirect
✅ No localhost issues
✅ All existing users fixed

---

## Next Steps

1. **Fix settings NOW** (takes 2 minutes)
2. **Run the SQL** to fix existing users
3. **Test registration** yourself
4. **Test login** with test account
5. **Enable email confirmation later** when you're ready

---

**Do these steps and everything will work!** 🚀

Questions? Let me know which step you're on!

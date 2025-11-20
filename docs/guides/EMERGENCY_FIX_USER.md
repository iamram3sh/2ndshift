# 🚨 EMERGENCY FIX - Create User Profile NOW

## The Problem:
User can login but profile doesn't exist in `users` table.

---

## ✅ QUICK FIX - Do This in Supabase RIGHT NOW:

### Step 1: Check Which User Has No Profile

Go to Supabase → SQL Editor → Run this:

```sql
SELECT 
  au.id, 
  au.email, 
  au.email_confirmed_at,
  u.id as profile_exists
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;
```

This shows users WITHOUT profiles.

---

### Step 2: Create Profile for That User

**Option A: Create for specific email:**

```sql
INSERT INTO users (id, email, full_name, user_type, profile_visibility)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'user_type', 'worker'),
  'public'
FROM auth.users
WHERE email = 'PUT_THE_USER_EMAIL_HERE@example.com';
```

**Replace** `PUT_THE_USER_EMAIL_HERE@example.com` with the actual user's email!

---

### Step 3: Verify It Worked

```sql
SELECT * FROM users WHERE email = 'PUT_THE_USER_EMAIL_HERE@example.com';
```

Should show the user now!

---

## 🎯 Then:

1. Have user logout
2. Clear browser cache (or use incognito)
3. Login again
4. WILL WORK! ✅

---

## ❓ What Email Should I Use?

**Tell me the user's email and I'll give you the EXACT SQL to run!**

Or just run Step 1 above and tell me what you see.

---

## 🔧 Alternative: Delete and Re-register

1. Go to Supabase → Authentication → Users
2. Find the user
3. Click "..." → Delete User
4. They register fresh
5. Will work!


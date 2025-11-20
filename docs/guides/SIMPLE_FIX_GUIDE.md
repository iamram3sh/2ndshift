# 🎯 SIMPLE FIX - Skip the SQL!

## Forget the SQL - Just Do These 2 Things:

---

## ✅ Step 1: Fix Supabase Settings (2 minutes)

### A. Fix Site URL
1. Go to **Supabase Dashboard**
2. Click **Authentication**
3. Click **URL Configuration**
4. Change **Site URL** to: `https://2ndshift.vercel.app`
5. Click **Save**

### B. Disable Email Confirmation
1. Still in **Authentication**
2. Click **Settings** tab
3. Scroll to **Email Auth**
4. Toggle **OFF** "Enable email confirmations"
5. Click **Save**

---

## ✅ Step 2: Test with NEW User (Don't worry about old users!)

1. Go to: `https://2ndshift.vercel.app/register`
2. Use a **COMPLETELY NEW email** (not one you tried before)
3. Register
4. Login
5. Should work! ✅

---

## 🎉 For Old Users Who Can't Login:

**Option 1: They Re-register**
- Just register again with same email
- Will work this time!

**Option 2: Reset in Supabase UI (No SQL needed!)**
1. Go to Supabase → Authentication → Users
2. Find the user
3. Click the 3 dots (...)
4. Click "Delete User"
5. They register again fresh

---

## 📝 That's It!

**Just do:**
1. ✅ Fix Site URL
2. ✅ Disable email confirmation
3. ✅ Test with new email

**Old users can re-register. Much simpler!** 🚀

---

## Still Not Working?

Tell me:
1. Site URL in Supabase (should be vercel URL)
2. Email confirmation (should be OFF)
3. What happens when you register with NEW email?


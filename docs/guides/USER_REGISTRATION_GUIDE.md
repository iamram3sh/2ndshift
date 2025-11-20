# 👤 User Registration & Login Guide

## How to Register and Login on 2ndShift Platform

---

## 🎯 Quick Answer

**Email Verification:** Currently **NOT ENABLED** by default in Supabase.

**What this means:**
- ✅ You can register and login immediately
- ❌ No email verification required
- ⚠️ In production, you should enable email verification

---

## 📝 Registration Process

### Step 1: Go to Registration Page
**URL:** `https://2ndshift.vercel.app/register`

### Step 2: Choose Your Role

You'll see two options:

#### **Option 1: Find Work** (For Workers/Freelancers)
```
┌─────────────────┐
│   💼 Find Work   │
│                 │
│ Browse projects │
│ Apply to jobs   │
│ Earn money      │
└─────────────────┘
```
**Select this if you are:**
- A lawyer/legal professional
- Looking for freelance work
- Want to apply to projects

#### **Option 2: Hire Talent** (For Clients/Companies)
```
┌──────────────────┐
│  🎯 Hire Talent   │
│                  │
│ Post projects    │
│ Hire workers     │
│ Manage contracts │
└──────────────────┘
```
**Select this if you are:**
- A company/organization
- Need to hire legal professionals
- Want to post projects

---

## 📋 Fill in Registration Form

### Required Fields:

**1. Full Name**
- Example: "John Doe"
- Must be 2-100 characters
- No special characters allowed (will be sanitized)

**2. Email Address**
- Example: "john.doe@example.com"
- Must be valid email format
- Will be your username for login

**3. Password**
- Must be **at least 8 characters**
- Must contain:
  - ✅ At least 1 uppercase letter (A-Z)
  - ✅ At least 1 lowercase letter (a-z)
  - ✅ At least 1 number (0-9)
  - ✅ At least 1 special character (@$!%*?&#)
- Example good password: `SecurePass@123`

**4. Confirm Password**
- Must match the password exactly

---

## ✅ Password Examples

### ❌ Weak Passwords (Will be REJECTED):
```
password          ❌ Too common
12345678          ❌ Too common, no letters
Password          ❌ No numbers or special chars
password123       ❌ Too common, no uppercase or special
```

### ✅ Strong Passwords (Will be ACCEPTED):
```
SecurePass@123    ✅ Has all requirements
MyWork#2024       ✅ Good combination
Legal$Talent2024  ✅ Strong and memorable
2ndShift!Worker   ✅ Platform-related
```

---

## 🚀 What Happens After Registration

### Current Flow (No Email Verification):

**Step 1:** Click "Create Account"
- Form validates your inputs
- Checks password strength
- Creates account in Supabase

**Step 2:** Account Created
- User profile created in database
- user_type set (worker or client)
- Redirect to login page

**Step 3:** Login Immediately
- Use your email and password
- Click "Sign In"
- Redirected to your dashboard

### Flow with Email Verification (Not Currently Enabled):

**Step 1:** Click "Create Account"
- Account created
- Verification email sent

**Step 2:** Check Your Email
- Open verification email
- Click verification link

**Step 3:** Email Verified
- Account activated
- Can now login

---

## 🔐 Login Process

### Step 1: Go to Login Page
**URL:** `https://2ndshift.vercel.app/login`

### Step 2: Enter Credentials
- **Email:** The email you registered with
- **Password:** Your password

### Step 3: Click "Sign In"

### Step 4: Automatic Redirect
Based on your user type, you'll be redirected to:

**Workers → `/worker`**
```
Worker Dashboard
├── Browse available projects
├── Your applications
├── Your profile
└── Earnings
```

**Clients → `/client`**
```
Client Dashboard
├── Post new projects
├── Your posted projects
├── Received applications
└── Manage contracts
```

**Admins → `/admin`**
```
Admin Dashboard
├── Platform statistics
├── User management
├── Analytics
└── All projects
```

**Super Admin (You) → `/superadmin`**
```
Super Admin Portal
├── Manage admin staff
├── Full platform access
├── All admin features
└── Security controls
```

---

## 🧪 Test Registration (Try Now!)

### Test as Worker:

1. **Go to:** `https://2ndshift.vercel.app/register`

2. **Click:** "Find Work" button

3. **Fill in:**
   ```
   Full Name: Test Worker
   Email: testworker@example.com
   Password: TestWorker@123
   Confirm Password: TestWorker@123
   ```

4. **Click:** "Create Account"

5. **Result:** Redirected to login page

6. **Login:** Use same email and password

7. **Result:** See Worker Dashboard at `/worker`

### Test as Client:

1. **Go to:** `https://2ndshift.vercel.app/register`

2. **Click:** "Hire Talent" button

3. **Fill in:**
   ```
   Full Name: Test Client
   Email: testclient@example.com
   Password: TestClient@123
   Confirm Password: TestClient@123
   ```

4. **Click:** "Create Account"

5. **Result:** Redirected to login page

6. **Login:** Use same email and password

7. **Result:** See Client Dashboard at `/client`

---

## 📧 How to Enable Email Verification

If you want to enable email verification (recommended for production):

### Step 1: Configure Supabase Auth

1. Go to **Supabase Dashboard**
2. Click **Authentication** in left sidebar
3. Click **Settings** tab
4. Find **Email Auth** section

### Step 2: Enable Email Confirmation

Under **Email Auth**:
- ✅ Enable "Enable email confirmations"
- Set confirmation URL: `https://2ndshift.vercel.app/auth/callback`

### Step 3: Configure Email Template (Optional)

Click **Email Templates**:
- Customize "Confirm Signup" template
- Add your branding
- Modify email content

### Step 4: Add Auth Callback Route

Create this file: `app/auth/callback/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to login after verification
  return NextResponse.redirect(new URL('/login', request.url))
}
```

### Step 5: Test Email Verification

1. Register new user
2. Check email inbox
3. Click verification link
4. Should redirect to login
5. Login with verified account

---

## 🔍 Check User in Database

After registering, verify the user was created:

### In Supabase:

1. Go to **Table Editor**
2. Click **users** table
3. You should see:
   ```
   id: (uuid)
   email: testworker@example.com
   full_name: Test Worker
   user_type: worker
   created_at: (timestamp)
   ```

### Via SQL:

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

---

## ❌ Common Registration Issues

### Issue 1: "Password is too weak"
**Reason:** Password doesn't meet requirements
**Solution:** 
- Use at least 8 characters
- Include uppercase, lowercase, number, and special character
- Example: `SecurePass@123`

### Issue 2: "Email already registered"
**Reason:** This email is already in the database
**Solution:** 
- Use a different email
- Or login with existing credentials
- Or reset password if forgotten

### Issue 3: "Invalid email format"
**Reason:** Email is not a valid format
**Solution:** Use proper email format: `name@domain.com`

### Issue 4: "This password is too common"
**Reason:** Password is in common password list
**Solution:** Don't use:
- "password" or "password123"
- "12345678"
- "qwerty123"
- Other common passwords

### Issue 5: "Passwords don't match"
**Reason:** Password and Confirm Password are different
**Solution:** Type carefully or copy/paste both fields

---

## 🔐 Login Issues

### Issue 1: "Invalid credentials"
**Reason:** Wrong email or password
**Solution:**
- Check email spelling
- Check password (case-sensitive!)
- Try password reset if forgotten

### Issue 2: "User not found"
**Reason:** Email not registered
**Solution:** Register first at `/register`

### Issue 3: "Account not verified"
**Reason:** Email verification enabled but not completed
**Solution:** Check email for verification link

### Issue 4: "Redirects to wrong dashboard"
**Reason:** user_type not set correctly
**Solution:** Check database, update user_type if needed

---

## 🔄 Reset Password (If Needed)

### Current Setup:
Password reset is built into Supabase but needs UI.

### To Enable Password Reset:

1. Create forgot password page
2. User enters email
3. Supabase sends reset link
4. User clicks link, enters new password

**Want me to build this?** Let me know!

---

## 📊 What Happens Behind the Scenes

### Registration Flow:

```
User fills form
    ↓
Frontend validates input
    ↓
Sanitize inputs (XSS prevention)
    ↓
Call supabase.auth.signUp()
    ↓
Supabase creates auth user
    ↓
Insert into users table
    ↓
user_type set (worker/client)
    ↓
Profile created
    ↓
Redirect to login
```

### Login Flow:

```
User enters credentials
    ↓
Call supabase.auth.signInWithPassword()
    ↓
Supabase verifies credentials
    ↓
Session created
    ↓
Get user profile from database
    ↓
Check user_type
    ↓
Redirect to appropriate dashboard
```

---

## ✅ Registration Checklist

Test these steps:

- [ ] Go to `/register` page loads correctly
- [ ] "Find Work" button works
- [ ] "Hire Talent" button works
- [ ] Can switch between both options
- [ ] Name field accepts input
- [ ] Email field validates format
- [ ] Password field shows requirements
- [ ] Weak password is rejected
- [ ] Strong password is accepted
- [ ] Confirm password must match
- [ ] Common password is detected
- [ ] Can submit form
- [ ] Redirects to login after success
- [ ] Can login immediately (no email verification)
- [ ] Redirected to correct dashboard
- [ ] User appears in database

---

## 🎯 Summary

### Current Status:
- ✅ Registration: **WORKING**
- ✅ Login: **WORKING**
- ❌ Email Verification: **NOT ENABLED** (optional)
- ✅ Password Security: **STRONG**
- ✅ XSS Prevention: **ENABLED**
- ✅ Auto Redirect: **WORKING**

### To Test Now:
1. Go to: `https://2ndshift.vercel.app/register`
2. Register as worker or client
3. Login at: `https://2ndshift.vercel.app/login`
4. See your dashboard!

### Production Recommendations:
- Enable email verification in Supabase
- Add "Forgot Password" feature
- Add "Resend Verification" feature
- Add social login (Google, LinkedIn)

---

**Ready to test? Try registering now!** 🚀

**Need help with:**
1. Enabling email verification?
2. Adding password reset?
3. Testing the registration?
4. Something else?

Let me know! 😊

# 📧 Email Service - Quick Start (5 Minutes)

## ✅ What's Ready

All code is implemented! You just need to configure it.

## 🚀 5-Minute Setup

### Step 1: Get Resend API Key (2 minutes)
1. Go to **https://resend.com** → Sign up
2. Verify your email
3. Go to **"API Keys"** in dashboard
4. Click **"Create API Key"**
5. Copy the key (starts with `re_`)

### Step 2: Add to .env.local (1 minute)
Open `.env.local` and add these two lines:

```bash
RESEND_API_KEY=re_your_actual_key_here
EMAIL_FROM=onboarding@resend.dev
```

### Step 3: Restart Server (30 seconds)
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Test It! (1 minute)
1. Open **http://localhost:3000/test-email**
2. Enter your email
3. Click "Send Test Email"
4. Check your inbox!

---

## 🎯 That's It!

Your email service is now live! 

### Next Steps:
- ✅ Test all email types on the test page
- ✅ Check emails don't go to spam
- ✅ For production: Verify your domain (see EMAIL_SERVICE_SETUP_GUIDE.md)

### Files Created:
- ✅ `lib/email.ts` - Email service
- ✅ `app/api/test-email/route.ts` - Test API
- ✅ `app/test-email/page.tsx` - Test UI
- ✅ `EMAIL_SERVICE_SETUP_GUIDE.md` - Full docs

---

## 💡 Quick Commands

```bash
# Get API key
open https://resend.com

# Add to .env.local
echo "RESEND_API_KEY=re_your_key" >> .env.local
echo "EMAIL_FROM=onboarding@resend.dev" >> .env.local

# Restart and test
npm run dev
open http://localhost:3000/test-email
```

---

**Need help?** See EMAIL_SERVICE_SETUP_GUIDE.md for detailed instructions.

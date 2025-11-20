# 🚀 Next Steps - Email Setup

## ✅ What I've Done

I've added the email configuration lines to your `.env.local` file:
```
RESEND_API_KEY=YOUR_RESEND_API_KEY_HERE
EMAIL_FROM=onboarding@resend.dev
```

## 📝 What You Need to Do

### Step 1: Get Your Resend API Key

1. **Go to Resend**: https://resend.com
2. **Sign Up** (or login if you already have an account)
3. **Verify your email** (check inbox)
4. **Go to "API Keys"** in the Resend dashboard
5. **Click "Create API Key"**
6. **Copy the key** (it starts with `re_`)

**Important**: Copy it immediately - you won't see it again!

### Step 2: Add Your API Key

Open `.env.local` and replace this line:
```
RESEND_API_KEY=YOUR_RESEND_API_KEY_HERE
```

With your actual key:
```
RESEND_API_KEY=re_your_actual_key_from_resend
```

**Example**:
```
RESEND_API_KEY=re_abc123xyz456def789
EMAIL_FROM=onboarding@resend.dev
```

### Step 3: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C in the terminal where it's running)
# Then start it again:
npm run dev
```

### Step 4: Test the Email Service

**Option A: Using the Test Page** (Recommended)
1. Open: http://localhost:3000/test-email
2. Enter your email address
3. Select "Welcome Email"
4. Click "Send Test Email"
5. Check your inbox!

**Option B: Using curl**
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","type":"welcome"}'
```

### Step 5: Verify Email Arrived

1. Check your inbox
2. If not there, check **spam folder**
3. Email should be from "onboarding@resend.dev"
4. Subject: "Welcome to 2ndShift! 🎉"

---

## 🔍 Troubleshooting

### If Test Page Shows "Not Configured"
- Make sure you saved `.env.local`
- Make sure you restarted the dev server
- Check that RESEND_API_KEY starts with `re_`

### If Email Doesn't Arrive
- Check spam folder
- Verify API key is correct in Resend dashboard
- Check browser console for errors
- Try a different email address

### If You See "Invalid API Key"
- Make sure you copied the entire key
- No spaces before or after the key
- Key should start with `re_`

---

## ✅ Success Looks Like

When you send a test email, you should see:
```
✅ Success!
Email sent successfully!

Details:
{
  "to": "your-email@example.com",
  "subject": "Welcome to 2ndShift! 🎉",
  "messageId": "abc-123-xyz",
  "mode": "production"
}
```

And the email should arrive in your inbox within seconds!

---

## 📞 Need Help?

If you're stuck:
1. Check Resend dashboard for delivery status
2. Check console logs in browser (F12)
3. Verify your API key is active
4. Make sure dev server restarted

---

## 🎯 After Email Works

Once emails are working, we'll move on to:
1. ✅ Apply the database SQL fix
2. ✅ Test payment integration
3. ✅ Setup error monitoring

Let me know when you've added the API key and tested it! 🚀

# 📧 Email Service Setup Guide - Resend Integration

## ✅ What's Been Done

1. ✅ Installed Resend package (`npm install resend`)
2. ✅ Created `lib/email.ts` - Email service implementation
3. ✅ Updated `lib/email-templates.ts` - Removed duplicate function
4. ✅ Updated `.env.example` with EMAIL_FROM variable

## 🚀 Quick Setup (5-10 minutes)

### Step 1: Get Resend API Key

1. Go to **https://resend.com**
2. Click **"Sign Up"** (or "Login" if you have an account)
3. Verify your email
4. Go to **API Keys** in the dashboard
5. Click **"Create API Key"**
6. Copy the key (starts with `re_`)

**Important**: Copy it now - you won't see it again!

### Step 2: Add to Environment Variables

Open your `.env.local` file and add:

```bash
# Email Configuration (Add these lines)
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=noreply@2ndshift.in
```

**Example**:
```bash
RESEND_API_KEY=re_abc123xyz456
EMAIL_FROM=noreply@2ndshift.in
```

### Step 3: Verify Your Domain (Optional but Recommended)

**For Development**: You can use any `@resend.dev` email:
```bash
EMAIL_FROM=onboarding@resend.dev
```

**For Production** (Required before going live):

1. In Resend Dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `2ndshift.in`
4. Add the DNS records to your domain provider:
   - **DKIM Record** (for email authentication)
   - **SPF Record** (to prevent spoofing)
   - **DMARC Record** (for reporting)
5. Wait 5-10 minutes for DNS propagation
6. Click **"Verify"** in Resend dashboard
7. Once verified, update `EMAIL_FROM`:
   ```bash
   EMAIL_FROM=noreply@2ndshift.in
   ```

### Step 4: Test the Email Service

Create a test file `test_email.ts`:

```typescript
import { sendEmail } from './lib/email'
import { emailTemplates } from './lib/email-templates'

async function testEmail() {
  const template = emailTemplates.welcome('Test User', 'worker')
  const result = await sendEmail('your-email@example.com', template)
  console.log('Email result:', result)
}

testEmail()
```

Run it:
```bash
npx ts-node test_email.ts
```

Or test in a Next.js API route (recommended).

---

## 🔧 Usage Examples

### Example 1: Send Welcome Email

```typescript
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

// In your registration handler
const template = emailTemplates.welcome(user.full_name, user.user_type)
await sendEmail(user.email, template)
```

### Example 2: Send Custom Email

```typescript
import { sendEmail } from '@/lib/email'

const customTemplate = {
  subject: 'Custom Subject',
  html: '<h1>Hello</h1><p>This is a custom email</p>',
  text: 'Hello\n\nThis is a custom email'
}

await sendEmail('user@example.com', customTemplate)
```

### Example 3: Send with Custom From Address

```typescript
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

const template = emailTemplates.welcome('User', 'worker')
await sendEmail('user@example.com', template, 'support@2ndshift.in')
```

### Example 4: Send Bulk Emails

```typescript
import { sendBulkEmails } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

const recipients = ['user1@example.com', 'user2@example.com']
const template = emailTemplates.welcome('User', 'worker')

const results = await sendBulkEmails(recipients, template)
console.log(`Sent ${results.successful} emails`)
```

---

## 📝 Where to Add Email Calls

### 1. User Registration
**File**: `app/(auth)/register/page.tsx` or API route

```typescript
// After successful registration
const template = emailTemplates.welcome(userData.full_name, userData.user_type)
await sendEmail(userData.email, template)
```

### 2. Password Reset
**File**: Create `app/api/auth/reset-password/route.ts`

```typescript
import { sendEmail } from '@/lib/email'

const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
const template = {
  subject: 'Reset Your Password - 2ndShift',
  html: `<p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>`,
  text: `Reset your password: ${resetLink}`
}

await sendEmail(userEmail, template)
```

### 3. Job Application Notification
**File**: When worker applies to a project

```typescript
// In application submission handler
const template = emailTemplates.projectApplication(
  worker.full_name,
  project.title,
  client.full_name
)
await sendEmail(client.email, template)
```

### 4. Payment Receipt
**File**: After payment success

```typescript
const template = emailTemplates.paymentReceipt(
  user.full_name,
  payment.amount,
  project.title,
  payment.invoice_url
)
await sendEmail(user.email, template)
```

---

## 🎯 Implementation Checklist

### Must Have (Before Launch)
- [ ] Add RESEND_API_KEY to `.env.local`
- [ ] Add EMAIL_FROM to `.env.local`
- [ ] Test sending a welcome email
- [ ] Verify emails arrive in inbox (check spam too)
- [ ] Test password reset email
- [ ] Test payment receipt email

### Should Have (Week 1)
- [ ] Verify your domain in Resend
- [ ] Update EMAIL_FROM to use your domain
- [ ] Test all email templates
- [ ] Add email sending to registration flow
- [ ] Add email sending to password reset flow
- [ ] Monitor email delivery in Resend dashboard

### Nice to Have (Month 1)
- [ ] Add email preferences for users
- [ ] Set up email unsubscribe links
- [ ] Track email open rates
- [ ] A/B test email templates
- [ ] Add email notifications for all key events

---

## 💰 Pricing

### Resend Pricing (as of 2024)
- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Pro Tier**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

### When to Upgrade
- **Stay on Free**: < 100 users/day
- **Upgrade to Pro**: 100-500 new users/day
- **Go Enterprise**: 500+ users/day

---

## 🔍 Troubleshooting

### Issue: "RESEND_API_KEY not configured"
**Solution**: Add the API key to `.env.local` and restart dev server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Issue: Emails not arriving
**Checklist**:
1. ✅ Check spam folder
2. ✅ Verify API key is correct
3. ✅ Check Resend dashboard for delivery status
4. ✅ Ensure EMAIL_FROM is verified or using @resend.dev
5. ✅ Check console logs for error messages

### Issue: "Invalid from address"
**Solution**: 
- Use `onboarding@resend.dev` for testing
- Or verify your domain in Resend dashboard

### Issue: Emails in spam
**Solution**: 
- Verify your domain in Resend
- Add SPF, DKIM, and DMARC records
- Use a consistent FROM address
- Avoid spam trigger words in subject

---

## 🧪 Testing Strategy

### 1. Development Testing
Use your personal email:
```bash
EMAIL_FROM=onboarding@resend.dev
```

### 2. Staging Testing
Use verified domain:
```bash
EMAIL_FROM=staging@2ndshift.in
```

### 3. Production
Use production domain:
```bash
EMAIL_FROM=noreply@2ndshift.in
```

---

## 📊 Monitoring

### In Resend Dashboard
- View sent emails
- Check delivery status
- See bounce/complaint rates
- Monitor API usage

### Best Practices
1. Log all email sends (already done in `lib/email.ts`)
2. Track failed emails
3. Retry failed sends (optional)
4. Monitor bounce rates
5. Keep unsubscribe list

---

## 🔐 Security Best Practices

1. ✅ **Never expose RESEND_API_KEY** - Server-side only
2. ✅ **Validate email addresses** - Use `isValidEmail()` function
3. ✅ **Rate limit email sends** - Prevent spam
4. ✅ **Sanitize user input** - In email templates
5. ✅ **Use environment variables** - Don't hardcode keys

---

## 🚀 Next Steps

1. **Right Now**: 
   - Get Resend API key
   - Add to `.env.local`
   - Restart dev server

2. **In 5 Minutes**:
   - Test welcome email
   - Verify it arrives
   - Check styling looks good

3. **In 30 Minutes**:
   - Add email to registration flow
   - Add email to password reset
   - Test end-to-end

4. **This Week**:
   - Verify domain in Resend
   - Add all email notifications
   - Monitor delivery rates

---

## ✅ Verification Checklist

After setup, verify these work:

```bash
# Test checklist
[ ] User receives welcome email after registration
[ ] Password reset email arrives with working link
[ ] Client receives notification when worker applies
[ ] Payment receipt email sent after payment
[ ] Form 16A email works for TDS certificates
[ ] Emails don't go to spam folder
[ ] All links in emails work correctly
[ ] Unsubscribe link works (if implemented)
```

---

## 📞 Support

**Resend Support**:
- Documentation: https://resend.com/docs
- Discord: https://discord.gg/resend
- Email: support@resend.com

**Need Help?**
- Check Resend status: https://status.resend.com
- Review logs in Resend dashboard
- Test with different email providers

---

## 🎉 Success!

Once you see this message, you're good to go:
```
✅ Email sent successfully to: user@example.com
📧 Message ID: abc-123-xyz
```

Your email service is now live! 🚀

---

**Quick Start Command**:
```bash
# 1. Get API key from resend.com
# 2. Add to .env.local:
echo "RESEND_API_KEY=re_your_key_here" >> .env.local
echo "EMAIL_FROM=onboarding@resend.dev" >> .env.local
# 3. Restart server
npm run dev
```

That's it! Your email system is ready. 📧✨

# 🚀 2ndShift Platform - Deployment Guide

## Quick Deployment (Vercel - Recommended)

### Prerequisites
✅ GitHub repository (Done - already pushed)
✅ Supabase project (Done - connected)
✅ Vercel account (Free tier works)

---

## 🎯 Step-by-Step Deployment

### 1. Deploy to Vercel (5 minutes)

#### Option A: One-Click Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub: `iamram3sh/2ndshift`
4. Configure environment variables (see below)
5. Click "Deploy"

#### Option B: CLI Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
# Supabase Configuration
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional (for future)
# NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
# RAZORPAY_KEY_ID=your_key
# RAZORPAY_KEY_SECRET=your_secret
```

---

## 🗄️ Step 3: Supabase Storage Setup (2 minutes)

### Create Storage Bucket for Verification Documents

1. Go to [Supabase Dashboard](https://app.supabase.com/project/jxlzyfwthzdnulwpukij)
2. Navigate to **Storage** → **Create Bucket**
3. Bucket name: `verification-documents`
4. Public: **No** (Private)
5. File size limit: 5 MB
6. Allowed MIME types: `image/jpeg, image/png, application/pdf`

### Set Storage Policies

Run this SQL in Supabase SQL Editor:

```sql
-- Allow users to upload their own verification documents
CREATE POLICY "Users can upload own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own documents
CREATE POLICY "Users can view own verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to view all documents
CREATE POLICY "Admins can view all verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND user_type IN ('admin', 'superadmin')
  )
);
```

---

## 👥 Step 4: Create Test Users

### Create User Accounts

1. **Test Worker Account**
   - Email: `worker@test.com`
   - Password: `TestWorker123!`
   - Type: Worker

2. **Test Client Account**
   - Email: `client@test.com`
   - Password: `TestClient123!`
   - Type: Client

3. **Admin Account** (Your existing account)
   - Email: `ram3sh.akula@gmail.com`
   - Already exists

### Set Admin Role (Run in Supabase SQL Editor)

```sql
-- Make your account admin (if not already)
UPDATE users 
SET user_type = 'admin' 
WHERE email = 'ram3sh.akula@gmail.com';
```

---

## 🧪 Step 5: Testing Checklist

### Pre-Launch Testing

#### Authentication Tests
- [ ] Register new worker account
- [ ] Register new client account
- [ ] Login as worker
- [ ] Login as client
- [ ] Login as admin
- [ ] Logout works correctly

#### Worker Dashboard Tests
- [ ] Dashboard loads with stats
- [ ] Can view available projects
- [ ] Search projects works
- [ ] Filter by skills works
- [ ] Profile completion shows correctly
- [ ] Navigation works

#### Client Dashboard Tests
- [ ] Dashboard loads with stats
- [ ] Can create new project
- [ ] View projects list
- [ ] Search projects works
- [ ] Filter by status works
- [ ] Application counter shows

#### Review System Tests
- [ ] Create a test contract (set to completed)
- [ ] Worker can leave review for client
- [ ] Client can leave review for worker
- [ ] Reviews display on profiles
- [ ] Rating badge shows correctly
- [ ] Can respond to reviews
- [ ] Can flag inappropriate reviews

#### Messaging System Tests
- [ ] Worker can message client
- [ ] Client can message worker
- [ ] Messages appear in real-time
- [ ] Unread badge updates
- [ ] Conversation list shows
- [ ] Search conversations works
- [ ] Mobile view works

#### Verification System Tests
- [ ] User can submit PAN verification
- [ ] User can submit Aadhar verification
- [ ] User can upload documents
- [ ] Admin can view verification requests
- [ ] Admin can approve verification
- [ ] Admin can reject with reason
- [ ] Verified badge displays correctly

#### Mobile Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] All features work on mobile
- [ ] Responsive design looks good

#### Dark Mode Testing
- [ ] Toggle dark mode
- [ ] All pages support dark mode
- [ ] No UI issues in dark mode

---

## 🎯 Step 6: Create Sample Data

### Option A: Manual Data Entry (Recommended for testing)
1. Create 3-5 test projects
2. Apply to projects as worker
3. Accept applications as client
4. Complete some contracts
5. Leave reviews

### Option B: SQL Data Seeding (Quick)

Run this in Supabase SQL Editor:

```sql
-- Sample projects (run as client user)
INSERT INTO projects (client_id, title, description, budget, required_skills, duration_hours, status, deadline) VALUES
  ('your-client-user-id', 'Website Development', 'Need a modern website for my business', 50000, ARRAY['React', 'Node.js', 'Design'], 40, 'open', NOW() + INTERVAL '30 days'),
  ('your-client-user-id', 'Mobile App Design', 'Design a mobile app UI/UX', 35000, ARRAY['UI/UX', 'Figma', 'Design'], 20, 'open', NOW() + INTERVAL '20 days'),
  ('your-client-user-id', 'Backend API Development', 'Create REST API for mobile app', 45000, ARRAY['Node.js', 'MongoDB', 'API'], 30, 'open', NOW() + INTERVAL '25 days');

-- Sample worker profile (run as worker user)
INSERT INTO worker_profiles (user_id, skills, experience_years, hourly_rate, bio) VALUES
  ('your-worker-user-id', ARRAY['React', 'Node.js', 'MongoDB', 'TypeScript'], 5, 1000, 'Experienced full-stack developer with 5 years of experience');
```

---

## 📊 Step 7: Monitor & Analytics

### Set Up Monitoring

1. **Vercel Analytics** (Free)
   - Auto-enabled on Vercel
   - View at: vercel.com/dashboard/analytics

2. **Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Monitor database queries
   - Check for errors

3. **Error Tracking** (Optional)
   - Add Sentry for error tracking
   - Monitor production issues

---

## 🎉 Post-Deployment URLs

After deployment, you'll have:

```
Production URL: https://2ndshift.vercel.app (or your custom domain)

Key Pages:
- Home: /
- Login: /login
- Register: /register
- Worker Dashboard: /worker
- Client Dashboard: /client
- Admin Dashboard: /admin
- Messages: /messages
- Reviews: /contracts/{id}/review
- Verification: /verification
```

---

## 🔒 Security Checklist

Before going live:
- [ ] All environment variables set
- [ ] RLS policies active
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Credentials not exposed in code
- [ ] Storage bucket properly secured
- [ ] Admin accounts secured

---

## 🐛 Troubleshooting

### Common Issues

**1. "Connection refused" errors**
- Check environment variables are set correctly
- Verify Supabase URL and keys

**2. "Unauthorized" errors**
- Check RLS policies are applied
- Verify user authentication

**3. File upload fails**
- Ensure storage bucket created
- Check storage policies applied
- Verify file size limits

**4. Real-time not working**
- Check Supabase real-time is enabled
- Verify subscription permissions

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Site is live and accessible
- ✅ Users can register and login
- ✅ All dashboards load correctly
- ✅ Reviews can be left and viewed
- ✅ Messaging works in real-time
- ✅ Verifications can be submitted
- ✅ Admin tools function properly
- ✅ Mobile view works perfectly

---

## 🚀 You're Ready to Launch!

Follow these steps in order:
1. Deploy to Vercel (5 min)
2. Setup Supabase storage (2 min)
3. Create test users (5 min)
4. Run through testing checklist (30 min)
5. Create sample data (10 min)
6. Invite real users! 🎉

**Estimated Total Time: 1 hour**

---

**Need help with any step? Let me know and I'll assist!**

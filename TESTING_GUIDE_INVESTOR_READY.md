# 🧪 Testing Guide - Investor-Ready Features

## ✅ Migration Complete! Now Let's Test Everything

---

## 📋 Quick Verification Checklist

### Step 1: Verify Database Tables (2 minutes)

Run these queries in Supabase SQL Editor to confirm everything was created:

```sql
-- Check all new tables exist
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN (
  'client_profiles',
  'certifications', 
  'reviews',
  'verification_requests',
  'messages',
  'user_activity_log'
)
ORDER BY table_name;
-- Should return 6 rows
```

```sql
-- Check enhanced user columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN (
  'profile_photo_url',
  'profile_completion_percentage',
  'is_online',
  'verification_status',
  'trust_score'
)
ORDER BY column_name;
-- Should return 5 rows
```

```sql
-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'calculate_worker_profile_completion',
  'calculate_client_profile_completion',
  'update_profile_completion',
  'update_user_online_status'
)
ORDER BY routine_name;
-- Should return 4 rows
```

**Expected Result:** All queries should return the expected number of rows.

---

## 🧪 Testing Plan (30 minutes)

### Test 1: Profile Completion Widget (5 min)

#### As a Worker:

1. **Login to your platform as a worker**
2. **Go to worker dashboard**
3. **Check if you see profile completion percentage**
4. **Test updating profile:**
   - Add a profile photo
   - Add skills
   - Fill in bio
   - Add phone number
   - Watch percentage increase!

**What to look for:**
- ✅ Percentage shows (0-100%)
- ✅ Task list appears
- ✅ Percentage updates when you complete tasks
- ✅ Visual progress bar

**Test Query:**
```sql
-- Check your profile completion
SELECT 
  u.email,
  u.profile_completion_percentage,
  wp.skills,
  wp.bio,
  u.profile_photo_url
FROM users u
LEFT JOIN worker_profiles wp ON wp.user_id = u.id
WHERE u.email = 'your-email@example.com';
```

---

### Test 2: Verification Badges (5 min)

#### Test Email Verification:

```sql
-- Mark email as verified
UPDATE users 
SET email_verified = true 
WHERE email = 'your-email@example.com';
```

#### Test Phone Verification:

```sql
-- Mark phone as verified
UPDATE users 
SET phone_verified = true 
WHERE email = 'your-email@example.com';
```

#### Test ID Verification:

```sql
-- Set verification status
UPDATE users 
SET 
  verification_status = 'verified',
  verified_at = NOW()
WHERE email = 'your-email@example.com';
```

**What to look for:**
- ✅ Badges appear on your profile
- ✅ Different colors for different levels
- ✅ Tooltips show what each badge means

---

### Test 3: Online Status (5 min)

#### Test Real-Time Status:

```sql
-- Set yourself online
UPDATE users 
SET 
  is_online = true,
  availability_status = 'online',
  last_seen = NOW()
WHERE email = 'your-email@example.com';
```

**What to test:**
1. Refresh your profile page
2. Check if green "Online" indicator appears
3. Change status to "Away":
```sql
UPDATE users 
SET availability_status = 'away'
WHERE email = 'your-email@example.com';
```
4. Refresh - should show yellow "Away"

**Status options:**
- `online` - Green dot
- `available` - Green dot
- `away` - Yellow dot
- `busy` - Red dot
- `offline` - Gray dot

---

### Test 4: Certificate Management (5 min)

#### Add a Test Certificate:

```sql
-- Add a sample certificate
INSERT INTO certifications (
  user_id,
  certificate_name,
  certificate_type,
  issuing_organization,
  issue_date,
  is_lifetime
) VALUES (
  (SELECT id FROM users WHERE email = 'your-email@example.com'),
  'React Developer Certification',
  'professional',
  'Meta',
  '2024-01-01',
  false
);
```

#### Check it appears:

```sql
-- View your certificates
SELECT 
  certificate_name,
  issuing_organization,
  certificate_type,
  is_verified,
  issue_date
FROM certifications
WHERE user_id = (SELECT id FROM users WHERE email = 'your-email@example.com');
```

**What to test:**
- ✅ Certificate appears in your profile
- ✅ Shows as "Pending Verification"
- ✅ Admin can see it in verification queue

---

### Test 5: Client Profile (5 min)

#### Create a Client Profile:

```sql
-- Insert client profile
INSERT INTO client_profiles (
  user_id,
  company_name,
  company_type,
  industry,
  company_description
) VALUES (
  (SELECT id FROM users WHERE email = 'client-email@example.com'),
  'Tech Innovations Inc',
  'startup',
  'Software Development',
  'We build amazing software products'
);
```

#### Check Profile Completion:

```sql
-- Check client profile completion
SELECT 
  u.email,
  u.profile_completion_percentage,
  cp.company_name,
  cp.company_type
FROM users u
LEFT JOIN client_profiles cp ON cp.user_id = u.id
WHERE u.email = 'client-email@example.com';
```

---

### Test 6: Reviews System (5 min)

#### Add a Test Review:

```sql
-- Add a sample review (requires completed contract)
-- First, ensure you have a completed contract
INSERT INTO reviews (
  contract_id,
  reviewer_id,
  reviewee_id,
  overall_rating,
  skill_rating,
  communication_rating,
  review_text,
  would_recommend
) VALUES (
  (SELECT id FROM contracts LIMIT 1), -- Use existing contract
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  (SELECT id FROM users WHERE user_type = 'worker' LIMIT 1),
  5,
  5,
  5,
  'Excellent work! Very professional and delivered on time.',
  true
);
```

#### View Reviews:

```sql
-- See reviews for a user
SELECT 
  r.overall_rating,
  r.review_text,
  r.created_at,
  reviewer.full_name as reviewer_name
FROM reviews r
JOIN users reviewer ON reviewer.id = r.reviewer_id
WHERE r.reviewee_id = (SELECT id FROM users WHERE email = 'your-email@example.com')
AND r.is_visible = true;
```

---

### Test 7: Admin Verification Panel (10 min)

#### Create a Verification Request:

```sql
-- Create a test verification request
INSERT INTO verification_requests (
  user_id,
  verification_type,
  status,
  documents
) VALUES (
  (SELECT id FROM users WHERE email = 'your-email@example.com'),
  'identity',
  'pending',
  '[{"name": "Government ID", "url": "https://example.com/id.pdf"}]'::jsonb
);
```

#### Test Admin Actions:

**As Admin (change user to admin first):**

```sql
-- Make yourself admin
UPDATE users 
SET user_type = 'admin' 
WHERE email = 'admin@example.com';
```

**Then login and:**
1. Navigate to admin panel
2. Should see verification queue
3. Can approve/reject requests

**Test Approval:**
```sql
-- Approve a verification request
UPDATE verification_requests 
SET 
  status = 'approved',
  reviewed_at = NOW()
WHERE id = 'verification-request-id';

-- Also update user status
UPDATE users 
SET 
  verification_status = 'verified',
  verified_at = NOW()
WHERE id = (SELECT user_id FROM verification_requests WHERE id = 'verification-request-id');
```

---

## 🎯 Feature-by-Feature Testing

### Profile Completion System

**Test Points:**
- [ ] Worker sees completion percentage
- [ ] Client sees completion percentage
- [ ] Percentage updates when profile is edited
- [ ] Task list shows incomplete items
- [ ] Progress bar visual works
- [ ] 100% completion shows success message

**Manual Test:**
1. Login as worker
2. Go to profile
3. Note current percentage
4. Add missing information
5. Save
6. Refresh page
7. Verify percentage increased

---

### Verification Badge System

**Test Points:**
- [ ] Email verified badge shows (green)
- [ ] Phone verified badge shows (blue)
- [ ] ID verified badge shows (yellow)
- [ ] Professional verified badge shows (purple)
- [ ] Badge tooltips work
- [ ] Badges appear on profile cards

**Test Query:**
```sql
-- Check your verification level
SELECT 
  email,
  email_verified,
  phone_verified,
  verification_status,
  CASE 
    WHEN verification_status = 'verified' THEN 3
    WHEN phone_verified THEN 2
    WHEN email_verified THEN 1
    ELSE 0
  END as verification_level
FROM users
WHERE email = 'your-email@example.com';
```

---

### Online Status System

**Test Points:**
- [ ] Status indicator appears
- [ ] Color changes based on status
- [ ] Last seen timestamp shows
- [ ] Status persists after refresh
- [ ] Can toggle between statuses

**Test All Statuses:**
```sql
-- Test each status
UPDATE users SET availability_status = 'online' WHERE email = 'your@email.com';
-- Refresh and check green dot

UPDATE users SET availability_status = 'away' WHERE email = 'your@email.com';
-- Refresh and check yellow dot

UPDATE users SET availability_status = 'busy' WHERE email = 'your@email.com';
-- Refresh and check red dot

UPDATE users SET availability_status = 'offline' WHERE email = 'your@email.com';
-- Refresh and check gray dot
```

---

### Trust Score System

**Test Points:**
- [ ] Trust score calculates (0-100)
- [ ] Score appears on profile
- [ ] Score updates based on actions

**Calculate Trust Score:**
```sql
-- Set a trust score
UPDATE users 
SET trust_score = 85
WHERE email = 'your-email@example.com';

-- Calculate based on metrics
UPDATE users 
SET trust_score = (
  CASE WHEN email_verified THEN 20 ELSE 0 END +
  CASE WHEN phone_verified THEN 20 ELSE 0 END +
  CASE WHEN verification_status = 'verified' THEN 30 ELSE 0 END +
  CASE WHEN profile_completion_percentage > 80 THEN 30 ELSE profile_completion_percentage / 3 END
)
WHERE email = 'your-email@example.com';
```

---

## 📊 Database Validation Queries

### Check Everything is Working:

```sql
-- Comprehensive status check
SELECT 
  'Users with enhanced fields' as check_name,
  COUNT(*) as count
FROM users 
WHERE profile_completion_percentage IS NOT NULL

UNION ALL

SELECT 
  'Client profiles created',
  COUNT(*) 
FROM client_profiles

UNION ALL

SELECT 
  'Certifications added',
  COUNT(*) 
FROM certifications

UNION ALL

SELECT 
  'Reviews submitted',
  COUNT(*) 
FROM reviews

UNION ALL

SELECT 
  'Verification requests',
  COUNT(*) 
FROM verification_requests

UNION ALL

SELECT 
  'Messages sent',
  COUNT(*) 
FROM messages;
```

---

## 🎨 UI Component Testing

### ProfileCompletionWidget

**Location:** Should appear on dashboard

**Test:**
1. Login as worker/client
2. Go to dashboard
3. Look for "Complete Your Profile" widget
4. Should show:
   - Current percentage
   - Progress bar
   - Task list
   - "Complete" button for each task

**If not visible:** Component needs to be integrated into your dashboard.

---

### VerificationBadges

**Location:** Should appear on profile cards

**Test:**
1. View any user profile
2. Look for badges near user name
3. Hover over badges for tooltips
4. Should see color-coded badges

**If not visible:** Component needs to be added to profile display.

---

### OnlineStatusIndicator

**Location:** Should appear next to user names

**Test:**
1. View user list or profile
2. Look for colored dot
3. Should see:
   - Green = Online
   - Yellow = Away
   - Red = Busy
   - Gray = Offline

**If not visible:** Component needs to be integrated.

---

### VerificationQueue (Admin)

**Location:** Admin panel

**Test:**
1. Login as admin
2. Navigate to `/admin` or admin section
3. Should see pending verifications
4. Can click to review
5. Can approve/reject

**If not visible:** Admin route needs to be created.

---

## 🚀 Quick Test Script

Run this to set up a complete test scenario:

```sql
-- QUICK TEST SETUP SCRIPT
-- Run this to create a complete test environment

-- 1. Update your user with all features
UPDATE users 
SET 
  email_verified = true,
  phone_verified = true,
  phone = '+911234567890',
  profile_photo_url = 'https://via.placeholder.com/150',
  date_of_birth = '1990-01-01',
  gender = 'male',
  city = 'Mumbai',
  state = 'Maharashtra',
  country = 'India',
  is_online = true,
  availability_status = 'available',
  last_seen = NOW(),
  verification_status = 'verified',
  verified_at = NOW(),
  trust_score = 85,
  profile_completion_percentage = 75
WHERE email = 'your-email@example.com';

-- 2. Add worker profile details
UPDATE worker_profiles 
SET 
  profession = 'Full Stack Developer',
  tagline = 'Building amazing web applications',
  languages = ARRAY['English', 'Hindi'],
  education = 'B.Tech in Computer Science',
  bio = 'Experienced developer with 5+ years of experience in web development. Specialized in React, Node.js, and cloud technologies.',
  linkedin_url = 'https://linkedin.com/in/yourprofile',
  website_url = 'https://yourportfolio.com',
  is_available = true,
  verification_level = 4
WHERE user_id = (SELECT id FROM users WHERE email = 'your-email@example.com');

-- 3. Add a test certificate
INSERT INTO certifications (
  user_id,
  certificate_name,
  certificate_type,
  issuing_organization,
  issue_date,
  is_verified
) VALUES (
  (SELECT id FROM users WHERE email = 'your-email@example.com'),
  'AWS Certified Developer',
  'professional',
  'Amazon Web Services',
  '2023-06-01',
  true
);

-- 4. Check results
SELECT 
  u.email,
  u.profile_completion_percentage,
  u.verification_status,
  u.trust_score,
  u.is_online,
  u.availability_status,
  wp.profession,
  wp.tagline,
  (SELECT COUNT(*) FROM certifications WHERE user_id = u.id) as cert_count
FROM users u
LEFT JOIN worker_profiles wp ON wp.user_id = u.id
WHERE u.email = 'your-email@example.com';
```

---

## ✅ Success Criteria

Your platform is working correctly if:

1. ✅ **Profile Completion**
   - Shows percentage
   - Updates in real-time
   - Task list displays

2. ✅ **Verification Badges**
   - Multiple badge levels work
   - Colors are correct
   - Tooltips appear

3. ✅ **Online Status**
   - Indicator shows
   - Status changes work
   - Real-time updates

4. ✅ **Certificates**
   - Can be added
   - Show in profile
   - Verification workflow works

5. ✅ **Admin Panel**
   - Verification queue visible
   - Can approve/reject
   - Notifications work

6. ✅ **Trust Scores**
   - Calculate correctly
   - Display on profiles
   - Update appropriately

---

## 🎊 Demo Preparation

### For Investor Demo:

1. **Create 3 Demo Accounts:**
   - Worker (100% profile complete, verified)
   - Client (100% profile complete, verified)
   - Admin (for showing verification panel)

2. **Populate with Data:**
   - 5-10 workers with varying completion %
   - 5-10 projects
   - Some applications
   - Some reviews
   - Pending verifications

3. **Test Scenarios:**
   - Show profile completion widget
   - Demonstrate verification badges
   - Show real-time online status
   - Walk through admin verification
   - Display trust scores

---

## 📞 Troubleshooting

### If Profile Completion Doesn't Show:

```sql
-- Manually trigger calculation
SELECT calculate_worker_profile_completion('your-user-id');
SELECT calculate_client_profile_completion('your-user-id');

-- Update the percentage
UPDATE users 
SET profile_completion_percentage = calculate_worker_profile_completion(id)
WHERE id = 'your-user-id';
```

### If Badges Don't Appear:

Check component is imported and used:
```tsx
import VerificationBadges from '@/components/profile/VerificationBadges'

<VerificationBadges
  verificationLevel={user.verification_level}
  isVerified={user.verification_status === 'verified'}
  emailVerified={user.email_verified}
  phoneVerified={user.phone_verified}
/>
```

### If Online Status Doesn't Update:

```sql
-- Force update
UPDATE users 
SET 
  is_online = true,
  last_seen = NOW()
WHERE id = auth.uid();
```

---

## 🎯 Next Steps

After testing:

1. ✅ Integrate UI components into your dashboards
2. ✅ Create sample data for demo
3. ✅ Test all workflows end-to-end
4. ✅ Prepare investor presentation
5. ✅ Set up demo accounts
6. ✅ Practice demo script

---

**Your platform is now INVESTOR-READY! 🚀**

Let me know which feature you want to test first!

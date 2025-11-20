# User Creation & Testing Guide - 2ndShift Platform

## 🚀 Quick Setup for Testing

### Step 1: Database Setup

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to SQL Editor

2. **Execute the Database Schema**
   ```bash
   # Run the complete schema from DATABASE_SCHEMA.sql
   # This creates all tables, RLS policies, and triggers
   ```

3. **Verify Tables Created**
   - Check Table Editor for these tables:
     - ✅ users
     - ✅ worker_profiles
     - ✅ projects
     - ✅ applications
     - ✅ contracts
     - ✅ payments

---

## 👥 User Creation Flow

### For Workers (Hire/Find Work)

1. **Register as Worker**
   - Go to `/register`
   - Select "Find Work" option
   - Fill in:
     - Full Name: "John Worker"
     - Email: "worker@test.com"
     - Password: "Test@123" (must have uppercase, lowercase, number, special char)
     - Confirm Password
   - Click "Create Account"

2. **What Happens Behind the Scenes**
   - Supabase Auth creates authentication user
   - Profile created in `users` table with `user_type = 'worker'`
   - User redirected to login page

3. **Login & Access Dashboard**
   - Login with credentials
   - Redirected to `/worker` dashboard
   - Can view:
     - Available projects
     - Personal stats
     - Browse and apply to jobs

### For Clients (Hire Talent)

1. **Register as Client**
   - Go to `/register`
   - Select "Hire Talent" option
   - Fill in:
     - Full Name: "Jane Client"
     - Email: "client@test.com"
     - Password: "Test@123"
     - Confirm Password
   - Click "Create Account"

2. **What Happens**
   - Auth user created
   - Profile created with `user_type = 'client'`
   - Redirected to login

3. **Login & Post Jobs**
   - Login with credentials
   - Redirected to `/client` dashboard
   - Can:
     - Post new projects
     - View applications
     - Manage contracts
     - Process payments

---

## 🔧 Admin Setup

### Create Admin User

**Option 1: Via SQL (Recommended)**
```sql
-- 1. First register normally through the app
-- 2. Then run this to upgrade to admin:
UPDATE users 
SET user_type = 'admin' 
WHERE email = 'admin@2ndshift.com';
```

**Option 2: Manual in Supabase**
1. Go to Table Editor → users
2. Find your user row
3. Change `user_type` from 'worker' or 'client' to 'admin'
4. Save

### Admin Dashboard Features

Access at: `/admin`

**Main Dashboard**
- Total users (workers + clients)
- Total projects posted
- Active projects count
- Platform revenue (from fees)

**User Management** (`/admin/users`)
- View all registered users
- Filter by type (worker/client/admin)
- Search by name or email
- Export to CSV
- See user statistics

**Analytics Dashboard** (`/admin/analytics`)
- User distribution charts
- Project status breakdown
- Revenue tracking
- Monthly growth metrics
- Recent users and projects
- Export reports

---

## 🧪 Testing Workflows

### Test 1: Worker Registration & Login
```bash
1. Go to http://localhost:3000/register
2. Select "Find Work"
3. Register with:
   - Name: Test Worker
   - Email: worker1@test.com
   - Password: Worker@123
4. Verify email (if enabled)
5. Login at /login
6. Should redirect to /worker dashboard
7. Check that profile shows in database
```

### Test 2: Client Registration & Project Posting
```bash
1. Go to /register
2. Select "Hire Talent"
3. Register with:
   - Name: Test Client
   - Email: client1@test.com
   - Password: Client@123
4. Login
5. Should redirect to /client dashboard
6. Click "Post Project"
7. Fill in project details
8. Submit and verify project appears
```

### Test 3: Admin Access
```bash
1. Register any user
2. Update user_type to 'admin' in database
3. Login
4. Should redirect to /admin
5. Verify stats are showing
6. Click "View All Users"
7. Click "Analytics Dashboard"
8. Test export functionality
```

---

## 📊 Available Features to Test

### Worker Features
✅ **Dashboard** (`/worker`)
- View available projects
- See personal stats
- Search projects
- Apply to projects

✅ **Profile** (`/profile`)
- Update personal information
- Add phone number
- Add PAN number

✅ **Browse Projects** (`/projects`)
- Filter by skills
- Sort by budget
- View project details

### Client Features
✅ **Dashboard** (`/client`)
- View posted projects
- See project status
- Quick stats

✅ **Create Project** (`/projects/create`)
- Post new jobs
- Set budget
- Define requirements
- Set deadline

✅ **Manage Projects**
- Edit projects
- View applications
- Accept/reject workers

### Admin Features
✅ **Main Dashboard** (`/admin`)
- Platform overview
- Key metrics
- Quick actions

✅ **User Management** (`/admin/users`)
- View all users
- Filter by type
- Search functionality
- Export user list

✅ **Analytics** (`/admin/analytics`)
- User distribution
- Project statistics
- Revenue tracking
- Growth metrics
- Export reports

---

## 🎯 What You Can Track in Admin Portal

### User Metrics
- **Total Registered Users**: All users count
- **Workers**: Number of freelancers
- **Clients**: Number of companies/hirers
- **Admins**: Number of admin users
- **Growth Rate**: New users per month

### Project Metrics
- **Total Projects Posted**: All-time count
- **Active Projects**: Currently open/in-progress
- **Completed Projects**: Successfully finished
- **Cancelled Projects**: Terminated jobs
- **Completion Rate**: Percentage of successful projects

### Financial Metrics
- **Platform Revenue**: Total fees collected (10% default)
- **Worker Earnings**: Total paid to workers
- **Monthly Revenue**: Current month earnings
- **Revenue Growth**: Month-over-month increase
- **Average Project Value**: Mean project budget

### Engagement Metrics
- **Active Users**: Users who logged in recently
- **Projects per Client**: Average posting rate
- **Applications per Project**: Interest level
- **Time to Hire**: Average days to project assignment

---

## 🔍 Database Queries for Manual Checking

```sql
-- Check all users
SELECT id, full_name, email, user_type, created_at 
FROM users 
ORDER BY created_at DESC;

-- Check workers only
SELECT * FROM users WHERE user_type = 'worker';

-- Check clients only
SELECT * FROM users WHERE user_type = 'client';

-- Check all projects
SELECT p.id, p.title, p.budget, p.status, u.full_name as client_name
FROM projects p
JOIN users u ON p.client_id = u.id
ORDER BY p.created_at DESC;

-- Check platform revenue
SELECT 
  COUNT(*) as total_payments,
  SUM(platform_fee) as total_revenue,
  SUM(net_amount) as total_worker_earnings
FROM payments 
WHERE status = 'completed';

-- Get user statistics
SELECT 
  user_type,
  COUNT(*) as count
FROM users
GROUP BY user_type;
```

---

## 🐛 Troubleshooting

### Issue: "Profile creation error"
**Solution:**
1. Check if `users` table exists in Supabase
2. Verify RLS policies allow INSERT
3. Check console for detailed error
4. Verify user_id matches auth.uid()

### Issue: "Cannot access dashboard"
**Solution:**
1. Check if logged in (auth.uid() exists)
2. Verify user profile exists in users table
3. Check user_type is correct
4. Clear browser cache and cookies

### Issue: "Admin stats showing 0"
**Solution:**
1. Verify tables have data
2. Check RLS policies allow admin to SELECT
3. Run SQL queries manually to verify data
4. Check browser console for errors

### Issue: "Can't create projects"
**Solution:**
1. Verify logged in as 'client' type
2. Check projects table exists
3. Verify RLS policy allows INSERT for clients
4. Check all required fields are filled

---

## 📋 Testing Checklist

### User Registration
- [ ] Worker can register
- [ ] Client can register
- [ ] Profile created in database
- [ ] User redirected after registration
- [ ] Can login with credentials
- [ ] Correct dashboard shown based on type

### Worker Flow
- [ ] Can view available projects
- [ ] Can search projects
- [ ] Can apply to projects
- [ ] Profile updates work
- [ ] Stats are accurate

### Client Flow
- [ ] Can create projects
- [ ] Can edit own projects
- [ ] Can view applications
- [ ] Can manage contracts
- [ ] Stats show correct data

### Admin Flow
- [ ] Can access admin dashboard
- [ ] User management works
- [ ] Analytics load correctly
- [ ] Export functionality works
- [ ] Filtering and search work
- [ ] Stats are accurate

---

## 🚀 Quick Start Commands

```bash
# 1. Start development server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Test registration
Go to: http://localhost:3000/register

# 4. Create admin (after registering)
# In Supabase SQL Editor:
UPDATE users SET user_type = 'admin' WHERE email = 'your@email.com';

# 5. Access admin panel
http://localhost:3000/admin
```

---

## 📊 Sample Test Data

### Create Test Users

```sql
-- Note: Users must register through the app first
-- Then you can modify their data:

-- Upgrade to admin
UPDATE users SET user_type = 'admin' WHERE email = 'admin@test.com';

-- Add phone numbers
UPDATE users SET phone = '9876543210' WHERE email = 'worker@test.com';

-- Add PAN (for testing)
UPDATE users SET pan_number = 'ABCDE1234F' WHERE email = 'client@test.com';
```

---

## 🎯 Next Steps After Setup

1. **Test All Workflows**
   - Register workers and clients
   - Post projects
   - Apply to projects
   - Create admin and verify analytics

2. **Customize Admin Portal**
   - Add more metrics you want to track
   - Create custom reports
   - Add filtering options

3. **Add More Features**
   - Email notifications
   - Payment processing
   - Contract management
   - Rating system

4. **Production Deployment**
   - Set up production database
   - Configure environment variables
   - Enable email verification
   - Set up monitoring

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify database schema is correct
4. Check RLS policies are enabled
5. Review this guide for solutions

---

**Happy Testing! 🎉**

Last Updated: 2024

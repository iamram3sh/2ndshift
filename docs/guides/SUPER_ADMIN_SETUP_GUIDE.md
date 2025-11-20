# 🔐 Super Admin Setup Guide

## Setting Up Super Admin Access for 2ndShift

---

## 🎯 What You're Getting

### Access Hierarchy:
```
👑 You (Super Admin)
   ├── Full platform access
   ├── Manage admin staff
   ├── View all analytics
   └── Control everything
   
🛡️ Admin Staff (Your Team)
   ├── Platform management
   ├── User management
   ├── View analytics
   └── Cannot manage other admins
   
👤 Regular Users
   └── Normal platform features
```

---

## Step 1: Update Database (5 minutes)

### 1.1 Go to Supabase
- Open your Supabase dashboard
- Click "SQL Editor"
- Click "New Query"

### 1.2 Run This SQL
Copy everything from: **`DATABASE_UPDATE_SUPERADMIN.sql`**

**IMPORTANT:** Before running, edit this line:
```sql
UPDATE users 
SET user_type = 'superadmin', is_staff = false 
WHERE email = 'your-email@example.com';  -- PUT YOUR ACTUAL EMAIL HERE!
```

### 1.3 Execute
- Click "Run"
- You should see success messages
- Verify you see your email as Super Admin

---

## Step 2: Test Super Admin Access

### 2.1 Logout and Login Again
- Go to your site: `https://2ndshift.vercel.app/login`
- Logout if already logged in
- Login with YOUR credentials

### 2.2 Access Super Admin Portal
You'll be redirected based on your role:
- **Super Admin:** Can access `/superadmin` AND `/admin`
- **Regular Admin:** Can only access `/admin`

### 2.3 Go to Super Admin Portal
Navigate to: `https://2ndshift.vercel.app/superadmin`

You should see:
- 👑 "Super Admin Portal" header
- Platform Dashboard button
- User Management button  
- Analytics button
- Staff Management section
- Security notice

---

## Step 3: Add Admin Staff Members

### Method 1: Through Super Admin Portal (Easy)

1. Go to `/superadmin`
2. Click "Add Staff" button
3. Enter the email of an existing registered user
4. Click "Add"
5. That user is now Admin Staff!

### Method 2: Through SQL (Quick)

```sql
-- Make any user an admin staff
UPDATE users 
SET user_type = 'admin', is_staff = true 
WHERE email = 'staff-member@example.com';
```

---

## Step 4: Verify Access Levels

### Test Super Admin Access (You):
- ✅ Can access `/superadmin`
- ✅ Can access `/admin`
- ✅ Can add/remove staff
- ✅ Can see all users
- ✅ Can see all analytics

### Test Admin Staff Access:
- ❌ Cannot access `/superadmin`
- ✅ Can access `/admin`
- ✅ Can view users
- ✅ Can view analytics
- ❌ Cannot add/remove other admins

### Test Regular User Access:
- ❌ Cannot access `/superadmin`
- ❌ Cannot access `/admin`
- ✅ Can access own dashboard (`/worker` or `/client`)

---

## What Each Portal Shows

### Super Admin Portal (`/superadmin`)
**URL:** `https://2ndshift.vercel.app/superadmin`

**Features:**
- 👑 Super Admin badge
- Quick links to all admin features
- Staff management panel
- Add/remove admin staff
- Security notice
- Activity logs (coming soon)

**Who Can Access:** ONLY YOU (the platform owner)

---

### Admin Portal (`/admin`)
**URL:** `https://2ndshift.vercel.app/admin`

**Features:**
- Platform statistics
- Total users, projects, revenue
- Quick actions menu
- User management link
- Analytics link
- Recent activity

**Who Can Access:** Super Admin + Admin Staff

---

### User Management (`/admin/users`)
**URL:** `https://2ndshift.vercel.app/admin/users`

**Features:**
- View all users
- Search by name/email
- Filter by type
- Export to CSV
- User statistics

**Who Can Access:** Super Admin + Admin Staff

---

### Analytics (`/admin/analytics`)
**URL:** `https://2ndshift.vercel.app/admin/analytics`

**Features:**
- User distribution charts
- Project status breakdown
- Revenue tracking
- Growth metrics
- Export reports

**Who Can Access:** Super Admin + Admin Staff

---

## URL Structure

```
Your Platform Structure:

/                          → Home page (public)
/register                  → Registration (public)
/login                     → Login (public)

/worker                    → Worker dashboard (workers only)
/client                    → Client dashboard (clients only)

/admin                     → Admin dashboard (admin staff + superadmin)
/admin/users              → User management (admin staff + superadmin)
/admin/analytics          → Analytics (admin staff + superadmin)

/superadmin               → Super Admin portal (ONLY YOU!)
```

---

## Security Features

### What's Protected:

1. **Super Admin Portal:**
   - Only accessible by user_type = 'superadmin'
   - Redirects everyone else to home page
   - Shows "Access Denied" for non-superadmins

2. **Admin Portal:**
   - Accessible by admin staff AND superadmin
   - Redirects regular users to their dashboard
   - Checks user_type on every page load

3. **Staff Management:**
   - Only super admin can add/remove staff
   - Admin staff cannot promote other users
   - Database-level restrictions via RLS

---

## Managing Your Team

### Add New Staff Member:

**Step 1:** They must register on the platform first
- Send them: `https://2ndshift.vercel.app/register`
- They can register as worker or client (doesn't matter)

**Step 2:** You make them admin staff
- Go to `/superadmin`
- Click "Add Staff"
- Enter their email
- Click "Add"

**Step 3:** They logout and login again
- They'll now see admin access
- Can access `/admin` portal

### Remove Staff Member:

**From Super Admin Portal:**
- Go to `/superadmin`
- Find staff member
- Click "Remove"
- Confirm

**Via SQL:**
```sql
UPDATE users 
SET user_type = 'worker', is_staff = false 
WHERE email = 'staff-member@example.com';
```

---

## Common Tasks

### Check Who's Super Admin:
```sql
SELECT email, user_type 
FROM users 
WHERE user_type = 'superadmin';
```

### Check All Admin Staff:
```sql
SELECT email, user_type, is_staff, created_at
FROM users 
WHERE user_type = 'admin' AND is_staff = true
ORDER BY created_at DESC;
```

### View All Admins (Super + Staff):
```sql
SELECT 
  email, 
  user_type,
  is_staff,
  CASE 
    WHEN user_type = 'superadmin' THEN '👑 Super Admin'
    WHEN is_staff THEN '🛡️ Admin Staff'
    ELSE '⚠️ Unknown'
  END as role
FROM users 
WHERE user_type IN ('admin', 'superadmin')
ORDER BY user_type;
```

---

## Troubleshooting

### Issue: Can't access `/superadmin`
**Solution:**
1. Check you ran the SQL update with YOUR email
2. Verify in Supabase: `SELECT * FROM users WHERE email = 'your@email.com'`
3. Should show `user_type = 'superadmin'`
4. Logout and login again

### Issue: Staff member can't access `/admin`
**Solution:**
1. Verify they're set as admin: `SELECT * FROM users WHERE email = 'staff@email.com'`
2. Should show `user_type = 'admin'` and `is_staff = true`
3. Make sure they logout and login again
4. Clear browser cache

### Issue: Getting "Access Denied"
**Solution:**
- Check you're logged in
- Check your user_type is correct
- Try logout and login
- Check RLS policies are enabled

### Issue: Changes not taking effect
**Solution:**
1. Run the SQL update again
2. Clear browser cookies
3. Logout completely
4. Close all browser tabs
5. Login fresh

---

## Next Features (Coming Soon)

### Worker Time Tracking:
- Login/logout timestamps
- Work duration tracking
- Earnings calculation
- Payment processing

### Advanced Analytics:
- Staff activity logs
- User behavior tracking
- Revenue forecasting
- Performance metrics

### Client Portal:
- Project progress tracking
- Payment history
- Worker ratings
- Contract management

---

## Quick Commands Reference

### Make Someone Super Admin:
```sql
UPDATE users SET user_type = 'superadmin' WHERE email = 'you@email.com';
```

### Make Someone Admin Staff:
```sql
UPDATE users SET user_type = 'admin', is_staff = true WHERE email = 'staff@email.com';
```

### Remove Admin Access:
```sql
UPDATE users SET user_type = 'worker', is_staff = false WHERE email = 'user@email.com';
```

### List All Roles:
```sql
SELECT email, user_type, is_staff FROM users WHERE user_type != 'worker' AND user_type != 'client';
```

---

## URLs to Bookmark

- **Your Super Admin Portal:** `https://2ndshift.vercel.app/superadmin`
- **Admin Dashboard:** `https://2ndshift.vercel.app/admin`
- **User Management:** `https://2ndshift.vercel.app/admin/users`
- **Analytics:** `https://2ndshift.vercel.app/admin/analytics`
- **Supabase Dashboard:** `https://supabase.com/dashboard`

---

## ✅ Setup Complete Checklist

- [ ] Ran DATABASE_UPDATE_SUPERADMIN.sql
- [ ] Updated email in SQL to yours
- [ ] Verified you're superadmin in database
- [ ] Logged out and logged back in
- [ ] Can access `/superadmin` portal
- [ ] Tested adding admin staff
- [ ] Verified staff can access `/admin`
- [ ] Verified staff CANNOT access `/superadmin`
- [ ] Bookmarked admin URLs

---

**You're all set!** 🎉

You now have:
- ✅ Super Admin access (only you)
- ✅ Ability to manage admin staff
- ✅ Full platform control
- ✅ Secure access hierarchy

**Go to:** `https://2ndshift.vercel.app/superadmin` to get started!

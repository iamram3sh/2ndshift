# 🚀 Getting Started Checklist - 2ndShift

Use this checklist to get your 2ndShift platform up and running!

## ✅ Phase 1: Initial Setup (5 minutes)

- [ ] **Clone/Download the project**
  ```bash
  cd 2ndshift
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  ```

- [ ] **Create environment file**
  ```bash
  cp .env.example .env.local
  ```

- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Open browser and verify**
  - Visit http://localhost:3000
  - See the landing page with hero section
  - Click around to explore UI

## ✅ Phase 2: Database Setup (15 minutes)

### Create Supabase Project

- [ ] **Sign up at Supabase**
  - Go to https://supabase.com
  - Create free account
  - Create new project
  - Wait 2-3 minutes for setup

- [ ] **Get API credentials**
  - Go to Project Settings → API
  - Copy Project URL
  - Copy anon/public key
  - Copy service_role key (keep secret!)

- [ ] **Update .env.local**
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  ```

### Create Database Tables

- [ ] **Go to SQL Editor in Supabase**

- [ ] **Create users table**
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client', 'admin')),
    pan_number TEXT,
    phone TEXT,
    profile_visibility TEXT DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view own profile"
    ON users FOR SELECT USING (auth.uid() = id);
  
  CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE USING (auth.uid() = id);
  ```

- [ ] **Create projects table**
  ```sql
  CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    required_skills TEXT[] NOT NULL,
    duration_hours INTEGER NOT NULL,
    status TEXT DEFAULT 'open',
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Anyone can view open projects"
    ON projects FOR SELECT
    USING (status = 'open' OR client_id = auth.uid());
  
  CREATE POLICY "Clients can create projects"
    ON projects FOR INSERT
    WITH CHECK (client_id = auth.uid());
  
  CREATE POLICY "Clients can update own projects"
    ON projects FOR UPDATE
    USING (client_id = auth.uid());
  ```

- [ ] **Create remaining tables** (optional for now)
  - worker_profiles
  - contracts
  - payments
  - See README.md for full schema

### Configure Authentication

- [ ] **Disable email confirmation (for testing)**
  - Go to Authentication → Settings
  - Disable "Enable email confirmations"
  - (Re-enable for production!)

- [ ] **Test authentication**
  - Restart dev server: `npm run dev`
  - Try registering a test account
  - Check if user appears in auth.users

## ✅ Phase 3: Test Core Features (10 minutes)

### Test as Worker

- [ ] **Register as Worker**
  - Go to /register
  - Select "Find Work"
  - Fill form with test data
  - Register account

- [ ] **Login as Worker**
  - Go to /login
  - Login with credentials
  - Should redirect to /worker dashboard

- [ ] **Browse Projects**
  - Click "Browse Projects" or go to /projects
  - Should see empty state (no projects yet)

- [ ] **Update Profile**
  - Go to /profile
  - Update name, phone, PAN
  - Save changes
  - Verify changes persist

### Test as Client

- [ ] **Register as Client**
  - Logout (or use incognito)
  - Go to /register
  - Select "Hire Talent"
  - Register new account

- [ ] **Login as Client**
  - Login with client credentials
  - Should redirect to /client dashboard

- [ ] **Create a Project**
  - Click "Post New Project"
  - Fill in all fields:
    - Title: "Need React Developer"
    - Description: "Build a landing page"
    - Budget: 25000
    - Duration: 40 hours
    - Skills: Select 2-3 skills
  - Submit project

- [ ] **Verify Project Creation**
  - Should redirect to dashboard
  - Project should appear in "Your Projects"
  - Status should be "OPEN"

- [ ] **View Project Details**
  - Click on the project
  - See full details page
  - Verify all information is correct

### Test as Worker (Again)

- [ ] **Logout and login as Worker**
  
- [ ] **Browse Projects**
  - Go to /projects
  - Should now see the project created by client
  - Test search functionality
  - Test skill filters

- [ ] **View Project Details**
  - Click on project
  - See full details
  - Note: "Apply" button is UI only (backend pending)

## ✅ Phase 4: Optional Enhancements

### Set Up Razorpay (Optional)

- [ ] **Create Razorpay account**
  - Go to https://razorpay.com
  - Sign up for test account
  - Get test API keys

- [ ] **Add to .env.local**
  ```env
  RAZORPAY_KEY_ID=rzp_test_xxxxx
  RAZORPAY_SECRET=your_secret_key
  NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
  ```

### Create Admin User

- [ ] **Manually create admin in database**
  - Go to Supabase → Table Editor → users
  - Find your test user
  - Change user_type to 'admin'
  
- [ ] **Login and test admin dashboard**
  - Logout and login again
  - Should redirect to /admin
  - See platform statistics

## ✅ Phase 5: Production Preparation

### Code Quality

- [ ] **Run build test**
  ```bash
  npm run build
  ```
  - Should complete without errors

- [ ] **Run linter**
  ```bash
  npm run lint
  ```
  - Fix any warnings/errors

### Security

- [ ] **Review .env.local**
  - Ensure no secrets are committed to git
  - Verify .env.local is in .gitignore

- [ ] **Enable email confirmation**
  - Go to Supabase → Authentication → Settings
  - Enable email confirmations
  - Configure email templates

- [ ] **Set up custom email domain** (optional)
  - Configure SMTP settings
  - Add custom sender email

### Deployment

- [ ] **Choose hosting platform**
  - Recommended: Vercel (easiest for Next.js)
  - Alternative: Netlify, Railway, AWS

- [ ] **Connect to Git repository**
  - Push code to GitHub/GitLab
  - Connect repo to Vercel

- [ ] **Configure environment variables**
  - Add all .env.local variables to Vercel
  - Use production Supabase credentials

- [ ] **Deploy**
  - Trigger deployment
  - Wait for build to complete
  - Test production URL

## 📊 Success Criteria

After completing this checklist, you should have:

- ✅ Working local development environment
- ✅ Database with proper schema and RLS
- ✅ User registration and login working
- ✅ Project creation and browsing working
- ✅ Profile management working
- ✅ All three dashboards accessible
- ✅ Production-ready build passing
- ✅ (Optional) Deployed to production

## 🐛 Common Issues & Solutions

### Issue: "Supabase URL is required"
**Solution**: Make sure .env.local exists and has correct values. Restart dev server.

### Issue: "User profile not created"
**Solution**: Check if users table exists. Verify RLS policies allow inserts.

### Issue: "Cannot read projects"
**Solution**: Verify projects table exists. Check RLS policies. Make sure user is authenticated.

### Issue: "Build fails"
**Solution**: Run `rm -rf .next && npm run build`. Check for TypeScript errors.

### Issue: "Authentication not persisting"
**Solution**: Check browser cookies. Verify Supabase URL is correct.

## 📞 Need Help?

- 📖 Read the full documentation in README.md
- 🚀 Check QUICKSTART.md for quick setup
- 🏗️ See ARCHITECTURE.md for technical details
- 💻 Review DEVELOPMENT.md for development guidelines

## 🎉 Next Steps After Setup

Once everything is working:

1. **Review the codebase** - Understand the structure
2. **Customize the UI** - Update colors, branding
3. **Add remaining features** - See PROJECT_SUMMARY.md
4. **Set up CI/CD** - Automated testing and deployment
5. **Add analytics** - Track user behavior
6. **Implement payments** - Complete Razorpay integration

---

**Estimated Time**: 30-45 minutes total  
**Difficulty**: Easy to Medium  
**Prerequisites**: Node.js, basic terminal knowledge

Good luck! 🚀

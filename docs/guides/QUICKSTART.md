# 2ndShift - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

For quick testing without Supabase/Razorpay setup:
```bash
# Create .env.local with placeholder values (UI will work, but auth won't)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
SUPABASE_SERVICE_ROLE_KEY=placeholder-key
RAZORPAY_KEY_ID=placeholder-key
RAZORPAY_SECRET=placeholder-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=placeholder-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page!

## 📱 What You Can Do Now

### Without Database Setup (UI Only)
- ✅ View landing page with features
- ✅ Browse authentication pages (login/register)
- ✅ See dashboard UI layouts
- ✅ View project creation forms
- ✅ Explore profile page UI

### With Database Setup (Full Functionality)
- ✅ Register new accounts (Worker/Client)
- ✅ Login and role-based redirects
- ✅ Create and manage projects
- ✅ Browse available projects
- ✅ Update user profiles
- ✅ View dashboard statistics

## 🗄️ Setting Up Supabase (Required for Full Functionality)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### 2. Get Your API Keys
1. Go to Project Settings > API
2. Copy the following:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon/Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

### 3. Create Database Tables

Go to SQL Editor in Supabase and run:

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client', 'admin')),
  pan_number TEXT,
  phone TEXT,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'anonymous')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  required_skills TEXT[] NOT NULL,
  duration_hours INTEGER NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view open projects
CREATE POLICY "Anyone can view open projects"
  ON projects FOR SELECT
  USING (status = 'open' OR client_id = auth.uid());

-- Clients can create projects
CREATE POLICY "Clients can create projects"
  ON projects FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- Clients can update their own projects
CREATE POLICY "Clients can update own projects"
  ON projects FOR UPDATE
  USING (client_id = auth.uid());

-- Worker Profiles Table
CREATE TABLE worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  skills TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  availability_hours JSONB,
  portfolio_url TEXT,
  resume_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own profile"
  ON worker_profiles FOR ALL
  USING (user_id = auth.uid());

-- Contracts Table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  worker_id UUID NOT NULL REFERENCES users(id),
  contract_amount DECIMAL(10,2) NOT NULL,
  platform_fee_percentage DECIMAL(5,2) DEFAULT 10,
  platform_fee DECIMAL(10,2) NOT NULL,
  tds_percentage DECIMAL(5,2) DEFAULT 10,
  tds_amount DECIMAL(10,2) NOT NULL,
  worker_payout DECIMAL(10,2) NOT NULL,
  nda_signed BOOLEAN DEFAULT false,
  conflict_declaration_signed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  payment_from UUID NOT NULL REFERENCES users(id),
  payment_to UUID NOT NULL REFERENCES users(id),
  gross_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  tds_deducted DECIMAL(10,2) NOT NULL,
  gst_amount DECIMAL(10,2),
  net_amount DECIMAL(10,2) NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  invoice_url TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

### 4. Update .env.local
Replace placeholder values with your actual Supabase credentials.

## 💳 Setting Up Razorpay (Optional - For Payments)

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get Test API Keys from Dashboard
3. Add to .env.local:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_SECRET=your_secret_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

## 🧪 Testing the Application

### Test User Registration
1. Go to `/register`
2. Choose "Worker" or "Client"
3. Fill in details and register
4. Check email for verification (if Supabase email is configured)

### Test Worker Flow
1. Login as a worker
2. Browse projects at `/projects`
3. View project details
4. Update profile at `/profile`

### Test Client Flow
1. Login as a client
2. Create a new project at `/projects/create`
3. View your projects on dashboard
4. Manage project status

### Test Admin Flow
1. Manually set user_type to 'admin' in database
2. Login to view admin dashboard
3. See platform statistics

## 📂 Project Structure

```
app/
├── (auth)/              # Authentication pages
├── (dashboard)/         # Role-based dashboards
├── projects/            # Project management
├── profile/             # User profile
└── api/                 # API routes

components/
├── ui/                  # Reusable UI components
└── shared/              # Shared components

lib/
├── supabase/            # Supabase configuration
└── razorpay.ts          # Payment utilities

types/
└── database.types.ts    # TypeScript types
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Connection Issues
- Verify Supabase URL and keys in .env.local
- Check if tables are created
- Verify Row Level Security policies

### Authentication Not Working
- Confirm email verification is disabled in Supabase for testing
- Check browser console for errors
- Verify environment variables are loaded

## 🎯 Next Steps

1. ✅ Complete worker profile page
2. ✅ Implement application system
3. ✅ Add contract generation
4. ✅ Integrate payment processing
5. ✅ Build messaging system

## 📞 Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Happy Building! 🚀**

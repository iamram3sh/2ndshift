# 2ndShift - Legal Freelance Platform

India's First Legal, Tax-Compliant Freelance Platform for part-time contract work.

## 🚀 Features

### For Workers
- ✅ Browse and apply for projects
- ✅ Anonymous profile protection until hired
- ✅ Track earnings and active projects
- ✅ Automatic TDS deduction and Form 16A
- 🔄 Complete profile with skills and experience

### For Clients
- ✅ Post new projects with budget and requirements
- ✅ Manage active and completed projects
- ✅ View project applications
- ✅ Tax-compliant payment processing
- 🔄 Worker search and filtering

### For Admins
- ✅ Platform analytics dashboard
- ✅ User and project management
- ✅ Revenue tracking
- 🔄 Payment verification and reports

### Platform Features
- ✅ User authentication (Login/Register)
- ✅ Role-based dashboards (Worker/Client/Admin)
- ✅ Project management system
- ✅ Profile management
- ✅ Razorpay payment integration setup
- ✅ Responsive UI with Tailwind CSS
- 🔄 Contract generation (NDA, agreements)
- 🔄 Invoice generation
- 🔄 Payment processing
- 🔄 Messaging system

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Razorpay account (for payments)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 2ndshift
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

Create the following tables in your Supabase database:

#### Users Table
```sql
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
```

#### Projects Table
```sql
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
```

#### Worker Profiles Table
```sql
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
```

#### Contracts Table
```sql
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
```

#### Payments Table
```sql
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
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
2ndshift/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Registration page
│   ├── (dashboard)/
│   │   ├── worker/page.tsx         # Worker dashboard
│   │   ├── client/page.tsx         # Client dashboard
│   │   └── admin/page.tsx          # Admin dashboard
│   ├── projects/
│   │   ├── page.tsx                # Browse projects
│   │   ├── create/page.tsx         # Create new project
│   │   └── [id]/page.tsx           # Project details
│   ├── profile/page.tsx            # User profile
│   ├── api/
│   │   └── payments/
│   │       └── create-order/route.ts
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/
│   │   ├── Button.tsx              # Reusable button
│   │   ├── Input.tsx               # Reusable input
│   │   └── Card.tsx                # Reusable card
│   └── shared/
│       └── Navbar.tsx              # Navigation bar
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Supabase client
│   │   └── server.ts               # Supabase server
│   └── razorpay.ts                 # Razorpay utilities
└── types/
    └── database.types.ts           # TypeScript types
```

## 🎨 Key Features Implemented

### Authentication
- User registration with role selection (Worker/Client)
- Login with email/password
- Role-based redirects after login
- Automatic profile creation in database

### Dashboards
- **Worker Dashboard**: View stats, browse available projects
- **Client Dashboard**: View posted projects, create new projects
- **Admin Dashboard**: Platform analytics and management

### Project Management
- Create projects with budget, skills, duration
- Browse and filter projects by skills
- View detailed project information
- Apply for projects (UI ready)

### Profile Management
- View and edit personal information
- PAN number for tax compliance
- Phone number management
- Account status indicators

### UI Components
- Responsive design with Tailwind CSS
- Reusable Button, Input, and Card components
- Consistent styling across all pages
- Loading states and error handling

## 📚 Documentation

All project documentation has been organized in the `docs/` folder:

- **[Documentation Index](./docs/README.md)** - Complete guide to all documentation
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Visual diagram of complete project organization
- **[Before & After Comparison](./ORGANIZATION_BEFORE_AFTER.md)** - See the transformation
- **[Architecture](./docs/architecture/)** - System design and architecture
- **[Deployment](./docs/deployment/)** - Deployment guides and status
- **[Security](./docs/security/)** - Security audits and implementation
- **[Guides](./docs/guides/)** - Development, testing, and setup guides
- **[Checklists](./docs/checklists/)** - Pre-launch and deployment checklists
- **[Features](./docs/features/)** - Feature documentation and enhancements

### Database Scripts

All SQL scripts have been organized in the `database/` folder:

- **[Database Documentation](./database/README.md)** - Database scripts overview
- **[Schema](./database/schema/)** - Database schema and setup scripts (6 files)
- **[Sample Data](./database/sample-data/)** - Test and sample data scripts (7 files)
- **[Fixes](./database/fixes/)** - Maintenance and fix scripts (9 files)
- **[Migrations](./database/migrations/)** - Database migration scripts (2 files)

### Quick Links
- [Quick Start Guide](./docs/guides/QUICKSTART.md)
- [Development Guide](./docs/guides/DEVELOPMENT.md)
- [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md)
- [Security Checklist](./docs/security/SECURITY_CHECKLIST.md)
- [Database Setup](./database/README.md)

## 🔜 Next Steps

### High Priority
1. **Worker Profile Completion**: Add skills, experience, portfolio
2. **Application System**: Allow workers to apply for projects
3. **Contract Generation**: Create NDAs and work agreements
4. **Payment Integration**: Complete Razorpay payment flow
5. **Messaging System**: Client-worker communication

### Medium Priority
6. **Invoice Generation**: Auto-generate invoices with TDS details
7. **Form 16A Generation**: Tax certificate generation
8. **File Upload**: Resume, portfolio, documents
9. **Notifications**: Email and in-app notifications
10. **Reviews & Ratings**: Worker and client reviews

### Low Priority
11. **Advanced Search**: Filter by budget, skills, location
12. **Analytics**: Detailed reports for users and admin
13. **Mobile App**: React Native app
14. **Multi-language**: Hindi and regional languages

## 🐛 Known Issues

- Payment integration is stubbed out (501 Not Implemented)
- Worker profile completion page needs implementation
- Application submission flow needs backend logic
- Contract signing flow not implemented

## 📝 License

This is a proprietary project for 2ndShift.

## 🤝 Contributing

This is a private project. For questions, contact the development team.

---

Built with ❤️ for Indian freelancers and businesses

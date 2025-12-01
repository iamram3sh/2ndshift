# 2ndShift

**India's Premier Tax-Compliant Freelance Platform**

Work on your terms. Get paid with confidence. TDS & GST handled automatically.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
├── app/                    # Next.js pages & API routes
│   ├── (auth)/            # Login & Register
│   ├── (dashboard)/       # Worker, Client, Admin dashboards
│   ├── api/               # 20 API endpoints
│   ├── features/          # How It Works page
│   ├── for-workers/       # For Professionals page
│   ├── employers/         # For Employers page
│   └── ...
├── components/            # React components
│   ├── escrow/           # Payment escrow components
│   ├── shifts/           # Shifts currency components
│   ├── trust/            # Trust score components
│   └── ...
├── lib/                   # Core libraries
│   ├── shifts.ts         # Shifts currency system
│   ├── escrow.ts         # Payment escrow
│   ├── trust-score.ts    # Trust & ratings
│   └── ...
├── database/             # SQL schemas & migrations
└── docs/                 # Documentation
```

---

## ✨ Features

### For Professionals
- **Escrow Protection** - Payment locked before work starts
- **Weekly Payouts** - Get paid every Thursday
- **Tax Compliance** - TDS, GST, Form 16A automated
- **Trust Scores** - Build reputation with ratings
- **Shifts Credits** - Boost profile visibility

### For Employers
- **Verified Talent** - Background-checked professionals
- **Escrow Payments** - Pay only when satisfied
- **Milestone Support** - Split large projects into phases
- **Compliance Handled** - No tax paperwork
- **ROI Calculator** - See cost savings

---

## 🗄️ Database Setup

Run these SQL files in Supabase SQL Editor (in order):

1. `database/schema/complete_schema.sql`
2. `database/migrations/shifts_and_subscriptions.sql`
3. `database/migrations/innovative_features.sql`
4. `database/migrations/payment_escrow_system.sql`
5. `database/migrations/professional_categories.sql`

---

## 🚀 Deployment

### Deploy to Vercel
```bash
# Option 1: Use deploy script
./deploy.sh

# Option 2: Push to GitHub (auto-deploys if connected)
git push origin main

# Option 3: Manual Vercel deploy
npx vercel --prod
```

### Environment Variables (Vercel)
Add these in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_APP_URL`

---

## 📊 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Razorpay |
| Hosting | Vercel |

---

## 📄 Documentation

- **[Launch Playbook](docs/LAUNCH_PLAYBOOK.md)** - Complete 14-day launch guide

---

## 🔗 Key URLs

| Page | Path |
|------|------|
| Home | `/` |
| For Professionals | `/for-workers` |
| For Employers | `/employers` |
| How It Works | `/features` |
| Pricing | `/pricing` |
| Find Talent | `/workers` |
| Browse Jobs | `/jobs` |
| Worker Dashboard | `/worker` |
| Client Dashboard | `/client` |

---

## 📞 Support

- **Email**: support@2ndshift.in
- **Location**: Hyderabad, India

---

© 2025 2ndShift Technologies

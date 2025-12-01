# Database Setup

## Quick Setup

Run these SQL files in **Supabase SQL Editor** in order:

### Step 1: Core Schema
```sql
-- Run: database/schema/complete_schema.sql
```

### Step 2: Migrations (in order)
```sql
-- 1. database/migrations/shifts_and_subscriptions.sql
-- 2. database/migrations/innovative_features.sql
-- 3. database/migrations/payment_escrow_system.sql
-- 4. database/migrations/professional_categories.sql
```

## Files

| File | Purpose |
|------|---------|
| `schema/complete_schema.sql` | Core tables (users, projects, contracts, payments) |
| `migrations/shifts_and_subscriptions.sql` | Shifts currency & subscription plans |
| `migrations/innovative_features.sql` | Smart Match, TaxMate, EarlyPay, Trust Scores |
| `migrations/payment_escrow_system.sql` | Escrow & milestone payments |
| `migrations/professional_categories.sql` | Industries, skills, ratings |

## Make Admin User

After registering, run:
```sql
UPDATE users SET user_type = 'admin' WHERE email = 'your-email@example.com';
```

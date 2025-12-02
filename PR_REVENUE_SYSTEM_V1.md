# Revenue System V1 - Pull Request

## Summary
Complete revenue system implementation for 2ndShift including commission calculation, Shift Credits, subscriptions, escrow fees, and comprehensive UI components.

## Features Implemented

### 1. Platform Commission System ✅
- **Worker Commission:**
  - First 3 jobs: 0% commission (tracked via `worker_job_counts` table)
  - Verified workers: 5% commission
  - Unverified workers: 10% commission
- **Client Commission:**
  - Regular payments: 4% commission
  - Micro tasks: ₹49 flat fee
  - Subscribers: 0% commission (removed for subscription holders)
- **API:** `/api/revenue/calculate-commission` - Calculates commissions based on worker/client status

### 2. Shift Credits System ✅
- **Credits Model:** Complete tracking system with balance, purchases, and transaction history
- **Job Applications:** 3 credits required per application
- **Refund Policy:** Credits automatically refunded if:
  - Client cancels the project
  - Client doesn't view the proposal within 7 days
- **Purchase Packages:**
  - ₹49 = 10 credits
  - ₹99 = 25 credits (Most Popular)
  - ₹199 = 60 credits
  - ₹399 = 140 credits
- **APIs:**
  - `POST /api/applications/apply` - Apply to job (deducts 3 credits)
  - `POST /api/applications/refund-credits` - Refund credits
  - `GET /api/shifts/balance` - Get current balance
  - `POST /api/shifts/purchase` - Purchase credits (Razorpay integration)
  - `POST /api/shifts/verify` - Verify payment

### 3. Worker Subscriptions ✅
- **Starter ₹199/mo:**
  - 8% commission (reduced from 10%)
  - 20 Shifts/month included
  - Profile boost (1 week/month)
  - Basic badges
- **Pro ₹499/mo:**
  - 5% commission
  - 50 Shifts/month included
  - Permanent profile boost
  - Verified badges
  - Ranking boost
  - Instant payout
- **Elite ₹999/mo:**
  - 0% commission
  - 100 Shifts/month included
  - Elite badge
  - Top ranking boost
  - Instant payout
  - Dedicated account manager

### 4. Client Subscriptions ✅
- **Growth ₹999/mo:**
  - 0% platform commission
  - 30 Shifts/month included
  - Featured job listings
  - Priority matching
  - Advanced analytics
- **Pro Agency ₹2999/mo:**
  - 0% platform commission
  - 100 Shifts/month included
  - Multi-seat support (up to 5 users)
  - Unlimited featured listings
  - Custom integrations (API)
  - Dedicated account manager

### 5. Escrow Fee ✅
- **2% escrow fee** from clients on all payments
- Added to payment calculation flow
- Tracked in `payments` table with `escrow_fee_percent` and `escrow_fee_amount` fields

### 6. Revenue UI Components ✅
- **ShiftsHeaderIndicator:** Shows credits balance in header for workers (near user menu)
- **BuyCreditsModal:** Complete modal for purchasing credits with Razorpay integration
- **PricingSection:** Displays commission structure, credits info, and subscription benefits
- **Updated Navbar:** Added Shifts indicator for workers
- **Updated Client/Worker Pages:** Added pricing sections showing revenue structure

## Database Changes

### Migration: `database/migrations/revenue_system_v1.sql`

**New Tables:**
- `worker_job_counts` - Tracks completed jobs for first 3 jobs exemption
- `applications` - Tracks job applications and credits usage

**Updated Tables:**
- `contracts` - Added commission tracking fields
- `payments` - Added escrow fee fields
- `shifts_packages` - Updated to new pricing (₹49=10, ₹99=25, ₹199=60, ₹399=140)
- `subscription_plans` - Updated with new worker/client subscription tiers

**New Functions:**
- `calculate_worker_commission()` - Calculates worker commission based on verification and job count
- `calculate_client_commission()` - Calculates client commission based on subscription and task type
- `calculate_escrow_fee()` - Calculates 2% escrow fee
- `update_worker_job_count()` - Updates job count on contract completion

**New Triggers:**
- `trigger_contract_completed` - Automatically updates job count when contract is completed

## Files Changed

### New Files (12)
- `database/migrations/revenue_system_v1.sql` - Complete database migration
- `lib/revenue/commission.ts` - Commission calculation utilities
- `app/api/revenue/calculate-commission/route.ts` - Commission calculation API
- `app/api/applications/apply/route.ts` - Job application API (deducts credits)
- `app/api/applications/refund-credits/route.ts` - Credits refund API
- `components/revenue/ShiftsHeaderIndicator.tsx` - Header credits indicator
- `components/revenue/BuyCreditsModal.tsx` - Credits purchase modal
- `components/revenue/PricingSection.tsx` - Pricing information component
- `REVENUE_SYSTEM_V1.md` - Implementation documentation
- `PR_REVENUE_SYSTEM_V1.md` - This PR description

### Modified Files (4)
- `components/shared/Navbar.tsx` - Added Shifts indicator for workers
- `app/clients/ClientPageContent.tsx` - Added pricing section
- `app/work/WorkerPageContent.tsx` - Added pricing section

## Testing

### Manual Testing Required
1. ✅ Commission calculation for different worker/client scenarios
2. ✅ Credits deduction on job application
3. ✅ Credits refund when client cancels/doesn't view
4. ✅ Subscription benefits (commission removal)
5. ✅ Escrow fee calculation
6. ✅ Shifts purchase flow (Razorpay integration)
7. ✅ Header indicator display for workers

### E2E Tests Needed
- [ ] Commission calculation test
- [ ] Credits deduction on job application
- [ ] Credits refund flow
- [ ] Subscription benefits verification
- [ ] Escrow fee in payment flow

## Deployment Checklist

- [ ] Run database migration: `database/migrations/revenue_system_v1.sql`
- [ ] Verify Razorpay keys are configured
- [ ] Seed subscription plans in database
- [ ] Initialize worker job counts for existing users
- [ ] Test payment flow end-to-end
- [ ] Verify commission calculations
- [ ] Test credits purchase and refund flows

## Breaking Changes

⚠️ **Requires Database Migration**
- Must run `database/migrations/revenue_system_v1.sql` before deployment
- Existing contracts will need commission fields populated
- Existing workers need job count initialized

## Screenshots

### Shifts Indicator in Header
- Shows credits balance for workers
- Clickable link to credits management

### Pricing Sections
- Worker page shows commission structure, credits info, and subscriptions
- Client page shows commission structure, escrow fee, and subscriptions

### Buy Credits Modal
- Package selection
- Razorpay payment integration
- Transaction history

## Related Issues
- Implements complete revenue system
- Adds Shift Credits (Upwork Connects equivalent)
- Adds subscription tiers for workers and clients
- Adds escrow fee for payment protection

## Next Steps
1. Add comprehensive E2E tests
2. Integrate escrow fee into payment checkout flow
3. Add subscription management UI
4. Add commission breakdown in worker/client dashboards
5. Add analytics for revenue tracking

---

**Branch:** `revenue-system-v1`  
**Base:** `main`  
**Ready for Review:** ✅


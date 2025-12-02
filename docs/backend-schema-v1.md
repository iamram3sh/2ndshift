# 2ndShift V1 - Backend Schema & API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Authentication](#authentication)
5. [Commission & Credits Flow](#commission--credits-flow)
6. [Matching Algorithm](#matching-algorithm)
7. [Admin Workflows](#admin-workflows)
8. [Security Checklist](#security-checklist)
9. [Payment Provider Integration](#payment-provider-integration)
10. [Deployment](#deployment)

## Overview

This document describes the complete backend schema and API structure for 2ndShift V1 - a high-skill IT microtask marketplace platform.

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma (optional, SQL migrations provided)
- **Authentication**: JWT + httpOnly refresh cookies
- **Payment**: Razorpay/Stripe (stubbed)
- **Testing**: Jest

## Database Schema

### Core Tables

#### Users
- `id` (UUID, PK)
- `email` (unique)
- `phone`
- `full_name`
- `user_type` (enum: worker, client, admin)
- `password_hash`
- `profile_complete` (boolean)
- `email_verified`, `phone_verified`
- `last_active_at`
- `created_at`, `updated_at`

#### Profiles (Worker-specific)
- `id` (UUID, PK)
- `user_id` (FK → users)
- `headline`, `bio`, `location`
- `availability` (JSONB)
- `hourly_rate_min`, `hourly_rate_max`
- `verified_level` (enum: none, basic, professional, premium)
- `score` (float)
- `skills` (JSONB array)
- `portfolio_links` (JSONB array)

#### Categories
- `id` (UUID, PK)
- `slug` (unique)
- `name`, `description`
- `parent_id` (nullable, FK → categories)
- `icon`
- `is_active` (boolean)

#### Microtasks (Catalog)
- `id` (UUID, PK)
- `category_id` (FK → categories)
- `title`, `slug` (unique)
- `description`
- `complexity` (enum: beginner, intermediate, advanced, expert)
- `delivery_window` (enum: 6-24h, 3-7d, 1-4w, 1-6m)
- `base_price_min`, `base_price_max`
- `default_commission_percent`

#### Jobs
- `id` (UUID, PK)
- `client_id` (FK → users)
- `title`, `description`
- `category_id` (FK → categories)
- `microtask_id` (nullable, FK → microtasks)
- `custom` (boolean)
- `status` (enum: draft, open, assigned, in_progress, completed, disputed, cancelled)
- `price_fixed`, `price_currency`
- `delivery_deadline`, `delivery_window`
- `escrow_id` (nullable, FK → escrows)
- `required_skills` (array)
- `created_at`, `updated_at`

#### Applications (Proposals)
- `id` (UUID, PK)
- `project_id` (FK → jobs)
- `worker_id` (FK → users)
- `cover_text`
- `credits_used` (int, default 3)
- `proposed_price`, `proposed_delivery`
- `status` (enum: pending, accepted, rejected, withdrawn)
- `submitted_at`, `reviewed_at`

#### Assignments
- `id` (UUID, PK)
- `job_id` (FK → jobs)
- `worker_id` (FK → users)
- `assigned_at`, `started_at`, `completed_at`
- `status` (enum: assigned, in_progress, completed, delivered, approved, rejected)

#### Shift Credits
- `id` (UUID, PK)
- `user_id` (FK → users, unique)
- `balance` (int, >= 0)
- `reserved` (int, >= 0)

#### Credit Transactions
- `id` (UUID, PK)
- `user_id` (FK → users)
- `change` (int, positive for credits added, negative for deducted)
- `reason` (enum: purchase, apply, refund, admin_adjust, subscription_bonus, referral)
- `reference_id` (nullable, links to job_id, payment_id, etc.)
- `meta` (JSONB)

#### Escrows
- `id` (UUID, PK)
- `job_id` (FK → jobs, unique)
- `client_id` (FK → users)
- `amount`, `currency`
- `status` (enum: created, funded, released, refunded)
- `provider_reference`

#### Commissions
- `id` (UUID, PK)
- `job_id` (FK → jobs)
- `amount`, `percent`
- `charged_to` (enum: client, worker, both)

### Indexes

- GIN indexes on JSONB fields (skills, availability)
- Text search indexes on microtask title & description
- Indexes on foreign keys and status fields
- Composite indexes for common queries

## API Endpoints

### Authentication

#### POST /api/v1/auth/register
Register a new user.

**Request:**
```json
{
  "role": "worker" | "client" | "admin",
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "worker"
  }
}
```

#### POST /api/v1/auth/login
Login user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register (sets httpOnly refresh token cookie)

#### POST /api/v1/auth/refresh
Refresh access token using refresh token from cookie.

**Response:**
```json
{
  "access_token": "eyJhbGc..."
}
```

#### POST /api/v1/auth/logout
Logout user (clears refresh token cookie).

#### GET /api/v1/auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "worker",
    "profile": { ... }
  }
}
```

### Jobs

#### GET /api/v1/jobs
List jobs with filters.

**Query Parameters:**
- `role`: worker | client
- `status`: draft | open | assigned | ...
- `category_id`: UUID
- `limit`: number (default 20)
- `offset`: number (default 0)

#### POST /api/v1/jobs
Create a new job (client only).

**Request:**
```json
{
  "title": "Build React Component",
  "description": "Create a reusable component library",
  "category_id": "uuid",
  "microtask_id": "uuid",
  "price_fixed": 10000,
  "delivery_window": "1-4w"
}
```

#### GET /api/v1/jobs/:id
Get job details.

#### POST /api/v1/jobs/:id/apply
Apply to a job (worker only, requires Shift Credits).

**Request:**
```json
{
  "cover_text": "I'm interested...",
  "proposed_price": 10000,
  "proposed_delivery": "2024-01-15T00:00:00Z"
}
```

#### POST /api/v1/jobs/:id/accept-proposal
Accept a proposal (client only).

**Request:**
```json
{
  "application_id": "uuid"
}
```

#### POST /api/v1/jobs/:id/deliver
Mark job as delivered (worker only).

**Request:**
```json
{
  "delivery_notes": "Completed as requested",
  "attachments": ["https://example.com/file.pdf"]
}
```

#### POST /api/v1/jobs/:id/approve
Approve job and release escrow (client only).

### Shift Credits

#### GET /api/v1/credits/balance
Get user's Shift Credits balance.

**Response:**
```json
{
  "balance": 50,
  "reserved": 3,
  "available": 47
}
```

#### POST /api/v1/credits/purchase
Purchase Shift Credits (creates payment intent).

**Request:**
```json
{
  "package_id": "uuid"
}
```

**Response:**
```json
{
  "payment_intent_id": "pi_...",
  "amount": 9900,
  "credits": 25,
  "client_secret": "stub_client_secret"
}
```

### Matching

#### POST /api/v1/matching/auto-match
Auto-match workers to a job.

**Request:**
```json
{
  "job_id": "uuid"
}
```

**Response:**
```json
{
  "job_id": "uuid",
  "matches": [
    {
      "id": "worker-uuid",
      "match_score": 0.95,
      "skill_overlap": 3,
      ...
    }
  ],
  "count": 10
}
```

#### POST /api/v1/matching/suggest-workers
Suggest workers based on raw text (LLM stub).

**Request:**
```json
{
  "raw_text": "I need a React developer to build a dashboard",
  "limit": 10
}
```

### Categories & Microtasks

#### GET /api/v1/categories
List all active categories.

#### GET /api/v1/categories/:id/microtasks
List microtasks for a category.

### Admin

#### GET /api/v1/admin/jobs
List all jobs (admin only).

#### GET /api/v1/admin/users
List all users (admin only).

#### POST /api/v1/admin/verifications/:id/approve
Approve verification (admin only).

## Authentication

### JWT Token Flow

1. User registers/logs in → receives access token (15min expiry) + refresh token cookie (7 days)
2. Client includes access token in `Authorization: Bearer <token>` header
3. When access token expires, client calls `/api/v1/auth/refresh` → receives new access token
4. Refresh token is rotated on each refresh for security

### Middleware

- `requireAuth`: Verifies access token
- `requireRole('worker'|'client'|'admin')`: Verifies token + role

## Commission & Credits Flow

### Commission Rules

- **Worker Commission:**
  - First 3 jobs: 0%
  - Verified workers: 5%
  - Unverified workers: 10%

- **Client Commission:**
  - Subscribers: 0%
  - Microtasks: ₹49 flat fee
  - Regular jobs: 4%

- **Escrow Fee:** 2% from clients

### Credits Flow

1. Worker applies to job → 3 credits reserved
2. If application rejected/withdrawn → credits refunded
3. If job cancelled → credits refunded
4. If application accepted → credits consumed

## Matching Algorithm

### Scoring Formula

```
match_score = (skill_match_score * 0.5) + verified_score + profile_score

Where:
- skill_match_score = skill_overlap / required_skills.length
- verified_score = premium: 0.3, professional: 0.2, basic: 0.1, none: 0
- profile_score = (worker.score / 100) * 0.2
```

### Missing Microtask Detector

When no workers match a job category:
1. Client submits raw text description
2. LLM classifies: skills, urgency, complexity, suggested category
3. Admin notified to create new microtask/category

## Admin Workflows

### Verification Review
1. Worker submits verification (identity, skill, microtask)
2. Admin reviews via `/api/v1/admin/verifications`
3. Admin approves/rejects via `/api/v1/admin/verifications/:id/approve`

### Dispute Resolution
1. Client/worker opens dispute on job
2. Admin reviews via `/api/v1/admin/jobs/:id`
3. Admin can refund escrow, adjust commissions, etc.

## Security Checklist

- [x] JWT tokens with short expiry (15min)
- [x] httpOnly refresh tokens (7 days)
- [x] Password hashing (bcrypt, 10 rounds)
- [x] Row Level Security (RLS) on Supabase tables
- [x] Rate limiting (via middleware)
- [x] Input validation (Zod schemas)
- [x] SQL injection prevention (parameterized queries)
- [ ] PII encryption (TODO: encrypt sensitive fields)
- [ ] Token rotation on refresh
- [ ] CORS configuration
- [ ] HTTPS only in production

## Payment Provider Integration

### Razorpay Integration (TODO)

1. Replace stub in `/api/v1/credits/purchase`:
```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const order = await razorpay.orders.create({
  amount: packageData.price_inr,
  currency: 'INR',
  receipt: purchase.id,
});
```

2. Add webhook handler at `/api/v1/payments/webhook`:
```typescript
// Verify signature
const crypto = require('crypto');
const signature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature === req.headers['x-razorpay-signature']) {
  // Process payment
}
```

### Stripe Integration (Alternative)

Similar pattern, use Stripe SDK instead.

## Deployment

### Prerequisites

1. PostgreSQL database (Supabase recommended)
2. Redis (for background jobs, optional)
3. S3 or Supabase Storage (for file uploads)
4. Payment provider account (Razorpay/Stripe)

### Steps

1. **Set environment variables:**
   ```bash
   cp .env.example .env
   # Fill in all required values
   ```

2. **Run migrations:**
   ```bash
   # SQL migrations (Supabase)
   psql $DATABASE_URL < database/migrations/backend_schema_v1_complete.sql

   # Or Prisma migrations
   npm run prisma:migrate
   ```

3. **Seed database:**
   ```bash
   npm run prisma:seed
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   npm start
   ```

### Staging Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Seed data populated
- [ ] Payment provider configured
- [ ] Email service configured
- [ ] File storage configured
- [ ] Rate limiting enabled
- [ ] Monitoring/logging setup
- [ ] Backup strategy in place

## Testing

### Run Tests

```bash
npm test
npm run test:coverage
```

### Test Coverage

- Unit tests: Auth, commission calculation, matching algorithm
- Integration tests: Job lifecycle, credits flow
- E2E tests: Full user workflows

## API Documentation

OpenAPI/Swagger spec available at `/api/docs` (TODO: implement Swagger UI).

## Support

For questions or issues, contact the development team or create an issue in the repository.

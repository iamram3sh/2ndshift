# 🚀 Demo/Staging Setup Guide

## Overview

This guide explains how to set up and run the 2ndShift V1 demo/staging environment with all features working end-to-end using demo stubs for external services.

---

## 🎯 What's Implemented

### ✅ Complete Features
- **API Client Service Layer** - Centralized `/api/v1` client
- **Demo Payment Simulator** - Local Razorpay stub
- **Demo File Storage** - Local file storage in `tmp/uploads`
- **Demo Email Service** - Email capture with preview endpoint
- **Frontend Integration** - Login/Register migrated to v1 API
- **Enhanced Seed Script** - Comprehensive demo data
- **E2E Tests** - Complete job lifecycle testing

---

## 📋 Prerequisites

1. **Node.js** 18+ installed
2. **Supabase** database configured
3. **Environment Variables** set (see below)

---

## 🔧 Environment Variables

Create `.env.local` with:

```env
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-jwt-secret-change-in-production
REFRESH_SECRET=your-refresh-secret-change-in-production

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Demo Mode (set to 'true' to enable demo features in production)
ALLOW_DEMO_PAYMENTS=false
ALLOW_DEMO_EMAILS=false

# Production Services (for when ready)
RAZORPAY_KEY_ID=demo_sk_test_placeholder
RAZORPAY_KEY_SECRET=demo_sk_test_placeholder
RESEND_API_KEY=re_demo_placeholder
S3_BUCKET=demo-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY=demo_access_key
S3_SECRET_KEY=demo_secret_key
```

---

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Database Migration

```bash
# In Supabase SQL Editor, run:
# database/migrations/backend_schema_v1_complete.sql
```

Or use the migration script:
```bash
npm run migrate
```

### 3. Seed Demo Data

```bash
npm run seed:demo
```

This creates:
- 5 clients
- 20 workers (with profiles and credits)
- 5 categories
- 15 microtasks
- 5 open jobs
- 1 admin user

**Demo Credentials:**
- Client: `client1@demo.2ndshift.com` / `password123`
- Worker: `worker1@demo.2ndshift.com` / `password123`
- Admin: `admin@demo.2ndshift.com` / `password123`

### 4. Start Development Server

```bash
npm run dev
```

### 5. Run Tests

```bash
# API structure verification
npm run verify:api

# API integration tests
npm run test:api

# E2E tests (requires server running)
npm run test:e2e
```

---

## 🧪 Testing the Demo

### Complete Job Lifecycle

1. **Login as Client**
   - Email: `client1@demo.2ndshift.com`
   - Password: `password123`

2. **Create a Job**
   - Navigate to job creation
   - Select a microtask from catalog
   - Set price and delivery window
   - Submit

3. **Login as Worker**
   - Email: `worker1@demo.2ndshift.com`
   - Password: `password123`

4. **Apply to Job**
   - Browse available jobs
   - Apply (credits automatically deducted)
   - Add cover letter and proposed price

5. **Client Accepts Proposal**
   - Login as client
   - View applications
   - Accept proposal

6. **Fund Escrow (Demo Payment)**
   - Demo payment automatically succeeds
   - Escrow status: `funded`

7. **Worker Delivers**
   - Login as worker
   - Mark job as delivered
   - Upload files (stored in `tmp/uploads`)

8. **Client Approves**
   - Login as client
   - Approve delivery
   - Escrow released, commission calculated

---

## 🔍 Demo Features

### Payment Simulator

**Endpoint**: `POST /api/payments/demo`

Always succeeds in demo mode. Returns:
```json
{
  "success": true,
  "payment_id": "demo_pay_...",
  "order_id": "demo_order_...",
  "status": "captured",
  "demo": true
}
```

### File Storage

**Upload**: `POST /api/upload`
**Serve**: `GET /api/storage/demo/[key]`

Files stored in `./tmp/uploads/` with 7-day retention.

### Email Preview

**Endpoint**: `GET /api/dev/emails`

View all captured emails:
```json
{
  "emails": [...],
  "count": 5
}
```

View specific email:
```
GET /api/dev/emails?id=email_id
```

Clear emails:
```
GET /api/dev/emails?clear=true
```

---

## 📊 API Client Usage

### In Frontend Components

```typescript
import apiClient from '@/lib/apiClient';

// Login
const result = await apiClient.login(email, password);

// Get jobs
const { data, error } = await apiClient.listJobs({ status: 'open' });

// Create job
const { data, error } = await apiClient.createJob({
  title: 'My Job',
  description: 'Job description',
  category_id: '...',
  price_fixed: 5000,
});

// Apply to job
const { data, error } = await apiClient.applyToJob(jobId, {
  cover_text: 'I am interested',
  proposed_price: 4500,
});
```

---

## 🔄 Migration Status

### ✅ Migrated to v1 API
- Authentication (login/register)
- API client service layer created

### ⚠️ Partially Migrated
- Job management (backend ready, frontend needs updates)
- Credits system (backend ready, frontend needs updates)

### 📝 Migration Guide

See `MIGRATION_TO_V1.md` for detailed migration steps for remaining components.

---

## 🐛 Troubleshooting

### Issue: "Module not found: uuid"
**Solution**: The storage demo uses `crypto.randomUUID()` which is built-in. No uuid package needed.

### Issue: "Cannot find module '@/lib/apiClient'"
**Solution**: Ensure TypeScript paths are configured in `tsconfig.json`.

### Issue: "Demo payment not working"
**Solution**: Check `NODE_ENV` and `ALLOW_DEMO_PAYMENTS` environment variables.

### Issue: "Files not uploading"
**Solution**: Ensure `tmp/uploads` directory exists and is writable.

---

## 🚀 Production Deployment

### Before Going Live

1. **Replace Demo Stubs**:
   - [ ] Integrate real Razorpay
   - [ ] Set up S3/Supabase Storage
   - [ ] Integrate Resend for emails
   - [ ] Set up Redis/Bull for background workers

2. **Environment Variables**:
   - [ ] Set production database URL
   - [ ] Set production JWT secrets
   - [ ] Add Razorpay production keys
   - [ ] Add S3 credentials
   - [ ] Add Resend API key
   - [ ] Set `ALLOW_DEMO_PAYMENTS=false`
   - [ ] Set `ALLOW_DEMO_EMAILS=false`

3. **Security**:
   - [ ] Enable rate limiting
   - [ ] Configure CORS
   - [ ] Set security headers
   - [ ] Enable HTTPS only

4. **Monitoring**:
   - [ ] Set up error tracking (Sentry)
   - [ ] Set up application monitoring
   - [ ] Configure logging

---

## 📝 Next Steps

1. **Complete Frontend Migration**: Update remaining components to use v1 API
2. **Real Payment Integration**: Replace Razorpay stub
3. **File Storage**: Set up S3/Supabase Storage
4. **Email Service**: Integrate Resend
5. **Background Workers**: Set up Redis/Bull
6. **E2E Testing**: Expand test coverage

---

## 🎉 Demo Credentials

**Client Account:**
- Email: `client1@demo.2ndshift.com`
- Password: `password123`

**Worker Account:**
- Email: `worker1@demo.2ndshift.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@demo.2ndshift.com`
- Password: `password123`

---

**Status**: ✅ Demo environment ready for testing
**Last Updated**: Current Session

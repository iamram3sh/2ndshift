# Phase A: Verification System - Analysis & Specification

**Date:** 2025-01-XX  
**Status:** Awaiting Approval  
**Author:** Senior Product Engineer

---

## Executive Summary

This document outlines the complete analysis and specification for implementing a comprehensive 3-tier verification system for 2ndShift platform. The system will cover Worker Verification (3-tier), Client Verification, visibility rules, payment verification (escrow-ready), privacy/legal constraints, and trust badges.

---

## 1. Current State Analysis

### Existing Verification Infrastructure

**Current Tables:**
- `verification_requests` - Basic identity verification requests (exists but limited)
- `verifications` - Individual verification records (email, phone, pan, aadhar, bank_account)
- `worker_profiles.is_verified` - Boolean flag (legacy)
- `worker_profiles.verification_status` - Simple status enum

**Current Components:**
- `/app/(dashboard)/worker/profile/verification/page.tsx` - Basic ID upload page
- `/components/verification/VerificationBadge.tsx` - Badge display component
- `/components/verification/VerificationForm.tsx` - Basic verification form
- `/components/admin/VerificationQueue.tsx` - Admin review queue

**Current Storage:**
- Supabase Storage bucket: `verification-documents`
- Supabase Storage bucket: `profile-photos`

**Current API Routes:**
- None specifically for verification (uses direct Supabase calls)

**Gaps Identified:**
1. No 3-tier verification system (Level 1: Identity, Level 2: Skills, Level 3: Video)
2. No face-match integration
3. No OTP verification system
4. No skill proof upload system
5. No microtask testing system
6. No video verification
7. No client verification system
8. No payment verification for clients
9. No escrow-ready payment verification
10. No badge system with proper visibility rules
11. No audit logging for verification actions
12. No appeal system

---

## 2. Files to Change/Add

### 2.1 New Database Migrations

**File:** `database/migrations/verification_system_v2.sql`
- New tables: `verifications_v2`, `skill_proofs`, `microtasks`, `microtask_submissions`, `client_verifications`, `badges`, `verification_audit_logs`, `verification_appeals`
- Updates to existing tables: Add columns to `worker_profiles`, `users`
- New indexes and triggers

**File:** `database/migrations/seed_microtasks.sql`
- Seed data for initial microtask tests

### 2.2 New API Routes

**Directory:** `app/api/verification/`

1. **`identity/upload/route.ts`** - POST - Upload ID documents
2. **`identity/face-match/route.ts`** - POST - Submit selfie for face matching
3. **`otp/send/route.ts`** - POST - Send OTP to email/phone
4. **`otp/verify/route.ts`** - POST - Verify OTP
5. **`skill/upload/route.ts`** - POST - Upload skill proof (GitHub, deployment, file)
6. **`microtask/list/route.ts`** - GET - List available microtasks
7. **`microtask/submit/route.ts`** - POST - Submit microtask solution
8. **`video/upload/route.ts`** - POST - Upload video verification
9. **`status/[userId]/route.ts`** - GET - Get verification status for user
10. **`appeal/create/route.ts`** - POST - Create appeal for rejected verification
11. **`badges/[userId]/route.ts`** - GET - Get badges for user

**Directory:** `app/api/client/verification/`

1. **`payment/route.ts`** - POST - Verify client payment method (mock Stripe/UPI)
2. **`business/route.ts`** - POST - Submit business verification documents
3. **`status/[clientId]/route.ts`** - GET - Get client verification status

**Directory:** `app/api/admin/verifications/`

1. **`route.ts`** - GET - List all verifications (with filters)
2. **`[id]/route.ts`** - GET, PATCH - Get/Update specific verification
3. **`[id]/approve/route.ts`** - POST - Approve verification
4. **`[id]/reject/route.ts`** - POST - Reject verification
5. **`[id]/appeal/route.ts`** - POST - Handle appeal

### 2.3 New Frontend Components

**Directory:** `components/verification/`

1. **`VerificationDashboard.tsx`** - Main dashboard showing all verification tiers
2. **`IDUploadCard.tsx`** - ID document upload component
3. **`FaceMatchWidget.tsx`** - Selfie capture and face match UI
4. **`OTPVerification.tsx`** - OTP input and verification component
5. **`SkillProofUploader.tsx`** - Upload skill proofs (GitHub, deployment, file)
6. **`MicroTaskTest.tsx`** - Microtask test interface
7. **`VideoUploader.tsx`** - Video verification upload component
8. **`BadgesStack.tsx`** - Display all badges for a user
9. **`VerificationProgress.tsx`** - Progress indicator for verification tiers
10. **`AppealForm.tsx`** - Form to appeal rejected verification

**Directory:** `components/client/verification/`

1. **`ClientVerificationCard.tsx`** - Client verification dashboard
2. **`PaymentVerification.tsx`** - Payment method verification UI
3. **`BusinessVerification.tsx`** - Business document upload UI

**Directory:** `components/admin/verification/`

1. **`VerificationReviewPanel.tsx`** - Admin review interface
2. **`EvidenceViewer.tsx`** - View uploaded documents/videos
3. **`AuditLogViewer.tsx`** - View audit logs for verification
4. **`AppealHandler.tsx`** - Handle appeals

### 2.4 New Pages

1. **`app/(dashboard)/worker/verification/page.tsx`** - Worker verification dashboard (replace existing)
2. **`app/(dashboard)/client/verification/page.tsx`** - Client verification dashboard
3. **`app/(dashboard)/admin/verifications/[id]/page.tsx`** - Admin verification detail page
4. **`app/(dashboard)/admin/verifications/appeals/page.tsx`** - Admin appeals queue

### 2.5 Files to Modify

1. **`app/(dashboard)/worker/profile/verification/page.tsx`** - Replace with new verification dashboard
2. **`components/verification/VerificationBadge.tsx`** - Update to use new badge system
3. **`components/admin/VerificationQueue.tsx`** - Update to use new verification system
4. **`app/(dashboard)/worker/page.tsx`** - Add verification status widget
5. **`app/(dashboard)/client/page.tsx`** - Add client verification status
6. **`app/workers/page.tsx`** - Update to show new badges
7. **`app/jobs/page.tsx`** - Show client verification badges
8. **`components/profile/VerificationBadges.tsx`** - Update badge display logic
9. **`lib/api-middleware.ts`** - Add verification status checks
10. **`types/database.types.ts`** - Add new type definitions

### 2.6 New Utility Files

1. **`lib/verification/face-match.ts`** - Face match adapter (with provider abstraction)
2. **`lib/verification/otp.ts`** - OTP generation and verification
3. **`lib/verification/badges.ts`** - Badge calculation and awarding logic
4. **`lib/verification/state-machine.ts`** - Verification state machine
5. **`lib/verification/audit.ts`** - Audit logging utilities
6. **`lib/verification/storage.ts`** - Secure file storage with signed URLs
7. **`lib/verification/microtask-grader.ts`** - Microtask auto-grading (stub)

### 2.7 Configuration Files

1. **`.env.example`** - Add new environment variables
2. **`lib/feature-gate.ts`** - Add `FEATURE_VERIFICATION_V2` flag

### 2.8 Documentation

1. **`docs/verification.md`** - Complete verification system documentation
2. **`docs/verification/api.md`** - API documentation
3. **`docs/verification/admin-guide.md`** - Admin guide for manual review
4. **`docs/verification/integrations.md`** - Third-party integration instructions

### 2.9 Tests

**Directory:** `__tests__/verification/`

1. **`api/identity.test.ts`** - Identity upload and face-match tests
2. **`api/otp.test.ts`** - OTP send/verify tests
3. **`api/skill.test.ts`** - Skill proof upload tests
4. **`api/microtask.test.ts`** - Microtask submission tests
5. **`api/video.test.ts`** - Video upload tests
6. **`api/client.test.ts`** - Client verification tests
7. **`components/VerificationDashboard.test.tsx`** - Component tests
8. **`e2e/verification-flow.test.ts`** - End-to-end verification flow

---

## 3. Database Schema

### 3.1 New Tables

#### `verifications_v2`
```sql
CREATE TABLE verifications_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN (
    'identity', 'skill', 'microtask', 'video', 'delivery'
  )),
  tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'pending', 'in_review', 'verified', 'rejected', 'expired'
  )),
  evidence JSONB DEFAULT '{}',
  score DECIMAL(5,2),
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verifier_id UUID REFERENCES users(id),
  rejection_reason TEXT,
  notes TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verification_type, tier)
);
```

#### `skill_proofs`
```sql
CREATE TABLE skill_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_id UUID REFERENCES verifications_v2(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  proof_type TEXT NOT NULL CHECK (proof_type IN (
    'github', 'deployment', 'file', 'link', 'code_walkthrough'
  )),
  url TEXT,
  file_path TEXT,
  file_storage_bucket TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `microtasks`
```sql
CREATE TABLE microtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  test_input JSONB,
  expected_output JSONB,
  grader_script TEXT, -- JavaScript/TypeScript code for auto-grading
  time_limit_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `microtask_submissions`
```sql
CREATE TABLE microtask_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  microtask_id UUID NOT NULL REFERENCES microtasks(id) ON DELETE CASCADE,
  verification_id UUID REFERENCES verifications_v2(id) ON DELETE CASCADE,
  submission_url TEXT, -- GitHub repo, deployment URL, or file path
  submission_file_path TEXT,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('url', 'file')),
  score DECIMAL(5,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'grading', 'passed', 'failed', 'manual_review'
  )),
  grader_output JSONB,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, microtask_id)
);
```

#### `client_verifications`
```sql
CREATE TABLE client_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  identity_status TEXT NOT NULL DEFAULT 'not_started' CHECK (identity_status IN (
    'not_started', 'pending', 'verified', 'rejected'
  )),
  payment_status TEXT NOT NULL DEFAULT 'not_started' CHECK (payment_status IN (
    'not_started', 'pending', 'verified', 'rejected', 'expired'
  )),
  business_status TEXT NOT NULL DEFAULT 'not_started' CHECK (business_status IN (
    'not_started', 'pending', 'verified', 'rejected'
  )),
  payment_method_id TEXT, -- Stripe payment method ID or UPI ID
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'razorpay', 'upi')),
  business_documents JSONB DEFAULT '{}',
  evidence JSONB DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id)
);
```

#### `badges`
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'identity_verified', 'skill_verified', 'video_verified',
    'level_1', 'level_2', 'level_3',
    'payment_verified', 'business_verified',
    'top_performer', 'trusted_worker', 'verified_client'
  )),
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  awarded_by UUID REFERENCES users(id),
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES users(id),
  revocation_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type, awarded_at)
);
```

#### `verification_audit_logs`
```sql
CREATE TABLE verification_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES verifications_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'created', 'submitted', 'approved', 'rejected', 'appealed',
    'badge_awarded', 'badge_revoked', 'status_changed'
  )),
  performed_by UUID REFERENCES users(id),
  old_status TEXT,
  new_status TEXT,
  notes TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `verification_appeals`
```sql
CREATE TABLE verification_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID NOT NULL REFERENCES verifications_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  additional_evidence JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'under_review', 'approved', 'rejected'
  )),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Updates to Existing Tables

#### `worker_profiles`
```sql
ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS verification_level INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_tier_1_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_tier_2_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_tier_3_completed_at TIMESTAMPTZ;
```

#### `users`
```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;
```

### 3.3 Indexes

```sql
CREATE INDEX idx_verifications_v2_user_id ON verifications_v2(user_id);
CREATE INDEX idx_verifications_v2_status ON verifications_v2(status);
CREATE INDEX idx_verifications_v2_type_tier ON verifications_v2(verification_type, tier);
CREATE INDEX idx_skill_proofs_user_id ON skill_proofs(user_id);
CREATE INDEX idx_microtask_submissions_user_id ON microtask_submissions(user_id);
CREATE INDEX idx_microtask_submissions_status ON microtask_submissions(status);
CREATE INDEX idx_client_verifications_client_id ON client_verifications(client_id);
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_badges_type ON badges(badge_type);
CREATE INDEX idx_verification_audit_logs_verification_id ON verification_audit_logs(verification_id);
CREATE INDEX idx_verification_appeals_status ON verification_appeals(status);
```

---

## 4. Third-Party Integrations Required

### 4.1 Face Match Provider

**Options:**
1. **AWS Rekognition** (Recommended for production)
   - Service: Amazon Rekognition Face Comparison
   - Cost: ~$1.00 per 1,000 face comparisons
   - Setup: AWS SDK, IAM roles, environment variables

2. **Face++ (Megvii)**
   - Service: Face Comparison API
   - Cost: Pay-as-you-go
   - Setup: API key, SDK

3. **Local Mock (Development)**
   - Simple similarity check (mock)
   - For development/testing only

**Implementation:**
- Create adapter pattern in `lib/verification/face-match.ts`
- Environment variable: `FACE_MATCH_PROVIDER` (aws_rekognition | faceplusplus | mock)
- Environment variables for credentials (provider-specific)

**Mock Implementation:**
- Return random similarity score (0.85-0.99) for development
- Log all requests for testing

### 4.2 Payment Verification

**Options:**
1. **Stripe** (Recommended)
   - Service: Payment Methods API
   - Verify payment method without charging
   - Setup: Stripe SDK, API keys

2. **Razorpay** (India-focused)
   - Service: Payment Methods API
   - Setup: Razorpay SDK, API keys

3. **UPI Verification** (India)
   - Service: UPI ID validation
   - Setup: Third-party UPI verification service or manual

**Implementation:**
- Create adapter in `lib/verification/payment.ts`
- Environment variable: `PAYMENT_VERIFICATION_PROVIDER` (stripe | razorpay | upi | mock)
- Mock: Return success for test payment methods

### 4.3 OTP Service

**Options:**
1. **Twilio** (SMS)
   - Service: Twilio Verify API
   - Cost: ~$0.05 per verification

2. **AWS SNS** (SMS)
   - Service: Amazon SNS
   - Cost: Varies by region

3. **Resend** (Email - already in use)
   - Service: Resend API (for email OTP)
   - Already configured in project

**Implementation:**
- Use Resend for email OTP (already integrated)
- Add Twilio for SMS OTP
- Environment variables: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`

### 4.4 Video Processing (Optional - Phase 2)

**Options:**
1. **AWS Transcribe** (Speech-to-text)
   - Service: Amazon Transcribe
   - For video transcription

2. **Manual Review** (Initial)
   - Store videos, flag for admin review
   - No automatic processing initially

**Implementation:**
- Store videos in Supabase Storage
- Flag for manual review
- Add transcription later (Phase 2)

---

## 5. Security & Privacy Checklist

### 5.1 Data Protection

- ✅ **Encrypt PII at rest** - Use Supabase encryption (PostgreSQL encryption)
- ✅ **Encrypt files in storage** - Supabase Storage encryption enabled
- ✅ **Signed URLs with TTL** - All file access via signed URLs (24-hour expiry)
- ✅ **Minimal data storage** - Only store necessary verification data
- ✅ **Age-off policy** - Delete raw uploads after 90 days (unless worker consents to longer retention)
- ✅ **GDPR compliance** - Right to deletion, data export
- ✅ **India data localization** - Store data in India region (Supabase Mumbai)

### 5.2 Access Control

- ✅ **Row Level Security (RLS)** - All tables have RLS policies
- ✅ **Admin-only access** - Verification evidence only visible to admins
- ✅ **Worker self-access** - Workers can view their own verification status (not raw evidence)
- ✅ **Client badge-only** - Clients see only badges, no PII
- ✅ **Audit logging** - All admin actions logged with IP, user agent, timestamp

### 5.3 Privacy Constraints (CRITICAL)

- ❌ **NO employer notification** - Never contact user's employer
- ❌ **NO LinkedIn notifications** - Never send verification events to LinkedIn
- ❌ **NO external network sharing** - No verification data shared with third parties (except face-match provider for matching only)
- ✅ **Opt-in only** - Workers opt-in to verification
- ✅ **Data minimization** - Only collect necessary verification data
- ✅ **Consent tracking** - Track user consent for data retention

### 5.4 Rate Limiting

- ✅ **Upload rate limits** - Max 5 uploads per hour per user
- ✅ **OTP rate limits** - Max 3 OTP requests per hour per user
- ✅ **Face-match rate limits** - Max 3 attempts per day per user
- ✅ **API rate limits** - Use existing rate limiting middleware

### 5.5 File Security

- ✅ **File type validation** - Only allow images (JPG, PNG), PDFs, videos (MP4)
- ✅ **File size limits** - Max 10MB for images/PDFs, 100MB for videos
- ✅ **Virus scanning** - Integrate ClamAV or similar (future enhancement)
- ✅ **Secure storage bucket** - Private bucket with signed URL access only

### 5.6 Fraud Prevention

- ✅ **Manual review queue** - Face-match failures go to manual review
- ✅ **Revocation system** - Badges can be revoked on fraud detection
- ✅ **Appeal system** - Workers can appeal rejections
- ✅ **Fraud detection** - Flag suspicious patterns (multiple rejections, etc.)

---

## 6. Component Specifications

### 6.1 VerificationDashboard Component

**Props:**
```typescript
interface VerificationDashboardProps {
  userId: string
  userType: 'worker' | 'client'
}
```

**Features:**
- Display 3-tier verification progress
- Show current status for each tier
- Action buttons for each incomplete tier
- Badge display
- Progress indicators

**Accessibility:**
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for status changes
- Color contrast >= 4.5:1

### 6.2 FaceMatchWidget Component

**Props:**
```typescript
interface FaceMatchWidgetProps {
  userId: string
  idDocumentUrl: string
  onSuccess: (similarityScore: number) => void
  onError: (error: string) => void
}
```

**Features:**
- Camera access request
- Selfie capture (webcam or file upload)
- Face detection validation
- Face match API call
- Loading states
- Error handling

**Accessibility:**
- Camera permission request with clear explanation
- Alternative file upload option
- Error messages in plain language

### 6.3 OTPVerification Component

**Props:**
```typescript
interface OTPVerificationProps {
  userId: string
  method: 'email' | 'phone'
  contactInfo: string
  onSuccess: () => void
  onError: (error: string) => void
}
```

**Features:**
- OTP input (6 digits)
- Auto-submit on complete
- Resend OTP button (with cooldown)
- Countdown timer
- Error display

**Accessibility:**
- Input labels
- Error announcements
- Keyboard navigation

### 6.4 SkillProofUploader Component

**Props:**
```typescript
interface SkillProofUploaderProps {
  userId: string
  skillName: string
  onUpload: (proof: SkillProof) => void
}
```

**Features:**
- Multiple proof types (GitHub, deployment, file, link)
- URL validation
- File upload with progress
- Preview uploaded proofs
- Remove proof option

### 6.5 MicroTaskTest Component

**Props:**
```typescript
interface MicroTaskTestProps {
  userId: string
  microtaskId: string
  onSubmit: (submission: MicrotaskSubmission) => void
}
```

**Features:**
- Display task description
- Submission input (URL or file)
- Timer display
- Submit button
- Results display (after grading)

### 6.6 BadgesStack Component

**Props:**
```typescript
interface BadgesStackProps {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  showTooltips?: boolean
  visibility?: 'public' | 'private'
}
```

**Features:**
- Display all earned badges
- Badge tooltips with description
- Badge icons
- Responsive layout
- Visibility rules (public badges only shown to others)

---

## 7. API Endpoint Specifications

### 7.1 POST /api/verification/identity/upload

**Request:**
```typescript
{
  documentType: 'government_id' | 'address_proof'
  file: File (multipart/form-data)
}
```

**Response:**
```typescript
{
  success: boolean
  documentUrl: string
  signedUrl: string (24-hour TTL)
}
```

**Security:**
- Require authentication
- Rate limit: 5 per hour
- File validation (type, size)
- Upload to private storage bucket

### 7.2 POST /api/verification/identity/face-match

**Request:**
```typescript
{
  selfieFile: File (multipart/form-data)
  idDocumentUrl: string
}
```

**Response:**
```typescript
{
  success: boolean
  similarityScore: number (0-1)
  verified: boolean
  requiresManualReview: boolean
}
```

**Security:**
- Require authentication
- Rate limit: 3 per day
- Face detection validation before API call

### 7.3 POST /api/verification/otp/send

**Request:**
```typescript
{
  method: 'email' | 'phone'
  contactInfo: string
}
```

**Response:**
```typescript
{
  success: boolean
  expiresIn: number (seconds)
}
```

**Security:**
- Require authentication
- Rate limit: 3 per hour
- Validate contact info format

### 7.4 POST /api/verification/otp/verify

**Request:**
```typescript
{
  method: 'email' | 'phone'
  contactInfo: string
  otp: string
}
```

**Response:**
```typescript
{
  success: boolean
  verified: boolean
}
```

**Security:**
- Require authentication
- Rate limit: 10 per hour
- OTP expiry validation

### 7.5 POST /api/verification/skill/upload

**Request:**
```typescript
{
  skillName: string
  proofType: 'github' | 'deployment' | 'file' | 'link'
  url?: string
  file?: File
  title: string
}
```

**Response:**
```typescript
{
  success: boolean
  proofId: string
  proofUrl?: string
}
```

### 7.6 POST /api/verification/microtask/submit

**Request:**
```typescript
{
  microtaskId: string
  submissionType: 'url' | 'file'
  submissionUrl?: string
  submissionFile?: File
}
```

**Response:**
```typescript
{
  success: boolean
  submissionId: string
  status: 'pending' | 'grading' | 'passed' | 'failed'
  score?: number
}
```

### 7.7 GET /api/verification/status/[userId]

**Response:**
```typescript
{
  userId: string
  tier1: {
    status: string
    completedAt?: string
    badges: string[]
  }
  tier2: {
    status: string
    completedAt?: string
    badges: string[]
  }
  tier3: {
    status: string
    completedAt?: string
    badges: string[]
  }
  overallLevel: number
  badges: Badge[]
}
```

**Security:**
- Public endpoint (badge visibility)
- Filter sensitive data based on requester

---

## 8. Acceptance Criteria

### 8.1 Worker Verification - Level 1 (Identity)

- ✅ Worker can upload government ID document
- ✅ Worker can upload selfie for face matching
- ✅ Face match API is called with ID and selfie
- ✅ Worker receives OTP via email
- ✅ Worker can verify OTP
- ✅ Worker receives OTP via phone (optional)
- ✅ Worker can verify phone OTP
- ✅ Upon completion, worker receives "Identity Verified" badge
- ✅ Badge displays on worker profile, search results, job applications
- ✅ Admin can review face-match failures manually
- ✅ Worker can appeal rejection

### 8.2 Worker Verification - Level 2 (Skills)

- ✅ Worker can upload skill proofs (GitHub, deployment, file, link)
- ✅ Worker can select microtask to complete
- ✅ Worker can submit microtask solution
- ✅ Microtask is auto-graded (or flagged for manual review)
- ✅ Worker receives "Skill Verified" badge upon passing
- ✅ Multiple skills can be verified
- ✅ Skill proofs are visible to clients (as badges only, no PII)

### 8.3 Worker Verification - Level 3 (Video)

- ✅ Worker can upload video verification
- ✅ Video is stored securely
- ✅ Video is flagged for admin review
- ✅ Admin can review and approve/reject video
- ✅ Worker receives "Video Verified" badge upon approval
- ✅ Video is not visible to clients (privacy)

### 8.4 Client Verification

- ✅ Client can verify payment method (Stripe/Razorpay/UPI)
- ✅ Client receives "Payment Verified" badge
- ✅ Client can upload business documents (optional)
- ✅ Client receives "Business Verified" badge upon approval
- ✅ Badges display on job postings, client profile

### 8.5 Badge System

- ✅ Badges display correctly in:
  - Worker profile page
  - Worker search results
  - Job application preview
  - Client profile page
  - Job posting page
- ✅ Badges are visible only as badges (no PII exposed)
- ✅ Badge tooltips show description
- ✅ Badges can be revoked by admin
- ✅ Revoked badges are removed from display

### 8.6 Admin Tools

- ✅ Admin can view all verification requests
- ✅ Admin can view evidence (documents, videos) with signed URLs
- ✅ Admin can approve/reject verifications
- ✅ Admin can add notes
- ✅ Admin can view audit logs
- ✅ Admin can handle appeals
- ✅ All admin actions are logged

### 8.7 Security & Privacy

- ✅ No employer notification sent
- ✅ No LinkedIn notifications sent
- ✅ PII encrypted at rest
- ✅ Files accessible only via signed URLs (24-hour TTL)
- ✅ Rate limiting enforced
- ✅ RLS policies prevent unauthorized access
- ✅ Audit logs capture all actions

### 8.8 Testing

- ✅ Unit tests for all API routes (>= 70% coverage)
- ✅ Integration tests for verification flows
- ✅ Component tests for UI components
- ✅ E2E tests for complete verification flows
- ✅ All tests pass in CI/CD pipeline

### 8.9 Documentation

- ✅ API documentation created
- ✅ Admin guide created
- ✅ Integration instructions documented
- ✅ Privacy policy snippets included
- ✅ Migration scripts included

### 8.10 Feature Flag

- ✅ Feature behind `FEATURE_VERIFICATION_V2` flag
- ✅ Flag defaults to `false` (off)
- ✅ Migration script populates existing users
- ✅ Rollout plan documented

---

## 9. Implementation Timeline

### Phase B (Design) - 2 days
- Wireframes
- Component specs
- API contracts

### Phase C (Implementation) - 5 days
- Database migrations
- API endpoints
- Frontend components
- Integration stubs

### Phase D (Testing & Documentation) - 2 days
- Unit tests
- Integration tests
- E2E tests
- Documentation

### Phase E (Deployment & Rollout) - 1 day
- CI/CD updates
- Migration execution
- Feature flag rollout
- Monitoring setup

**Total: ~10 days for MVP (Level 1 + badges + client payment + admin)**

**Phase 2 (Level 2 & 3):** Additional 5-7 days

---

## 10. Risk Mitigation

### 10.1 Technical Risks

- **Face-match API failures:** Fallback to manual review
- **Storage quota:** Implement cleanup jobs for old files
- **Rate limiting abuse:** IP-based rate limiting + CAPTCHA
- **Video processing costs:** Start with manual review, add automation later

### 10.2 Privacy Risks

- **Data breach:** Encryption, RLS, audit logs
- **Unauthorized access:** Strict RLS policies, admin-only evidence access
- **Data retention:** Age-off policy, user consent tracking

### 10.3 Business Risks

- **Low completion rate:** Clear UI, progress indicators, incentives
- **High rejection rate:** Appeal system, clear guidelines
- **Fraud:** Manual review queue, revocation system

---

## 11. Next Steps

1. **Review this document** - Stakeholder approval
2. **Approve Phase A** - Proceed to Phase B
3. **Design wireframes** - Phase B
4. **Implement MVP** - Phase C
5. **Test & document** - Phase D
6. **Deploy & rollout** - Phase E

---

## 12. Questions & Clarifications

**Pending Decisions:**
1. Face-match provider preference? (AWS Rekognition recommended)
2. Payment verification provider? (Stripe recommended, but Razorpay for India)
3. OTP service for SMS? (Twilio recommended)
4. Video processing automation? (Manual review initially, automation later)

**Ready for Approval:** ✅

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Status:** Awaiting Approval


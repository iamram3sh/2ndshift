# API Testing Examples

Quick reference for testing all API endpoints.

## Base URL
```
Production: https://your-vercel-app.vercel.app
Local: http://localhost:3000
```

---

## 1. Authentication

### Register User
```bash
curl -X POST https://your-app.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "worker"
  }'
```

### Login
```bash
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "role": "worker"
  }
}
```

**Note**: Refresh token is set as httpOnly cookie automatically.

### Get Current User
```bash
curl -X GET https://your-app.vercel.app/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST https://your-app.vercel.app/api/v1/auth/refresh \
  -H "Cookie: refresh_token=YOUR_REFRESH_TOKEN"
```

### Logout
```bash
curl -X POST https://your-app.vercel.app/api/v1/auth/logout \
  -H "Cookie: refresh_token=YOUR_REFRESH_TOKEN"
```

---

## 2. Jobs

### List Jobs
```bash
curl -X GET "https://your-app.vercel.app/api/v1/jobs?status=open&category_id=uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Job (Client only)
```bash
curl -X POST https://your-app.vercel.app/api/v1/jobs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build React Dashboard",
    "description": "Need a modern dashboard with charts",
    "category_id": "category-uuid",
    "microtask_id": "microtask-uuid",
    "price_fixed": 15000,
    "delivery_window": "oneTo4w"
  }'
```

### Get Job Details
```bash
curl -X GET https://your-app.vercel.app/api/v1/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Apply to Job (Worker, requires credits)
```bash
curl -X POST https://your-app.vercel.app/api/v1/jobs/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cover_text": "I have 5 years of React experience",
    "proposed_price": 14000,
    "proposed_delivery": "2024-02-15T00:00:00Z"
  }'
```

### Accept Proposal (Client)
```bash
curl -X POST https://your-app.vercel.app/api/v1/jobs/JOB_ID/accept-proposal \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "application_id": "application-uuid"
  }'
```

### Deliver Job (Worker)
```bash
curl -X POST https://your-app.vercel.app/api/v1/jobs/JOB_ID/deliver \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "delivery_notes": "Completed all features",
    "attachments": ["https://example.com/file1.zip"]
  }'
```

### Approve Job (Client, releases escrow)
```bash
curl -X POST https://your-app.vercel.app/api/v1/jobs/JOB_ID/approve \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 3. Credits

### Get Balance
```bash
curl -X GET https://your-app.vercel.app/api/v1/credits/balance \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Purchase Credits
```bash
curl -X POST https://your-app.vercel.app/api/v1/credits/purchase \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "INR"
  }'
```

---

## 4. Categories & Microtasks

### List Categories
```bash
curl -X GET https://your-app.vercel.app/api/v1/categories
```

### List Microtasks in Category
```bash
curl -X GET https://your-app.vercel.app/api/v1/categories/CATEGORY_ID/microtasks
```

---

## 5. Matching

### Auto-Match Workers
```bash
curl -X POST https://your-app.vercel.app/api/v1/matching/auto-match \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "job-uuid"
  }'
```

### Suggest Workers (LLM stub)
```bash
curl -X POST https://your-app.vercel.app/api/v1/matching/suggest-workers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text": "Need a React developer with TypeScript experience"
  }'
```

---

## 6. Missing Tasks

### Submit Missing Task Request
```bash
curl -X POST https://your-app.vercel.app/api/v1/missing-tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text": "I need someone to build a custom AI chatbot integration"
  }'
```

---

## 7. Admin

### List All Jobs (Admin only)
```bash
curl -X GET "https://your-app.vercel.app/api/v1/admin/jobs?status=open" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### List All Users (Admin only)
```bash
curl -X GET "https://your-app.vercel.app/api/v1/admin/users?role=worker" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

---

## Using Postman/Thunder Client

### Setup
1. Create a new collection: "2ndShift V1 API"
2. Add environment variables:
   - `base_url`: `https://your-app.vercel.app`
   - `access_token`: (set after login)
   - `refresh_token`: (set after login)

### Pre-request Script (for auth)
```javascript
// Set access token from environment
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('access_token')
});
```

### Test Script (save token after login)
```javascript
// After login request
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set('access_token', jsonData.access_token);
}
```

---

## Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set method, URL, headers
4. For auth, add header:
   ```
   Authorization: Bearer YOUR_TOKEN
   ```
5. Save requests in collection for reuse

---

## Error Responses

All endpoints return standard error format:

```json
{
  "error": "Error message",
  "details": {} // Optional, for validation errors
}
```

**Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., already applied)
- `500` - Server Error

---

## Testing Workflow

### Complete Job Lifecycle Test

1. **Register Client**
   ```bash
   POST /api/v1/auth/register (role: client)
   ```

2. **Register Worker**
   ```bash
   POST /api/v1/auth/register (role: worker)
   ```

3. **Client Creates Job**
   ```bash
   POST /api/v1/jobs (with client token)
   ```

4. **Worker Applies**
   ```bash
   POST /api/v1/jobs/{id}/apply (with worker token)
   # Credits are deducted automatically
   ```

5. **Client Accepts Proposal**
   ```bash
   POST /api/v1/jobs/{id}/accept-proposal (with client token)
   ```

6. **Worker Delivers**
   ```bash
   POST /api/v1/jobs/{id}/deliver (with worker token)
   ```

7. **Client Approves**
   ```bash
   POST /api/v1/jobs/{id}/approve (with client token)
   # Escrow released, commission calculated
   ```

---

## Database Verification

After testing, verify in Supabase:

```sql
-- Check users
SELECT id, email, user_type, created_at FROM users;

-- Check jobs
SELECT id, title, status, client_id FROM jobs;

-- Check applications
SELECT id, project_id, worker_id, status FROM applications;

-- Check credits
SELECT user_id, balance, reserved FROM shift_credits;

-- Check transactions
SELECT user_id, change, reason, created_at 
FROM credit_transactions 
ORDER BY created_at DESC 
LIMIT 10;

-- Check escrows
SELECT id, job_id, amount, status FROM escrows;

-- Check commissions
SELECT job_id, amount, percent, charged_to FROM commissions;
```

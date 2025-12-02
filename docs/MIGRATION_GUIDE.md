# Backend Schema V1 - Migration Guide

## Overview

This guide explains how to apply the Backend Schema V1 migration to your Supabase database.

## Prerequisites

- Supabase project with existing schema
- Service role key or SQL Editor access
- Environment variables configured (`.env.local`)

## Method 1: Manual Migration (Recommended for First Time)

This is the most reliable method and recommended for first-time setup.

### Steps

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Click "New Query"

2. **Open the Migration File**
   - File location: `database/migrations/backend_schema_v1_complete.sql`
   - Open it in your code editor

3. **Copy the Entire SQL**
   - Select all (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

4. **Paste into SQL Editor**
   - Paste the SQL into the Supabase SQL Editor
   - Review the SQL (optional but recommended)

5. **Execute**
   - Click "RUN" button or press Ctrl+Enter
   - Wait for completion (~1-2 minutes)

6. **Verify**
   ```bash
   npm run migrate:verify
   ```

### What Gets Created

- ✅ Enhanced `users` table (new columns)
- ✅ `profiles` table (worker profiles)
- ✅ `categories` table (hierarchical)
- ✅ `microtasks` table (catalog)
- ✅ `jobs` table (enhanced from projects)
- ✅ `applications` table (proposals)
- ✅ `assignments` table
- ✅ `shift_credits` table
- ✅ `credit_transactions` table
- ✅ `escrows` table
- ✅ `commissions` table
- ✅ `verifications` table
- ✅ `notifications` table
- ✅ `missing_task_requests` table
- ✅ `platform_config` table
- ✅ All indexes, constraints, RLS policies
- ✅ Database functions and triggers

## Method 2: Automatic Migration (Requires Setup)

If you have the `exec_sql` RPC function set up, you can run migrations automatically.

### Step 1: Create exec_sql Function (One-time Setup)

1. Open Supabase SQL Editor
2. Run this SQL:

```sql
-- See: scripts/create_exec_sql_function.sql
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  EXECUTE sql;
  RETURN json_build_object('success', true, 'message', 'SQL executed successfully');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'sqlstate', SQLSTATE
    );
END;
$$;

GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
```

### Step 2: Run Migration Script

```bash
npm run migrate
```

The script will:
- Read the migration file
- Execute SQL statements
- Show progress and results
- Verify tables were created

## Method 3: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Apply migration
supabase db push
```

## Verification

After migration, verify everything was created:

```bash
npm run migrate:verify
```

Or manually check in Supabase:
- Go to Table Editor
- Verify all tables listed above exist
- Check that indexes are created (Database → Indexes)

## Troubleshooting

### Error: "relation already exists"
- ✅ This is OK - the migration uses `IF NOT EXISTS`
- The table already exists, migration skipped it

### Error: "column already exists"
- ✅ This is OK - column was already added
- Migration will skip it

### Error: "permission denied"
- Check that you're using service role key
- Verify RLS policies allow the operation

### Error: "function exec_sql does not exist"
- Use Method 1 (Manual Migration) instead
- Or create the function first (see Method 2, Step 1)

### Migration Partially Failed
- Check the error messages
- Some statements may have failed but others succeeded
- Re-run the migration - it's idempotent (safe to run multiple times)

## Post-Migration Steps

1. **Seed Database** (Optional but recommended for development):
   ```bash
   npm run seed
   ```

2. **Verify API Endpoints**:
   - Test authentication: `POST /api/v1/auth/register`
   - Test jobs: `GET /api/v1/jobs`
   - Test credits: `GET /api/v1/credits/balance`

3. **Check Environment Variables**:
   - Ensure all required env vars are set
   - See `.env.example` for reference

## Rollback (If Needed)

If you need to rollback:

1. **Manual Rollback**:
   - Drop tables in reverse order
   - Remove columns from existing tables
   - Drop functions and triggers

2. **Backup First**:
   - Always backup your database before migrations
   - Use Supabase dashboard → Database → Backups

## Support

If you encounter issues:
1. Check the error messages in SQL Editor
2. Review the migration file for syntax errors
3. Verify your Supabase project has the required permissions
4. Check Supabase logs for detailed errors

## Next Steps

After successful migration:
- ✅ Run seed script to populate sample data
- ✅ Test API endpoints
- ✅ Configure payment provider (Razorpay/Stripe)
- ✅ Set up email service
- ✅ Configure file storage (S3/Supabase Storage)

---

**Migration File**: `database/migrations/backend_schema_v1_complete.sql`  
**Script**: `scripts/apply_backend_schema_v1_direct.js`  
**Documentation**: `docs/backend-schema-v1.md`

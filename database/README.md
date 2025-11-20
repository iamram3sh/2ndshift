# Database Scripts

This folder contains all SQL scripts organized by purpose.

## 📁 Folder Structure

### 🏗️ schema/ (6 files)
Database schema definitions, extensions, and storage setup.
- `DATABASE_SCHEMA.sql` - Complete database schema
- `DATABASE_SCHEMA_SAFE.sql` - Safe schema without dropping existing tables
- `database_extensions.sql` - PostgreSQL extensions
- `storage_policies.sql` - Supabase storage policies
- `storage_setup_simple.sql` - Simplified storage setup
- `ENABLE_RLS_CORRECT.sql` - Row Level Security (RLS) policies

### 📊 sample-data/ (7 files)
Sample data for testing and development.
- `ADD_FULL_SAMPLE_DATA.sql` - Complete sample data set
- `create_sample_data.sql` - Basic sample data
- `quick_sample_data.sql` - Quick sample data for testing
- `load_sample_data_now.sql` - Immediate data loading script
- `SIMPLE_TEST_DATA.sql` - Simple test data
- `READY_TO_RUN.sql` - Ready-to-run sample data
- `ULTRA_SIMPLE.sql` - Ultra simple test data

### 🔧 fixes/ (9 files)
Database maintenance and fix scripts.
- `CHECK_USER_PROFILE.sql` - Check user profile integrity
- `CHECK_AND_FIX_USERS.sql` - User validation and fixes
- `FIX_EXISTING_USERS.sql` - Fix existing user issues
- `FIX_USER_NO_COMMENTS.sql` - Fix users without comments
- `fix_users_clean.sql` - Clean user data fixes
- `QUICK_FIX_EXISTING_USER.sql` - Quick user fixes
- `FIX_RLS_POLICY.sql` - Fix RLS policy issues
- `DISABLE_RLS_TEST.sql` - Disable RLS for testing
- `DATABASE_CHECK_STATUS.sql` - Check database status

### 🔄 migrations/ (2 files)
Database migration scripts.
- `DATABASE_UPDATE_SUPERADMIN.sql` - Update superadmin permissions
- `MAKE_ADMIN.sql` - Create admin users

## 🚀 Quick Start

### Initial Setup
1. Run the schema: `database/schema/DATABASE_SCHEMA.sql`
2. Add extensions: `database/schema/database_extensions.sql`
3. Set up storage: `database/schema/storage_setup_simple.sql`
4. Enable RLS: `database/schema/ENABLE_RLS_CORRECT.sql`

### Add Sample Data
Choose one based on your needs:
- For quick testing: `database/sample-data/ULTRA_SIMPLE.sql`
- For basic data: `database/sample-data/quick_sample_data.sql`
- For complete data: `database/sample-data/ADD_FULL_SAMPLE_DATA.sql`

### Maintenance
- Check status: `database/fixes/DATABASE_CHECK_STATUS.sql`
- Fix user issues: `database/fixes/CHECK_AND_FIX_USERS.sql`

## ⚠️ Important Notes

- Always backup your database before running migration or fix scripts
- Test scripts in a development environment first
- RLS (Row Level Security) policies are critical for security
- Sample data scripts are for development/testing only

## 📝 Script Naming Convention

- `DATABASE_*` - Core database operations
- `FIX_*` - Fix scripts for specific issues
- `CHECK_*` - Validation and checking scripts
- `*_simple.sql` - Simplified versions of scripts

---

*For more information, see the main [project documentation](../docs/README.md).*

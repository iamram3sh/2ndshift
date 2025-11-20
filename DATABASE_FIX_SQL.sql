-- =====================================================
-- DATABASE FIX: Worker Profile Skills/Languages
-- =====================================================
-- Run this in Supabase Dashboard > SQL Editor
-- Takes 5 seconds to execute

-- Fix NOT NULL constraint on skills column
ALTER TABLE worker_profiles ALTER COLUMN skills DROP NOT NULL;
ALTER TABLE worker_profiles ALTER COLUMN skills SET DEFAULT '{}';

-- Fix NOT NULL constraint on languages column
ALTER TABLE worker_profiles ALTER COLUMN languages DROP NOT NULL;
ALTER TABLE worker_profiles ALTER COLUMN languages SET DEFAULT '{}';

-- Update any existing NULL values to empty arrays
UPDATE worker_profiles SET skills = '{}' WHERE skills IS NULL;
UPDATE worker_profiles SET languages = '{}' WHERE languages IS NULL;

-- Verify the fix
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'worker_profiles' 
  AND column_name IN ('skills', 'languages');

-- You should see:
-- skills    | YES | '{}'::text[]
-- languages | YES | '{}'::text[]

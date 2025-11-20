-- Fix RLS policy for users table
-- This allows users to read their own profile after login

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view own profile" ON users;

-- Recreate with better logic
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT 
  USING (
    auth.uid() = id OR
    auth.jwt()->>'sub' = id::text
  );

-- Verify it works
SELECT id, email, user_type FROM users WHERE id = auth.uid();

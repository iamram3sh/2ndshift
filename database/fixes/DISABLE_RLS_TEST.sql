-- Temporarily disable RLS to test
-- This will let us see if the profile exists and can be accessed

-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Now check if we can see the user
SELECT id, email, user_type, full_name FROM users ORDER BY created_at DESC LIMIT 5;

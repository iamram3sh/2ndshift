-- Re-enable RLS with CORRECT policies that actually work

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can insert during registration" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Super admin can manage all users" ON users;
DROP POLICY IF EXISTS "Admins cannot view superadmin" ON users;

-- Create simple, working policies

-- 1. Users can view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- 3. Anyone can insert during registration (needed for signup)
CREATE POLICY "users_insert_signup" ON users
  FOR INSERT
  WITH CHECK (true);

-- 4. Admins and superadmins can view all users
CREATE POLICY "admins_select_all" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_type IN ('admin', 'superadmin')
    )
  );

-- Test it works
SELECT id, email, user_type FROM users WHERE id = auth.uid();

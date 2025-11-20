-- Update Database Schema for Super Admin and Staff Management

-- 1. Add is_staff column to users table (if it doesn't exist)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT false;

-- 2. Add staff_role column for different staff roles
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS staff_role TEXT;

-- 3. Update user_type check constraint to include superadmin
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_user_type_check;

ALTER TABLE users 
ADD CONSTRAINT users_user_type_check 
CHECK (user_type IN ('worker', 'client', 'admin', 'superadmin'));

-- 4. Make yourself the Super Admin
-- REPLACE 'your-email@example.com' with YOUR actual email
UPDATE users 
SET user_type = 'superadmin', is_staff = false 
WHERE email = 'your-email@example.com';

-- 5. Add RLS policy for super admin to manage staff
DROP POLICY IF EXISTS "Super admin can manage all users" ON users;

CREATE POLICY "Super admin can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'superadmin'
    )
  );

-- 6. Update admin policy to allow admins (but not modify superadmin)
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type IN ('admin', 'superadmin')
    )
  );

-- 7. Prevent admins from accessing superadmin data
CREATE POLICY "Admins cannot view superadmin" ON users
  FOR SELECT USING (
    user_type != 'superadmin' OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'superadmin'
    )
  );

-- 8. Create activity log table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for activity log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can view all logs" ON admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'superadmin'
    )
  );

CREATE POLICY "Admins can view own logs" ON admin_activity_log
  FOR SELECT USING (admin_id = auth.uid());

-- 9. Verify the setup
SELECT 
  email, 
  user_type, 
  is_staff,
  CASE 
    WHEN user_type = 'superadmin' THEN '👑 Super Admin (You!)'
    WHEN user_type = 'admin' AND is_staff THEN '🛡️ Admin Staff'
    WHEN user_type = 'admin' THEN '⚠️ Regular Admin (needs review)'
    ELSE '👤 Regular User'
  END as role_description
FROM users
WHERE user_type IN ('admin', 'superadmin')
ORDER BY 
  CASE user_type 
    WHEN 'superadmin' THEN 1 
    WHEN 'admin' THEN 2 
    ELSE 3 
  END;

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE '✅ Super Admin setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Security Hierarchy:';
  RAISE NOTICE '1. Super Admin (you) - Full access, manage staff';
  RAISE NOTICE '2. Admin Staff - Platform management, no staff control';
  RAISE NOTICE '3. Regular Users - Normal platform access';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next steps:';
  RAISE NOTICE '1. Login and go to /superadmin';
  RAISE NOTICE '2. Add admin staff members';
  RAISE NOTICE '3. Regular /admin portal for staff';
END $$;

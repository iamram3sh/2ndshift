-- Quick Database Status Check
-- Run this to see what's already set up

-- Check if tables exist
SELECT 
  'users' as table_name, 
  COUNT(*) as exists 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'users'
UNION ALL
SELECT 
  'worker_profiles', 
  COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'worker_profiles'
UNION ALL
SELECT 
  'projects', 
  COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'projects'
UNION ALL
SELECT 
  'applications', 
  COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'applications'
UNION ALL
SELECT 
  'contracts', 
  COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'contracts'
UNION ALL
SELECT 
  'payments', 
  COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'payments';

-- Check data in tables
SELECT 
  'Total Users' as metric,
  COUNT(*)::TEXT as value
FROM users
UNION ALL
SELECT 
  'Workers',
  COUNT(*)::TEXT
FROM users WHERE user_type = 'worker'
UNION ALL
SELECT 
  'Clients',
  COUNT(*)::TEXT
FROM users WHERE user_type = 'client'
UNION ALL
SELECT 
  'Admins',
  COUNT(*)::TEXT
FROM users WHERE user_type = 'admin'
UNION ALL
SELECT 
  'Total Projects',
  COUNT(*)::TEXT
FROM projects
UNION ALL
SELECT 
  'Active Projects',
  COUNT(*)::TEXT
FROM projects WHERE status IN ('open', 'assigned', 'in_progress');

-- List all users
SELECT 
  id,
  email,
  full_name,
  user_type,
  phone,
  created_at
FROM users
ORDER BY created_at DESC;

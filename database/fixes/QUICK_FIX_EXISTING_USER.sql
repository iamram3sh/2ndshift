-- Quick fix for user who just registered but has no profile

-- First, check which users need profiles
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as name,
  au.raw_user_meta_data->>'user_type' as type,
  u.id as has_profile
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC
LIMIT 5;

-- If you see users without profiles, run this to fix them:
-- (Replace the email with the actual user's email)

INSERT INTO users (id, email, full_name, user_type, profile_visibility)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'user_type', 'worker'),
  'public'
FROM auth.users
WHERE email = 'PUT_USER_EMAIL_HERE@example.com'
ON CONFLICT (id) DO NOTHING;

-- Verify it worked:
SELECT * FROM users WHERE email = 'PUT_USER_EMAIL_HERE@example.com';

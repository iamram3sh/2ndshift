-- Check if profiles exist for users
SELECT 
  au.id as auth_id,
  au.email,
  au.email_confirmed_at,
  u.id as profile_id,
  u.user_type,
  u.full_name
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
ORDER BY au.created_at DESC
LIMIT 10;

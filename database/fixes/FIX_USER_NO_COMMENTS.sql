SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as name
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC
LIMIT 5;

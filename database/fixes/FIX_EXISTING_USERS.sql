-- Fix existing users who can't login
-- Run this in Supabase SQL Editor

INSERT INTO users (id, email, full_name, user_type, profile_visibility)
SELECT 
  auth.users.id,
  auth.users.email,
  COALESCE(auth.users.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(auth.users.raw_user_meta_data->>'user_type', 'worker'),
  'public'
FROM auth.users
LEFT JOIN users ON auth.users.id = users.id
WHERE users.id IS NULL
ON CONFLICT (id) DO NOTHING;

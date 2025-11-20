-- Step 1: Check which users are in auth but not in users table
SELECT 
  auth.users.email,
  auth.users.id,
  auth.users.email_confirmed_at,
  auth.users.raw_user_meta_data->>'full_name' as name,
  auth.users.raw_user_meta_data->>'user_type' as type
FROM auth.users
LEFT JOIN users ON auth.users.id = users.id
WHERE users.id IS NULL;

-- Step 2: If you see users above, run this to fix them one by one
-- REPLACE the values with actual data from step 1

-- Example for first user (EDIT THESE VALUES):
INSERT INTO users (id, email, full_name, user_type, profile_visibility)
VALUES (
  'paste-user-id-here',
  'paste-email-here',
  'paste-name-here',
  'worker',  -- or 'client'
  'public'
);

-- Repeat for each user that's missing a profile

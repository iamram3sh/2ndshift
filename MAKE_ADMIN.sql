-- Make a User an Admin
-- Replace 'your-email@example.com' with the actual email

-- Option 1: By Email (most common)
UPDATE users 
SET user_type = 'admin' 
WHERE email = 'your-email@example.com';

-- Option 2: By User ID
-- UPDATE users 
-- SET user_type = 'admin' 
-- WHERE id = 'your-user-id-here';

-- Verify the change
SELECT id, email, full_name, user_type 
FROM users 
WHERE user_type = 'admin';

-- If you need to revert back to worker or client:
-- UPDATE users SET user_type = 'worker' WHERE email = 'your-email@example.com';
-- UPDATE users SET user_type = 'client' WHERE email = 'your-email@example.com';

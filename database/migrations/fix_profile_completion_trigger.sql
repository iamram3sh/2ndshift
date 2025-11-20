-- =====================================================
-- FIX: Profile Completion Trigger (NO INFINITE RECURSION)
-- Fixes error when updating worker_profiles
-- =====================================================

-- DISABLE the trigger on users table to prevent recursion!
DROP TRIGGER IF EXISTS trigger_update_profile_completion ON users;

-- Drop and recreate the trigger function WITHOUT updating users from users trigger
CREATE OR REPLACE FUNCTION update_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion INTEGER;
  user_type_var TEXT;
  target_user_id UUID;
BEGIN
  -- ONLY run for worker_profiles and client_profiles, NOT users table
  IF TG_TABLE_NAME = 'users' THEN
    RETURN NEW; -- Skip to prevent recursion
  END IF;

  -- For worker_profiles or client_profiles tables
  target_user_id := NEW.user_id;
  SELECT user_type INTO user_type_var FROM users WHERE id = target_user_id;

  -- Calculate completion based on user type
  IF user_type_var = 'worker' THEN
    completion := calculate_worker_profile_completion(target_user_id);
  ELSIF user_type_var = 'client' THEN
    completion := calculate_client_profile_completion(target_user_id);
  ELSE
    RETURN NEW;
  END IF;

  -- Update the users table (won't trigger recursion now)
  UPDATE users 
  SET profile_completion_percentage = completion
  WHERE id = target_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only set triggers on profile tables, NOT on users table
DROP TRIGGER IF EXISTS trigger_update_worker_profile_completion ON worker_profiles;
CREATE TRIGGER trigger_update_worker_profile_completion
  AFTER INSERT OR UPDATE ON worker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();

DROP TRIGGER IF EXISTS trigger_update_client_profile_completion ON client_profiles;
CREATE TRIGGER trigger_update_client_profile_completion
  AFTER INSERT OR UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();

-- Create worker_profile for users who don't have one yet
-- This will create profiles for all workers without one
INSERT INTO worker_profiles (user_id, skills, bio, hourly_rate, experience_years)
SELECT 
  u.id,
  ARRAY[]::TEXT[],
  '',
  0,
  0
FROM users u
WHERE u.user_type = 'worker'
AND NOT EXISTS (
  SELECT 1 FROM worker_profiles wp WHERE wp.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Profile completion trigger fixed!';
  RAISE NOTICE '✅ Worker profiles created for all workers!';
  RAISE NOTICE 'You can now save your profile from the UI.';
END $$;

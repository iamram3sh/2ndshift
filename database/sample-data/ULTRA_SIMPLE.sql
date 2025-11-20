-- =====================================================
-- ULTRA SIMPLE - Just Projects & Applications
-- No reviews, no messages, no contracts
-- =====================================================

DO $$
DECLARE
  v_worker_id UUID := 'f53776e1-82ae-4fd7-ba92-fb02b2765cdf';
  v_client_id UUID := '55a34790-b7bb-4330-9d0e-b33e89e74944';
  v_project_id UUID;
BEGIN

  RAISE NOTICE '🚀 Creating ultra simple test data...';

  -- 1. WORKER PROFILE (optional, only if table exists)
  BEGIN
    INSERT INTO worker_profiles (user_id, skills, experience_years, hourly_rate, bio)
    VALUES (v_worker_id, ARRAY['React', 'Node.js'], 5, 1200, 'Full-stack developer')
    ON CONFLICT (user_id) DO NOTHING;
    RAISE NOTICE '✅ Worker profile created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Skipped worker profile';
  END;

  -- 2. PROJECT
  INSERT INTO projects (
    client_id, title, description, budget, 
    required_skills, duration_hours, status, deadline
  ) VALUES (
    v_client_id,
    'Test E-commerce Website',
    'Build a modern e-commerce website with React and Node.js',
    75000, 
    ARRAY['React', 'Node.js'],
    60, 
    'open', 
    NOW() + INTERVAL '30 days'
  ) RETURNING id INTO v_project_id;

  RAISE NOTICE '✅ Project created: %', v_project_id;

  -- 3. APPLICATION
  INSERT INTO applications (project_id, worker_id, cover_letter, proposed_rate, status)
  VALUES (
    v_project_id, 
    v_worker_id, 
    'I would love to work on this project!', 
    1200, 
    'pending'
  );

  RAISE NOTICE '✅ Application created';

  -- 4. MAKE ADMIN
  UPDATE users SET user_type = 'admin' WHERE email = 'ram3sh.akula@gmail.com';
  RAISE NOTICE '✅ Admin access granted';

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ BASIC DATA CREATED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '   • 1 Project (₹75,000)';
  RAISE NOTICE '   • 1 Application (pending)';
  RAISE NOTICE '   • Admin access';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Test your dashboard now!';
  RAISE NOTICE '   Worker: yuvamayi2024@gmail.com';
  RAISE NOTICE '   Admin: ram3sh.akula@gmail.com';
  RAISE NOTICE '';
  RAISE NOTICE 'ℹ️  For full features (reviews, messages),';
  RAISE NOTICE '   run database_extensions.sql first.';

END $$;

-- =====================================================
-- SIMPLE TEST DATA - Minimal Version
-- Just enough to test the platform
-- =====================================================

DO $$
DECLARE
  v_worker_id UUID := 'f53776e1-82ae-4fd7-ba92-fb02b2765cdf';
  v_client_id UUID := '55a34790-b7bb-4330-9d0e-b33e89e74944';
  v_project_id UUID;
BEGIN

  RAISE NOTICE '🚀 Creating minimal test data...';

  -- 1. WORKER PROFILE
  INSERT INTO worker_profiles (
    user_id, skills, experience_years, hourly_rate, bio
  ) VALUES (
    v_worker_id,
    ARRAY['React', 'Node.js', 'TypeScript'],
    5, 1200,
    'Experienced full-stack developer'
  ) ON CONFLICT (user_id) DO UPDATE SET
    skills = EXCLUDED.skills;

  RAISE NOTICE '✅ Worker profile created';

  -- 2. ONE PROJECT
  INSERT INTO projects (
    client_id, title, description, budget, required_skills, 
    duration_hours, status, deadline
  ) VALUES (
    v_client_id,
    'E-commerce Website Development',
    'Build a modern e-commerce website',
    75000, 
    ARRAY['React', 'Node.js'],
    60, 
    'open', 
    NOW() + INTERVAL '30 days'
  ) RETURNING id INTO v_project_id;

  RAISE NOTICE '✅ Project created: %', v_project_id;

  -- 3. ONE APPLICATION
  INSERT INTO applications (project_id, worker_id, cover_letter, proposed_rate, status)
  VALUES (v_project_id, v_worker_id, 'I would love to work on this!', 1200, 'pending');

  RAISE NOTICE '✅ Application created';

  -- 4. ONE MESSAGE
  INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text, is_read)
  VALUES (
    '55a34790-b7bb-4330-9d0e-b33e89e74944_f53776e1-82ae-4fd7-ba92-fb02b2765cdf',
    v_client_id, v_worker_id,
    'Hi! Let''s discuss the project.',
    false
  );

  RAISE NOTICE '✅ Message created';

  -- 5. MAKE ADMIN
  UPDATE users SET user_type = 'admin' WHERE email = 'ram3sh.akula@gmail.com';

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ TEST DATA CREATED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '   • 1 Worker profile';
  RAISE NOTICE '   • 1 Project';
  RAISE NOTICE '   • 1 Application';
  RAISE NOTICE '   • 1 Message';
  RAISE NOTICE '   • Admin access granted';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Now test your live site!';
  RAISE NOTICE '   Worker: yuvamayi2024@gmail.com';
  RAISE NOTICE '   Admin: ram3sh.akula@gmail.com';

END $$;

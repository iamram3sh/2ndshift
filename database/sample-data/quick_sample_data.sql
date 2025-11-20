-- =====================================================
-- Quick Sample Data Script
-- INSTRUCTIONS: 
-- 1. Replace USER IDs below with actual IDs from previous step
-- 2. Run this entire script in Supabase SQL Editor
-- =====================================================

-- ⚠️ REPLACE THESE WITH YOUR ACTUAL USER IDs
DO $$
DECLARE
  v_worker_id UUID := 'PASTE_WORKER_ID_HERE';  -- From worker@test.com
  v_client_id UUID := 'PASTE_CLIENT_ID_HERE';  -- From client@test.com
  v_project1_id UUID;
  v_project2_id UUID;
  v_contract_id UUID;
BEGIN

  RAISE NOTICE '🚀 Creating sample data...';

  -- =====================================================
  -- 1. WORKER PROFILE
  -- =====================================================
  INSERT INTO worker_profiles (
    user_id, skills, experience_years, hourly_rate, bio, is_verified
  ) VALUES (
    v_worker_id,
    ARRAY['React', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js'],
    5,
    1200,
    'Experienced full-stack developer with 5+ years building modern web applications.',
    false
  ) ON CONFLICT (user_id) DO UPDATE SET
    skills = EXCLUDED.skills,
    hourly_rate = EXCLUDED.hourly_rate;

  RAISE NOTICE '✅ Worker profile created';

  -- =====================================================
  -- 2. SAMPLE PROJECTS
  -- =====================================================
  -- Project 1: E-commerce Website
  INSERT INTO projects (
    client_id, title, description, budget, required_skills, 
    duration_hours, status, deadline
  ) VALUES (
    v_client_id,
    'E-commerce Website Development',
    'Looking for an experienced developer to build a modern e-commerce website with payment integration.',
    75000,
    ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'],
    60,
    'open',
    NOW() + INTERVAL '45 days'
  ) RETURNING id INTO v_project1_id;

  -- Project 2: Landing Page (We'll complete this one)
  INSERT INTO projects (
    client_id, title, description, budget, required_skills, 
    duration_hours, status, deadline
  ) VALUES (
    v_client_id,
    'Landing Page Development',
    'Create a beautiful, responsive landing page for a SaaS product.',
    15000,
    ARRAY['React', 'Next.js', 'Tailwind'],
    15,
    'completed',
    NOW() + INTERVAL '10 days'
  ) RETURNING id INTO v_project2_id;

  RAISE NOTICE '✅ Projects created';

  -- =====================================================
  -- 3. APPLICATIONS
  -- =====================================================
  -- Apply to e-commerce project
  INSERT INTO applications (
    project_id, worker_id, cover_letter, proposed_rate, status
  ) VALUES (
    v_project1_id,
    v_worker_id,
    'Hello! I have extensive experience in React and Node.js. I would love to work on this project!',
    1200,
    'pending'
  );

  -- Apply to landing page (accepted)
  INSERT INTO applications (
    project_id, worker_id, cover_letter, proposed_rate, status
  ) VALUES (
    v_project2_id,
    v_worker_id,
    'I can create a stunning landing page for you!',
    1200,
    'accepted'
  );

  RAISE NOTICE '✅ Applications created';

  -- =====================================================
  -- 4. COMPLETED CONTRACT (For review testing)
  -- =====================================================
  INSERT INTO contracts (
    project_id, worker_id, contract_amount, 
    platform_fee_percentage, platform_fee,
    tds_percentage, tds_amount, worker_payout,
    nda_signed, conflict_declaration_signed,
    status, started_at, completed_at
  ) VALUES (
    v_project2_id,
    v_worker_id,
    15000,
    10, 1500,
    2, 300, 13200,
    true, true,
    'completed',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '2 days'
  ) RETURNING id INTO v_contract_id;

  RAISE NOTICE '✅ Contract created (ID: %)', v_contract_id;

  -- =====================================================
  -- 5. PAYMENT
  -- =====================================================
  INSERT INTO payments (
    contract_id, payment_from, payment_to,
    gross_amount, platform_fee, tds_deducted, net_amount,
    status, payment_date
  ) VALUES (
    v_contract_id,
    v_client_id,
    v_worker_id,
    15000, 1500, 300, 13200,
    'completed',
    NOW() - INTERVAL '1 day'
  );

  RAISE NOTICE '✅ Payment created';

  -- =====================================================
  -- 6. SAMPLE REVIEW
  -- =====================================================
  INSERT INTO reviews (
    contract_id, reviewer_id, reviewee_id,
    rating, review_text, is_visible
  ) VALUES (
    v_contract_id,
    v_client_id,
    v_worker_id,
    5,
    'Excellent work! The landing page exceeded my expectations. Professional communication and timely delivery. Highly recommend!',
    true
  );

  RAISE NOTICE '✅ Review created';

  -- =====================================================
  -- 7. SAMPLE MESSAGES
  -- =====================================================
  INSERT INTO messages (
    conversation_id, sender_id, receiver_id, message_text, is_read, created_at
  ) VALUES
    (
      ARRAY_TO_STRING(ARRAY(SELECT unnest FROM unnest(ARRAY[v_client_id::text, v_worker_id::text]) ORDER BY 1), '_'),
      v_client_id, v_worker_id,
      'Hi! I saw your application. Your profile looks great. Can we discuss the project?',
      true,
      NOW() - INTERVAL '2 days'
    ),
    (
      ARRAY_TO_STRING(ARRAY(SELECT unnest FROM unnest(ARRAY[v_client_id::text, v_worker_id::text]) ORDER BY 1), '_'),
      v_worker_id, v_client_id,
      'Hello! Thank you for reaching out. Yes, I would love to discuss the project details.',
      false,
      NOW() - INTERVAL '1 day 23 hours'
    );

  RAISE NOTICE '✅ Messages created';

  -- =====================================================
  -- 8. NOTIFICATIONS
  -- =====================================================
  INSERT INTO notifications (user_id, type, title, message, link, is_read)
  VALUES
    (
      v_worker_id, 'application', 'Application Accepted',
      'Your application for "Landing Page Development" has been accepted!',
      '/contracts', false
    ),
    (
      v_client_id, 'application', 'New Application',
      'You have a new application for "E-commerce Website Development"',
      '/projects', false
    );

  RAISE NOTICE '✅ Notifications created';

  -- =====================================================
  -- 9. VERIFICATION
  -- =====================================================
  INSERT INTO verifications (
    user_id, verification_type, status, verification_data
  ) VALUES
    (
      v_worker_id, 'pan', 'pending',
      '{"pan_number": "ABCDE1234F"}'::jsonb
    );

  RAISE NOTICE '✅ Verification created';

  -- =====================================================
  -- SUMMARY
  -- =====================================================
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SAMPLE DATA CREATED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Created:';
  RAISE NOTICE '   • 1 Worker profile';
  RAISE NOTICE '   • 2 Projects (1 open, 1 completed)';
  RAISE NOTICE '   • 2 Applications';
  RAISE NOTICE '   • 1 Completed contract';
  RAISE NOTICE '   • 1 Payment';
  RAISE NOTICE '   • 1 Review (5 stars)';
  RAISE NOTICE '   • 2 Messages';
  RAISE NOTICE '   • 2 Notifications';
  RAISE NOTICE '   • 1 Verification (pending)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Test Accounts:';
  RAISE NOTICE '   Worker: worker@test.com / TestWorker123!';
  RAISE NOTICE '   Client: client@test.com / TestClient123!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Contract ID for review testing:';
  RAISE NOTICE '   %', v_contract_id;
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test!';
  RAISE NOTICE '========================================';

END $$;

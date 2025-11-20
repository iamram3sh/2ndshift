-- =====================================================
-- Sample Data for Existing Accounts
-- Worker: yuvamayi2024@gmail.com
-- Client: ram3sh.akula@gmail.com
-- =====================================================

DO $$
DECLARE
  v_worker_id UUID := 'f53776e1-82ae-4fd7-ba92-fb02b2765cdf';
  v_client_id UUID := '55a34790-b7bb-4330-9d0e-b33e89e74944';
  v_project1_id UUID;
  v_project2_id UUID;
  v_contract_id UUID;
BEGIN

  RAISE NOTICE '🚀 Creating sample data with existing accounts...';

  -- =====================================================
  -- 1. WORKER PROFILE
  -- =====================================================
  INSERT INTO worker_profiles (
    user_id, skills, experience_years, hourly_rate, bio, is_verified
  ) VALUES (
    v_worker_id,
    ARRAY['React', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js', 'PostgreSQL'],
    5,
    1200,
    'Experienced full-stack developer with 5+ years building modern web applications. Specialized in React, Node.js, and cloud technologies.',
    false
  ) ON CONFLICT (user_id) DO UPDATE SET
    skills = EXCLUDED.skills,
    hourly_rate = EXCLUDED.hourly_rate,
    bio = EXCLUDED.bio;

  RAISE NOTICE '✅ Worker profile created/updated';

  -- =====================================================
  -- 2. SAMPLE PROJECTS
  -- =====================================================
  INSERT INTO projects (
    client_id, title, description, budget, required_skills, 
    duration_hours, status, deadline
  ) VALUES (
    v_client_id,
    'E-commerce Website Development',
    'Looking for an experienced developer to build a modern e-commerce website with payment integration, user authentication, and admin dashboard.',
    75000,
    ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'],
    60,
    'open',
    NOW() + INTERVAL '45 days'
  ) RETURNING id INTO v_project1_id;

  INSERT INTO projects (
    client_id, title, description, budget, required_skills, 
    duration_hours, status, deadline
  ) VALUES (
    v_client_id,
    'Landing Page Development',
    'Create a beautiful, responsive landing page for a SaaS product with animations and SEO optimization.',
    15000,
    ARRAY['React', 'Next.js', 'Tailwind'],
    15,
    'completed',
    NOW() - INTERVAL '5 days'
  ) RETURNING id INTO v_project2_id;

  RAISE NOTICE '✅ Projects created';

  -- =====================================================
  -- 3. APPLICATIONS
  -- =====================================================
  INSERT INTO applications (
    project_id, worker_id, cover_letter, proposed_rate, status
  ) VALUES (
    v_project1_id,
    v_worker_id,
    'Hello! I have extensive experience in React and Node.js and would love to work on this e-commerce project. I have successfully completed similar projects and can deliver high-quality work within your timeline.',
    1200,
    'pending'
  );

  INSERT INTO applications (
    project_id, worker_id, cover_letter, proposed_rate, status
  ) VALUES (
    v_project2_id,
    v_worker_id,
    'I can create a stunning landing page for you! I have experience with Next.js and modern animations.',
    1200,
    'accepted'
  );

  RAISE NOTICE '✅ Applications created';

  -- =====================================================
  -- 4. COMPLETED CONTRACT
  -- =====================================================
  INSERT INTO contracts (
    project_id, worker_id, contract_amount, 
    platform_fee_percentage,
    tds_percentage, tds_amount, worker_payout,
    nda_signed, conflict_declaration_signed,
    status, started_at, completed_at
  ) VALUES (
    v_project2_id,
    v_worker_id,
    15000,
    10,
    2, 300, 13200,
    true, true,
    'completed',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '2 days'
  ) RETURNING id INTO v_contract_id;

  RAISE NOTICE '✅ Contract created';

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
  -- 6. REVIEW
  -- =====================================================
  INSERT INTO reviews (
    contract_id, reviewer_id, reviewee_id,
    rating, review_text, is_visible
  ) VALUES (
    v_contract_id,
    v_client_id,
    v_worker_id,
    5,
    'Excellent work! The landing page exceeded my expectations. Professional communication, timely delivery, and great attention to detail. Highly recommend!',
    true
  );

  RAISE NOTICE '✅ Review created';

  -- =====================================================
  -- 7. MESSAGES
  -- =====================================================
  INSERT INTO messages (
    conversation_id, sender_id, receiver_id, message_text, is_read, created_at
  ) VALUES
    (
      '55a34790-b7bb-4330-9d0e-b33e89e74944_f53776e1-82ae-4fd7-ba92-fb02b2765cdf',
      v_client_id, v_worker_id,
      'Hi! I saw your application for the e-commerce project. Your profile looks great. Can we discuss the requirements?',
      true,
      NOW() - INTERVAL '2 days'
    ),
    (
      '55a34790-b7bb-4330-9d0e-b33e89e74944_f53776e1-82ae-4fd7-ba92-fb02b2765cdf',
      v_worker_id, v_client_id,
      'Hello! Thank you for reaching out. Yes, I would love to discuss the project in detail.',
      false,
      NOW() - INTERVAL '1 day 23 hours'
    );

  RAISE NOTICE '✅ Messages created';

  -- =====================================================
  -- 8. NOTIFICATIONS
  -- =====================================================
  INSERT INTO notifications (user_id, type, title, message, link, is_read)
  VALUES
    (v_worker_id, 'application', 'Application Accepted',
     'Your application for "Landing Page Development" has been accepted!',
     '/contracts', false),
    (v_client_id, 'application', 'New Application',
     'You have a new application for "E-commerce Website Development"',
     '/projects', false);

  RAISE NOTICE '✅ Notifications created';

  -- =====================================================
  -- 9. VERIFICATION
  -- =====================================================
  INSERT INTO verifications (
    user_id, verification_type, status, verification_data
  ) VALUES (
    v_worker_id, 'pan', 'pending',
    '{"pan_number": "ABCDE1234F"}'::jsonb
  );

  RAISE NOTICE '✅ Verification created';

  -- =====================================================
  -- SUMMARY
  -- =====================================================
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SAMPLE DATA LOADED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Created:';
  RAISE NOTICE '   • 1 Worker profile';
  RAISE NOTICE '   • 2 Projects (1 open, 1 completed)';
  RAISE NOTICE '   • 2 Applications';
  RAISE NOTICE '   • 1 Completed contract';
  RAISE NOTICE '   • 1 Payment (₹13,200)';
  RAISE NOTICE '   • 1 Review (5 stars)';
  RAISE NOTICE '   • 2 Messages';
  RAISE NOTICE '   • 2 Notifications';
  RAISE NOTICE '   • 1 Verification (pending)';
  RAISE NOTICE '';
  RAISE NOTICE '👥 Accounts:';
  RAISE NOTICE '   Worker: yuvamayi2024@gmail.com';
  RAISE NOTICE '   Client: ram3sh.akula@gmail.com';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Contract ID: %', v_contract_id;
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Ready to test on your live site!';
  RAISE NOTICE '========================================';

END $$;

-- =====================================================
-- ADD FULL SAMPLE DATA
-- Assumes all tables already exist
-- Adds: Reviews, Messages, Notifications, Verification
-- =====================================================

DO $$
DECLARE
  v_worker_id UUID := 'f53776e1-82ae-4fd7-ba92-fb02b2765cdf';
  v_client_id UUID := '55a34790-b7bb-4330-9d0e-b33e89e74944';
  v_project_id UUID;
  v_contract_id UUID;
BEGIN

  RAISE NOTICE '🚀 Adding full sample data...';

  -- Get the project we created
  SELECT id INTO v_project_id FROM projects 
  WHERE client_id = v_client_id 
  ORDER BY created_at DESC LIMIT 1;

  RAISE NOTICE 'Found project: %', v_project_id;

  -- 1. CREATE A COMPLETED PROJECT FOR REVIEWS
  INSERT INTO projects (
    client_id, title, description, budget, 
    required_skills, duration_hours, status, deadline
  ) VALUES (
    v_client_id,
    'Completed Landing Page',
    'A beautiful landing page that was completed',
    15000, 
    ARRAY['React', 'Tailwind'],
    15, 
    'completed', 
    NOW() - INTERVAL '5 days'
  ) RETURNING id INTO v_project_id;

  RAISE NOTICE '✅ Completed project created';

  -- 2. CREATE COMPLETED CONTRACT (only base fields)
  INSERT INTO contracts (
    project_id, worker_id, contract_amount, 
    platform_fee_percentage, tds_percentage,
    nda_signed, conflict_declaration_signed, 
    status, started_at, completed_at
  ) VALUES (
    v_project_id, v_worker_id, 15000,
    10, 2,
    true, true, 
    'completed',
    NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 days'
  ) RETURNING id INTO v_contract_id;

  RAISE NOTICE '✅ Contract created: %', v_contract_id;

  -- 3. CREATE PAYMENT
  INSERT INTO payments (
    contract_id, payment_from, payment_to,
    gross_amount, platform_fee, tds_deducted, net_amount,
    status, payment_date
  ) VALUES (
    v_contract_id, v_client_id, v_worker_id,
    15000, 1500, 300, 13200,
    'completed', NOW() - INTERVAL '1 day'
  );

  RAISE NOTICE '✅ Payment created';

  -- 4. CREATE REVIEW
  BEGIN
    INSERT INTO reviews (
      contract_id, reviewer_id, reviewee_id,
      rating, review_text, is_visible
    ) VALUES (
      v_contract_id, v_client_id, v_worker_id, 5,
      'Excellent work! Highly recommend!', true
    );
    RAISE NOTICE '✅ Review created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Review creation failed: %', SQLERRM;
  END;

  -- 5. CREATE MESSAGES
  BEGIN
    INSERT INTO messages (
      conversation_id, sender_id, receiver_id, message_text, is_read
    ) VALUES
      (v_client_id::text || '_' || v_worker_id::text, v_client_id, v_worker_id,
       'Hi! Can we discuss the project?', true),
      (v_client_id::text || '_' || v_worker_id::text, v_worker_id, v_client_id,
       'Sure! I would love to discuss it.', false);
    RAISE NOTICE '✅ Messages created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Messages creation failed: %', SQLERRM;
  END;

  -- 6. CREATE NOTIFICATIONS
  BEGIN
    INSERT INTO notifications (user_id, type, title, message, link, is_read)
    VALUES
      (v_worker_id, 'review', 'New Review!', 'You received a 5-star review!', '/profile', false),
      (v_client_id, 'application', 'New Application', 'Someone applied to your project', '/projects', false);
    RAISE NOTICE '✅ Notifications created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Notifications creation failed: %', SQLERRM;
  END;

  -- 7. CREATE VERIFICATION
  BEGIN
    INSERT INTO verifications (user_id, verification_type, status, verification_data)
    VALUES (v_worker_id, 'pan', 'pending', '{"pan_number": "ABCDE1234F"}'::jsonb);
    RAISE NOTICE '✅ Verification created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️  Verification creation failed: %', SQLERRM;
  END;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ FULL SAMPLE DATA ADDED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Now you have:';
  RAISE NOTICE '   • 2 Projects (1 open, 1 completed)';
  RAISE NOTICE '   • 1 Completed contract';
  RAISE NOTICE '   • 1 Payment (₹13,200)';
  RAISE NOTICE '   • 1 Review (5 stars)';
  RAISE NOTICE '   • 2 Messages';
  RAISE NOTICE '   • 2 Notifications';
  RAISE NOTICE '   • 1 Verification';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Test ALL features now!';
  RAISE NOTICE '   - Reviews: Check worker profile';
  RAISE NOTICE '   - Messages: Go to /messages';
  RAISE NOTICE '   - Verification: Go to /admin/verifications';

END $$;

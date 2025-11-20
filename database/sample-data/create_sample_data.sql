-- =====================================================
-- 2ndShift Platform - Sample Data for Testing
-- Run this in Supabase SQL Editor AFTER creating test users
-- =====================================================

-- =====================================================
-- INSTRUCTIONS
-- =====================================================
-- 1. First, register these test accounts through the UI:
--    - worker@test.com (password: TestWorker123!)
--    - client@test.com (password: TestClient123!)
-- 
-- 2. Get their user IDs by running:
--    SELECT id, email, user_type FROM users WHERE email IN ('worker@test.com', 'client@test.com');
--
-- 3. Replace 'WORKER_USER_ID' and 'CLIENT_USER_ID' below with actual IDs
-- 4. Run this entire script

-- =====================================================
-- SET YOUR USER IDs HERE
-- =====================================================
-- Replace these with actual user IDs from step 2
DO $$
DECLARE
  worker_user_id UUID := 'WORKER_USER_ID'; -- Replace with actual worker ID
  client_user_id UUID := 'CLIENT_USER_ID'; -- Replace with actual client ID
BEGIN

-- =====================================================
-- WORKER PROFILE
-- =====================================================
INSERT INTO worker_profiles (user_id, skills, experience_years, hourly_rate, bio, is_verified, availability_hours)
VALUES (
  worker_user_id,
  ARRAY['React', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js', 'PostgreSQL', 'UI/UX'],
  5,
  1200,
  'Experienced full-stack developer with 5+ years building modern web applications. Specialized in React, Node.js, and cloud technologies. Delivered 50+ successful projects.',
  false,
  '{"monday": [9, 18], "tuesday": [9, 18], "wednesday": [9, 18], "thursday": [9, 18], "friday": [9, 18]}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE SET
  skills = EXCLUDED.skills,
  experience_years = EXCLUDED.experience_years,
  hourly_rate = EXCLUDED.hourly_rate,
  bio = EXCLUDED.bio;

-- =====================================================
-- SAMPLE PROJECTS (Created by client)
-- =====================================================
INSERT INTO projects (client_id, title, description, budget, required_skills, duration_hours, status, deadline) VALUES
  (
    client_user_id,
    'E-commerce Website Development',
    'Looking for an experienced developer to build a modern e-commerce website with payment integration, user authentication, and admin dashboard. Must have experience with React and Node.js.',
    75000,
    ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'],
    60,
    'open',
    NOW() + INTERVAL '45 days'
  ),
  (
    client_user_id,
    'Mobile App UI/UX Design',
    'Need a talented designer to create a complete mobile app design including wireframes, mockups, and interactive prototypes. Experience with Figma required.',
    35000,
    ARRAY['UI/UX', 'Figma', 'Design', 'Mobile'],
    25,
    'open',
    NOW() + INTERVAL '20 days'
  ),
  (
    client_user_id,
    'REST API Development',
    'Develop a RESTful API for a social media application with user management, posts, comments, and real-time notifications. MongoDB experience preferred.',
    45000,
    ARRAY['Node.js', 'MongoDB', 'API', 'WebSocket'],
    35,
    'open',
    NOW() + INTERVAL '30 days'
  ),
  (
    client_user_id,
    'Landing Page Development',
    'Create a beautiful, responsive landing page for a SaaS product. Should include animations, contact form, and SEO optimization.',
    15000,
    ARRAY['React', 'Next.js', 'Tailwind', 'SEO'],
    15,
    'open',
    NOW() + INTERVAL '10 days'
  ),
  (
    client_user_id,
    'Database Migration & Optimization',
    'Need expert help migrating from MySQL to PostgreSQL and optimizing queries for better performance. Experience with both databases required.',
    30000,
    ARRAY['PostgreSQL', 'MySQL', 'Database'],
    20,
    'open',
    NOW() + INTERVAL '15 days'
  );

-- =====================================================
-- SAMPLE APPLICATIONS (Worker applying to projects)
-- =====================================================
-- Get project IDs we just created
INSERT INTO applications (project_id, worker_id, cover_letter, proposed_rate, status)
SELECT 
  p.id,
  worker_user_id,
  'Hello! I have extensive experience in ' || p.required_skills[1] || ' and would love to work on this project. I have successfully completed similar projects and can deliver high-quality work within your timeline. My portfolio demonstrates my expertise. Let me know if you would like to discuss further!',
  1200,
  CASE 
    WHEN p.title LIKE '%Landing%' THEN 'accepted'::text
    WHEN p.title LIKE '%Database%' THEN 'pending'::text
    ELSE 'pending'::text
  END
FROM projects p
WHERE p.client_id = client_user_id
LIMIT 3;

-- =====================================================
-- SAMPLE CONTRACT (For completed Landing Page project)
-- =====================================================
-- Create a completed contract for review testing
WITH landing_page_project AS (
  SELECT id FROM projects 
  WHERE client_id = client_user_id 
  AND title LIKE '%Landing%' 
  LIMIT 1
)
INSERT INTO contracts (
  project_id,
  worker_id,
  contract_amount,
  platform_fee_percentage,
  platform_fee,
  tds_percentage,
  tds_amount,
  worker_payout,
  nda_signed,
  conflict_declaration_signed,
  status,
  started_at,
  completed_at
)
SELECT
  lp.id,
  worker_user_id,
  15000,
  10,
  1500,
  2,
  300,
  13200,
  true,
  true,
  'completed',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '2 days'
FROM landing_page_project lp;

-- =====================================================
-- SAMPLE PAYMENT (For completed contract)
-- =====================================================
WITH completed_contract AS (
  SELECT id FROM contracts
  WHERE worker_id = worker_user_id
  AND status = 'completed'
  LIMIT 1
)
INSERT INTO payments (
  contract_id,
  payment_from,
  payment_to,
  gross_amount,
  platform_fee,
  tds_deducted,
  net_amount,
  status,
  payment_date
)
SELECT
  cc.id,
  client_user_id,
  worker_user_id,
  15000,
  1500,
  300,
  13200,
  'completed',
  NOW() - INTERVAL '1 day'
FROM completed_contract cc;

-- =====================================================
-- SAMPLE REVIEW (Client reviewing worker)
-- =====================================================
WITH completed_contract AS (
  SELECT id FROM contracts
  WHERE worker_id = worker_user_id
  AND status = 'completed'
  LIMIT 1
)
INSERT INTO reviews (
  contract_id,
  reviewer_id,
  reviewee_id,
  rating,
  review_text,
  is_visible
)
SELECT
  cc.id,
  client_user_id,
  worker_user_id,
  5,
  'Excellent work! The landing page exceeded my expectations. Professional communication, timely delivery, and great attention to detail. Highly recommend!',
  true
FROM completed_contract cc;

-- =====================================================
-- SAMPLE MESSAGES (Conversation between worker and client)
-- =====================================================
-- Create a conversation
WITH conversation AS (
  SELECT (ARRAY[client_user_id::text, worker_user_id::text])[1:2] AS users
)
INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text, is_read, created_at)
VALUES
  -- Conversation ID format: sorted user IDs joined with underscore
  (
    (SELECT ARRAY_TO_STRING(ARRAY(SELECT unnest FROM unnest((SELECT users FROM conversation)) ORDER BY 1), '_')),
    client_user_id,
    worker_user_id,
    'Hi! I saw your application for the e-commerce project. Your profile looks great. Can we discuss the project requirements?',
    true,
    NOW() - INTERVAL '5 days'
  ),
  (
    (SELECT ARRAY_TO_STRING(ARRAY(SELECT unnest FROM unnest((SELECT users FROM conversation)) ORDER BY 1), '_')),
    worker_user_id,
    client_user_id,
    'Hello! Thank you for reaching out. Yes, I would love to discuss the project in detail. I have experience building similar e-commerce platforms.',
    true,
    NOW() - INTERVAL '4 days 23 hours'
  ),
  (
    (SELECT ARRAY_TO_STRING(ARRAY(SELECT unnest FROM unnest((SELECT users FROM conversation)) ORDER BY 1), '_')),
    client_user_id,
    worker_user_id,
    'Great! The main requirements are: user authentication, product catalog, shopping cart, and payment integration with Stripe. Do you have experience with these?',
    true,
    NOW() - INTERVAL '4 days 22 hours'
  ),
  (
    (SELECT ARRAY_TO_STRING(ARRAY(SELECT unnest FROM unnest((SELECT users FROM conversation)) ORDER BY 1), '_')),
    worker_user_id,
    client_user_id,
    'Yes, I have implemented all of these features in my previous projects. I can show you some examples. When would you like to start?',
    false,
    NOW() - INTERVAL '4 days 21 hours'
  );

-- =====================================================
-- SAMPLE NOTIFICATION
-- =====================================================
INSERT INTO notifications (user_id, type, title, message, link, is_read)
VALUES
  (
    worker_user_id,
    'application',
    'Application Accepted',
    'Your application for "Landing Page Development" has been accepted!',
    '/contracts',
    false
  ),
  (
    client_user_id,
    'review',
    'New Application',
    'You have a new application for "E-commerce Website Development"',
    '/projects',
    false
  ),
  (
    worker_user_id,
    'message',
    'New Message',
    'You have a new message from a client',
    '/messages',
    false
  );

-- =====================================================
-- SAMPLE VERIFICATION (Worker submitting PAN)
-- =====================================================
INSERT INTO verifications (
  user_id,
  verification_type,
  status,
  verification_data
)
VALUES
  (
    worker_user_id,
    'pan',
    'pending',
    '{"pan_number": "ABCDE1234F"}'::jsonb
  ),
  (
    client_user_id,
    'pan',
    'verified',
    '{"pan_number": "XYZAB5678C"}'::jsonb
  );

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
RAISE NOTICE '✅ Sample data created successfully!';
RAISE NOTICE '';
RAISE NOTICE '📊 Summary:';
RAISE NOTICE '   - 1 Worker profile';
RAISE NOTICE '   - 5 Projects';
RAISE NOTICE '   - 3 Applications';
RAISE NOTICE '   - 1 Completed contract';
RAISE NOTICE '   - 1 Payment';
RAISE NOTICE '   - 1 Review';
RAISE NOTICE '   - 4 Messages';
RAISE NOTICE '   - 3 Notifications';
RAISE NOTICE '   - 2 Verifications';
RAISE NOTICE '';
RAISE NOTICE '🎉 Ready to test!';

END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify data was created:

-- Check projects
-- SELECT title, budget, status FROM projects;

-- Check applications
-- SELECT p.title, a.status FROM applications a JOIN projects p ON a.project_id = p.id;

-- Check contracts
-- SELECT contract_amount, status FROM contracts;

-- Check messages
-- SELECT message_text, created_at FROM messages ORDER BY created_at;

-- Check reviews
-- SELECT rating, review_text FROM reviews;
